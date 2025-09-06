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
  // Fallback: reduce global throttle blast radius by mixing UA
  const ua = h.get('user-agent') || 'na';
  return `unknown:${ua.slice(0, 16)}`;
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

async function sendEmailViaResend(to: string, token?: string) {
  try {
    const apiKey = process.env['RESEND_API_KEY'];
    if (!apiKey) return; // silently skip if not configured
    const from = process.env['RESEND_FROM'] || 'no-reply@example.com';
    const subject = process.env['RESEND_SUBJECT'] || 'AIHALO 資料ダウンロードリンク';
    const link = token ? absoluteUrl(`/api/pdf/${encodeURIComponent(token)}`) : undefined;
    const text = link
      ? `資料のダウンロードリンク: ${link}\n本リンクは24時間有効です。`
      : '資料のダウンロード準備が整い次第、別途ご案内します。';
    const html = link
      ? `<p>資料のダウンロードリンクは <a href="${link}">${link}</a> です。<br/>このリンクは24時間有効です。</p>`
      : '<p>資料のダウンロード準備が整い次第、別途ご案内します。</p>';
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to, subject, text, html }),
    });
  } catch {
    // Do not leak provider errors to client; best-effort
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
    const secret = process.env['LEAD_HMAC_SECRET'] || '';
    const exp = now() + 24 * 60 * 60 * 1000;
    const token = secret ? signToken({ sub: email, name, company, exp, purpose: 'pdf' }, secret) : undefined;

    // Email send (best-effort); Slack notify; Sheets upsert are optional next steps
    if (token) {
      // Fire-and-forget awaited minimally to reduce latency; ignore errors
      await sendEmailViaResend(email, token).catch(() => {});
    }

    // Respond: redirect for form submits, JSON for API
    const ct = request.headers.get('content-type') || '';
    const accept = request.headers.get('accept') || '';
    if (ct.includes('application/x-www-form-urlencoded') || ct.includes('multipart/form-data')) {
      const h = secHeaders();
      h.set('Location', '/thanks?s=lead');
      return new Response(null, { status: 303, headers: h });
    }
    if (accept.includes('text/html')) {
      const h = secHeaders();
      h.set('Location', '/thanks?s=lead');
      return new Response(null, { status: 303, headers: h });
    }
    const h = secHeaders({ 'content-type': 'application/json' });
    return new Response(JSON.stringify({ ok: true, token }), { status: 200, headers: h });
  } catch (err) {
    try { console.error(`[${new Date().toISOString()}] lead_api_error`, err); } catch {}
    const h = secHeaders({ 'content-type': 'application/json' });
    return new Response(JSON.stringify({ ok: false, error: 'server_error' }), { status: 500, headers: h });
  }
}

// best-effort GC for in-memory rate store to mitigate leak on long-lived processes
const GC_FLAG = Symbol.for('aihalo.rate.gc');
// @ts-ignore
if (!(globalThis as any)[GC_FLAG]) {
  // @ts-ignore
  (globalThis as any)[GC_FLAG] = true;
  setInterval(() => {
    try {
      const cutoff = now() - WINDOW_MS;
      for (const [ip, rec] of rateStore) {
        if (rec.resetAt < cutoff) rateStore.delete(ip);
      }
    } catch {}
  }, 3_600_000); // hourly
}
