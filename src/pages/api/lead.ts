// In-memory rate limiter (per-IP)
const rateStore: Map<string, { count: number; resetAt: number }> = new Map();

function readInt(name: string, def: number) {
  const v = process.env[name];
  const n = v ? parseInt(v, 10) : NaN;
  return Number.isFinite(n) && n > 0 ? n : def;
}

const WINDOW_MS = readInt('RATE_LIMIT_WINDOW_MS', 60_000);
const LIMIT_MAX = readInt('RATE_LIMIT_MAX', 5);

function now() {
  return Date.now();
}

function getIp(req: Request) {
  const h = req.headers;
  const xff = h.get('x-forwarded-for') || '';
  if (xff) return xff.split(',')[0].trim();
  const real = h.get('x-real-ip') || h.get('cf-connecting-ip');
  if (real) return real;
  // Fallback: use a constant to avoid User-Agent spoofing bypass
  return 'unknown:fallback';
}

function checkRate(ip: string) {
  const rec = rateStore.get(ip);
  const t = now();
  if (!rec || t >= rec.resetAt) {
    rateStore.set(ip, { count: 1, resetAt: t + WINDOW_MS });
    return { ok: true } as const;
  }
  if (rec.count >= LIMIT_MAX) {
    return { ok: false, resetAt: rec.resetAt } as const;
  }
  rec.count += 1;
  return { ok: true } as const;
}

function isEmail(v: unknown): v is string {
  if (typeof v !== 'string') return false;
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(v.trim());
}

function hasConsent(v: any): boolean {
  if (v === true || v === 1 || v === '1') return true;
  if (typeof v === 'string') return ['true', 'on', 'yes'].includes(v.toLowerCase());
  return false;
}

function secHeaders(init?: HeadersInit) {
  const h = new Headers(init);
  h.set('X-Frame-Options', 'DENY');
  h.set('X-Content-Type-Options', 'nosniff');
  return h;
}

import crypto from 'node:crypto';
import { absoluteUrl } from '../../lib/site';
import { notifySlack } from '../../lib/slack';
import { google } from 'googleapis';
export const prerender = false;

function base64url(buf: Buffer) {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function signToken(payload: Record<string, any>, secret: string) {
  const data = Buffer.from(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', secret).update(data).digest();
  return `${base64url(data)}.${base64url(sig)}`;
}

async function parseBody(request: Request): Promise<Record<string, any>> {
  const ctRaw = request.headers.get('content-type') || '';
  const ct = ctRaw.toLowerCase();
  try {
    if (ct.startsWith('application/json')) {
      return (await request.json()) as any;
    }
    if (ct.startsWith('application/x-www-form-urlencoded') || ct.startsWith('multipart/form-data')) {
      const fd = await request.formData();
      return Object.fromEntries(fd.entries());
    }
    // Fallbacks: attempt to parse text as querystring, then JSON
    const text = await request.text();
    if (text && /\w+=/.test(text)) {
      const params = new URLSearchParams(text);
      return Object.fromEntries(params.entries());
    }
    if (text && (text.trim().startsWith('{') || text.trim().startsWith('['))) {
      try { return JSON.parse(text); } catch {}
    }
    return {};
  } catch {
    return {};
  }
}

type ResendResult = { status?: number; body?: string };

async function sendEmailViaResend(to: string, token?: string): Promise<ResendResult | undefined> {
  try {
    const apiKey = process.env['RESEND_API_KEY'];
    if (!apiKey) return; // silently skip if not configured
    const from = process.env['RESEND_FROM'] || 'no-reply@example.com';
    const subject = process.env['RESEND_SUBJECT'] || 'AIHALO 資料ダウンロードリンク';
    const debugLog = ((process.env['LEAD_DEBUG'] || '').toLowerCase() === '1' || (process.env['LEAD_DEBUG'] || '').toLowerCase() === 'true');
    const link = token ? absoluteUrl(`/api/pdf/${encodeURIComponent(token)}`) : undefined;
    const text = link
      ? `資料のダウンロードリンク: ${link}\n本リンクは24時間有効です。`
      : '資料のダウンロード準備が整い次第、別途ご案内します。';
    const html = link
      ? `<p>資料のダウンロードリンクは <a href="${link}">${link}</a> です。<br/>このリンクは24時間有効です。</p>`
      : '<p>資料のダウンロード準備が整い次第、別途ご案内します。</p>';
    // Anti-spam headers: Reply-To and List-Unsubscribe
    const m = from.match(/<([^>]+)>/);
    const fromEmail = (m ? m[1] : from).trim();
    const fromDomain = fromEmail.includes('@') ? fromEmail.split('@')[1] : undefined;
    const replyToEnv = (process.env['RESEND_REPLY_TO'] || '').trim();
    const reply_to = replyToEnv || fromEmail;
    let listUnsub = (process.env['RESEND_LIST_UNSUBSCRIBE'] || '').trim();
    if (!listUnsub && fromDomain) {
      listUnsub = `<mailto:${fromEmail}>, <https://${fromDomain}/unsubscribe>`;
    }
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        text,
        html,
        reply_to,
        headers: listUnsub ? { 'List-Unsubscribe': listUnsub } : undefined,
      }),
    });
    let bodyTxt = '';
    try { bodyTxt = await resp.text(); } catch {}
    if (debugLog) {
      try { console.log('[Resend] send status:', resp.status, 'body:', bodyTxt?.slice(0, 200)); } catch {}
    }
    return { status: resp.status, body: bodyTxt?.slice(0, 200) };
  } catch (error) {
    // 開発環境ではエラーをログ出力（本番ではsilent failで情報漏洩を防止）
    if (process.env.NODE_ENV === 'development') {
      try { console.error('[Resend] Email sending failed:', error); } catch {}
    }
    return undefined;
  }
}

