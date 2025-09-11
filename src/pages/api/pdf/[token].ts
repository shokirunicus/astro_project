import crypto from 'node:crypto';
import { google } from 'googleapis';
export const prerender = false;

function secHeaders(init?: HeadersInit) {
  const h = new Headers(init);
  h.set('X-Frame-Options', 'DENY');
  h.set('X-Content-Type-Options', 'nosniff');
  h.set('Cache-Control', 'no-store');
  return h;
}

function getIp(req: Request) {
  const h = req.headers;
  const xff = h.get('x-forwarded-for') || '';
  if (xff) return xff.split(',')[0].trim();
  const real = h.get('x-real-ip') || h.get('cf-connecting-ip');
  if (real) return real;
  return 'unknown:fallback';
}

async function getSheetsClient(): Promise<{ sheets: any | null; mode: string }> {
  try {
    const scopes = ['https://www.googleapis.com/auth/spreadsheets'];
    let auth: any;
    let mode = 'none';
    const b64 = (process.env['SHEETS_SERVICE_ACCOUNT_JSON'] || '').trim();
    if (b64) {
      try {
        const jsonStr = Buffer.from(b64, 'base64').toString('utf8');
        if (jsonStr.trim().startsWith('{')) {
          const credentials = JSON.parse(jsonStr);
          auth = new google.auth.GoogleAuth({ credentials, scopes });
          mode = 'base64_env';
        }
      } catch {}
    }
    if (!auth) {
      const gac = (process.env['GOOGLE_APPLICATION_CREDENTIALS'] || '').trim();
      if (gac) {
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
    }
    if (!auth) return { sheets: null, mode };
    const authClient = await auth.getClient();
    return { sheets: google.sheets({ version: 'v4', auth: authClient }), mode };
  } catch {
    return { sheets: null, mode: 'error' };
  }
}

function b64uToBuf(s: string) {
  // Node 18+ supports 'base64url'
  return Buffer.from(s, 'base64url');
}

function verifyToken(token: string, secret: string) {
  if (!token || !secret) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [dataB64u, sigB64u] = parts;
  let data: Buffer, sig: Buffer;
  try {
    data = b64uToBuf(dataB64u);
    sig = b64uToBuf(sigB64u);
  } catch {
    return null;
  }
  const expected = crypto.createHmac('sha256', secret).update(data).digest();
  if (expected.length !== sig.length || !crypto.timingSafeEqual(expected, sig)) return null;
  try {
    const payload = JSON.parse(data.toString('utf8')) as any;
    if (!payload || typeof payload !== 'object') return null;
    if (typeof payload.exp !== 'number' || payload.exp < Date.now()) return null;
    if (payload.purpose !== 'pdf') return null;
    return payload;
  } catch {
    return null;
  }
}

export async function GET({ params, request }: { params: { token: string }, request: Request }) {
  const token = params.token;
  const secret = process.env['LEAD_HMAC_SECRET'] || '';
  const pdfUrlEnv = process.env['PDF_DOWNLOAD_URL'] || '';
  const blobBase = (process.env['BLOB_BASE_URL'] || '').replace(/\/$/, '');

  if (!secret || (!pdfUrlEnv && !blobBase)) {
    const h = secHeaders({ 'content-type': 'application/json' });
    return new Response(JSON.stringify({ ok: false, error: 'server_misconfigured' }), { status: 500, headers: h });
  }

  const payload = verifyToken(token, secret);
  if (!payload) {
    // Determine if likely expired
    try {
      const [d] = token.split('.');
      const { exp } = JSON.parse(Buffer.from(d, 'base64url').toString('utf8')) as any;
      if (typeof exp === 'number' && exp < Date.now()) {
        const h = secHeaders({ 'content-type': 'application/json' });
        return new Response(JSON.stringify({ ok: false, error: 'expired' }), { status: 410, headers: h });
      }
    } catch {}
    const h = secHeaders({ 'content-type': 'application/json' });
    return new Response(JSON.stringify({ ok: false, error: 'invalid_token' }), { status: 400, headers: h });
  }

  // Resolve destination (prefer Blob with doc slug)
  let dest = pdfUrlEnv;
  let docSlug: string | undefined;
  try {
    docSlug = (payload as any)?.doc as string | undefined;
    if (blobBase && docSlug) dest = `${blobBase}/docs/${encodeURIComponent(docSlug)}.pdf`;
  } catch {}

  // Best-effort: log download to Sheets (non-blocking)
  (async () => {
    try {
      const spreadsheetId = process.env['SHEETS_SPREADSHEET_ID'];
      if (spreadsheetId) {
        const { sheets } = await getSheetsClient();
        if (sheets) {
          const values = [[
            new Date().toISOString(),
            (payload as any)?.sub || '',
            docSlug || '',
            getIp(request),
          ]];
          await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Downloads!A1',
            valueInputOption: 'USER_ENTERED',
            requestBody: { values },
          });
        }
      }
    } catch {}
  })();

  // Stream the PDF via this endpoint (hide origin URL)
  try {
    const upstream = await fetch(dest, { cache: 'no-store' });
    if (!upstream.ok || !upstream.body) {
      const h = secHeaders({ 'content-type': 'application/json' });
      return new Response(JSON.stringify({ ok: false, error: 'upstream_unavailable' }), { status: 502, headers: h });
    }
    const filename = `${docSlug || 'document'}.pdf`;
    const h = secHeaders();
    h.set('Content-Type', 'application/pdf');
    const len = upstream.headers.get('content-length');
    if (len) h.set('Content-Length', len);
    h.set('Content-Disposition', `attachment; filename="${filename}"`);
    return new Response(upstream.body, { status: 200, headers: h });
  } catch {
    const h = secHeaders({ 'content-type': 'application/json' });
    return new Response(JSON.stringify({ ok: false, error: 'fetch_failed' }), { status: 502, headers: h });
  }
}