export async function POST({ request }: { request: Request }) {
  try {
    // Rate limit
    const ip = getIp(request);
    const rl = checkRate(ip);
    if (!rl.ok) {
      const h = secHeaders({ 'content-type': 'application/json', 'retry-after': Math.max(0, Math.ceil((rl.resetAt - now()) / 1000)).toString() });
      return new Response(JSON.stringify({ ok: false, error: 'rate_limited' }), { status: 429, headers: h });
    }

    const body = await parseBody(request);

    // Honeypot
    if (typeof body.hp === 'string' && body.hp.trim().length > 0) {
      const h = secHeaders({ 'content-type': 'application/json' });
      return new Response(JSON.stringify({ ok: false, error: 'honeypot' }), { status: 400, headers: h });
    }

    // Validation
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const company = typeof body.company === 'string' ? body.company.trim() : '';
    const consent = hasConsent(body.consent);

    if (!isEmail(email) || !consent) {
      const h = secHeaders({ 'content-type': 'application/json' });
      return new Response(JSON.stringify({ ok: false, error: 'validation' }), { status: 400, headers: h });
    }

    // Issue HMAC token (24h)
    const secret = process.env['LEAD_HMAC_SECRET'];
    if (!secret) {
      const h = secHeaders({ 'content-type': 'application/json' });
      return new Response(
        JSON.stringify({ ok: false, error: 'server_misconfigured' }),
        { status: 500, headers: h },
      );
    }
    const exp = now() + 24 * 60 * 60 * 1000;
    const token = signToken({ sub: email, name, company, exp, purpose: 'pdf' }, secret);

    // Email send (best-effort); Slack notify; Sheets upsert are optional next steps
    const debug = ((process.env['LEAD_DEBUG'] || '').toLowerCase() === '1' || (process.env['LEAD_DEBUG'] || '').toLowerCase() === 'true');
    const debugHeaders = (debug && ((process.env['LEAD_DEBUG_HEADERS'] || '').toLowerCase() === '1' || (process.env['LEAD_DEBUG_HEADERS'] || '').toLowerCase() === 'true'));
    let resendStatus: number | undefined = undefined;
    let resendBody: string | undefined = undefined;
    let slackStatus: number | undefined = undefined;
    let sheetsStatus: number | undefined = undefined;
    let sheetsMode: string | undefined = undefined;
    if (token) {
      // Fire-and-forget awaited minimally to reduce latency; ignore errors
      const rr = await sendEmailViaResend(email, token).catch(() => undefined);
      if (rr) { resendStatus = rr.status; resendBody = rr.body; }
      // Slack通知（ベストエフォート）
      try {
        slackStatus = await notifySlack({ email, name, company, ts: new Date().toISOString() }).catch(() => undefined);
      } catch {}
      // Google Sheets 追記（ベストエフォート）
      try {
        const r = await appendLeadRowToSheets({ email, name, company }).catch(() => undefined);
        if (r) { sheetsStatus = r.status; sheetsMode = r.mode; }
      } catch {}
    }

    // Respond: redirect for form submits, JSON for API
    const ct = request.headers.get('content-type') || '';
    const accept = request.headers.get('accept') || '';
    if (ct.includes('application/x-www-form-urlencoded') || ct.includes('multipart/form-data')) {
      const h = secHeaders();
      if (debugHeaders) {
        h.set('X-Debug-Resend', typeof resendStatus !== 'undefined' ? String(resendStatus) : 'none');
        if (resendBody) h.set('X-Debug-Resend-Body', resendBody);
        h.set('X-Debug-Slack', typeof slackStatus !== 'undefined' ? String(slackStatus) : 'none');
        h.set('X-Debug-Sheets', typeof sheetsStatus !== 'undefined' ? String(sheetsStatus) : 'none');
        if (sheetsMode) h.set('X-Debug-Sheets-Mode', sheetsMode);
      }
      h.set('Location', '/thanks?s=lead');
      return new Response(null, { status: 303, headers: h });
    }
    if (accept.includes('text/html')) {
      const h = secHeaders();
      if (debugHeaders) {
        h.set('X-Debug-Resend', typeof resendStatus !== 'undefined' ? String(resendStatus) : 'none');
        if (resendBody) h.set('X-Debug-Resend-Body', resendBody);
        h.set('X-Debug-Slack', typeof slackStatus !== 'undefined' ? String(slackStatus) : 'none');
        h.set('X-Debug-Sheets', typeof sheetsStatus !== 'undefined' ? String(sheetsStatus) : 'none');
        if (sheetsMode) h.set('X-Debug-Sheets-Mode', sheetsMode);
      }
      h.set('Location', '/thanks?s=lead');
      return new Response(null, { status: 303, headers: h });
    }
    const h = secHeaders({ 'content-type': 'application/json' });
    if (debugHeaders) {
      h.set('X-Debug-Resend', typeof resendStatus !== 'undefined' ? String(resendStatus) : 'none');
      if (resendBody) h.set('X-Debug-Resend-Body', resendBody);
      h.set('X-Debug-Slack', typeof slackStatus !== 'undefined' ? String(slackStatus) : 'none');
      h.set('X-Debug-Sheets', typeof sheetsStatus !== 'undefined' ? String(sheetsStatus) : 'none');
      if (sheetsMode) h.set('X-Debug-Sheets-Mode', sheetsMode);
    }
    return new Response(JSON.stringify({ ok: true, token }), { status: 200, headers: h });
  } catch (err) {
    try { console.error(`[${new Date().toISOString()}] lead_api_error`, err); } catch {}
    const h = secHeaders({ 'content-type': 'application/json' });
    return new Response(JSON.stringify({ ok: false, error: 'server_error' }), { status: 500, headers: h });
  }
}

// ---------------- Google Sheets integration ----------------
async function getSheetsClient(): Promise<{ sheets: any | null; mode: string }> {
  const debug = ((process.env['LEAD_DEBUG'] || '').toLowerCase() === '1' || (process.env['LEAD_DEBUG'] || '').toLowerCase() === 'true');
  try {
    const scopes = ['https://www.googleapis.com/auth/spreadsheets'];
    let auth: any;
    let mode = 'none';
    // Prefer explicit Base64 env to avoid multiline/whitespace pitfalls
    const b64 = (process.env['SHEETS_SERVICE_ACCOUNT_JSON'] || '').trim();
    if (!auth && b64) {
      try {
        const jsonStr = Buffer.from(b64, 'base64').toString('utf8');
        if (jsonStr.trim().startsWith('{')) {
          const credentials = JSON.parse(jsonStr);
          auth = new google.auth.GoogleAuth({ credentials, scopes });
          mode = 'base64_env';
        }
      } catch {}
    }
    // Then try GOOGLE_APPLICATION_CREDENTIALS (JSON string or Base64)
    const gac = (process.env['GOOGLE_APPLICATION_CREDENTIALS'] || '').trim();
    if (!auth && gac) {
      if (gac.startsWith('{')) {
        const credentials = JSON.parse(gac);
        auth = new google.auth.GoogleAuth({ credentials, scopes });
        mode = 'json_string';
      } else {
        try {
          const dec = Buffer.from(gac, 'base64').toString('utf8');
          if (dec.trim().startsWith('{')) {
            const credentials = JSON.parse(dec);
            auth = new google.auth.GoogleAuth({ credentials, scopes });
            mode = 'base64_gac';
          }
        } catch {}
      }
    }
    if (!auth) return { sheets: null, mode };
    const authClient = await auth.getClient();
    return { sheets: google.sheets({ version: 'v4', auth: authClient }), mode };
  } catch {
    return { sheets: null, mode: 'error' };
  }
}

async function appendLeadRowToSheets({ email, name, company }: { email: string; name: string; company: string }): Promise<{ status?: number; mode?: string } | undefined> {
  try {
    const spreadsheetId = process.env['SHEETS_SPREADSHEET_ID'];
    if (!spreadsheetId) return { status: undefined, mode: 'no_spreadsheet_id' };
    const { sheets, mode } = await getSheetsClient();
    if (!sheets) return { status: undefined, mode };
    const values = [[new Date().toISOString(), email, name, company]];
    const resp = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });
    // googleapis v140 doesn't expose HTTP status directly; emulate 200 when no error
    return { status: 200, mode };
  } catch {
    return { status: undefined, mode: 'append_error' };
  }
}

// best-effort GC for in-memory rate store to mitigate leak on long-lived processes
const GC_INTERVAL = 900_000; // 15分
const MAX_ENTRIES = 10000; // 最大エントリ数

// プロセス固有の初期化（複数プロセスでの競合を避ける）
const processId = (typeof process !== 'undefined' && (process as any).pid) || Math.random().toString(36);
const GC_FLAG = Symbol.for(`aihalo.rate.gc.${processId}`);

// @ts-ignore
if (!(globalThis as any)[GC_FLAG]) {
  // @ts-ignore
  (globalThis as any)[GC_FLAG] = true;
  setInterval(() => {
    try {
      const cutoff = now() - WINDOW_MS;
      let cleaned = 0;

      // 期限切れエントリの削除
      for (const [ip, rec] of rateStore) {
        if (rec.resetAt < cutoff) {
          rateStore.delete(ip);
          cleaned++;
        }
      }

      // エントリ数上限チェック（古いものから削除）
      if (rateStore.size > MAX_ENTRIES) {
        const entries = Array.from(rateStore.entries()).sort((a, b) => a[1].resetAt - b[1].resetAt);
        const toDelete = entries.slice(0, rateStore.size - MAX_ENTRIES);
        toDelete.forEach(([ip]) => rateStore.delete(ip));
      }

      // デバッグログ（開発環境のみ）
      if (process.env.NODE_ENV === 'development' && cleaned > 0) {
        try { console.log(`[GC] Cleaned ${cleaned} entries, current size: ${rateStore.size}`); } catch {}
      }
    } catch (error) {
      try { console.error('[GC] Failed:', error); } catch {}
    }
  }, GC_INTERVAL);
}
