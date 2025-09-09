import crypto from 'node:crypto';
export const prerender = false;

function secHeaders(init?: HeadersInit) {
  const h = new Headers(init);
  h.set('X-Frame-Options', 'DENY');
  h.set('X-Content-Type-Options', 'nosniff');
  h.set('Cache-Control', 'no-store');
  return h;
}

function envVar(name: string): string | undefined {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ie = (import.meta as any)?.env;
    return (ie && ie[name]) ?? process.env[name];
  } catch {
    return process.env[name];
  }
}

function getIp(req: Request) {
  const h = req.headers;
  const xff = h.get('x-forwarded-for') || '';
  if (xff) return xff.split(',')[0].trim();
  const real = h.get('x-real-ip') || h.get('cf-connecting-ip');
  if (real) return real;
  return 'unknown:fallback';
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

// ---- In-memory usage guard (one-time token) ----
type UsageRec = { count: number; exp: number };
const usedTokens: Map<string, UsageRec> = new Map();
const GC_INTERVAL_MS = 15 * 60 * 1000;
const USED_MAX = 50000;
const gcFlag = Symbol.for('aihalo.pdf.gc');
// @ts-ignore
if (!(globalThis as any)[gcFlag]) {
  // @ts-ignore
  (globalThis as any)[gcFlag] = true;
  setInterval(() => {
    try {
      const now = Date.now();
      for (const [tok, rec] of usedTokens) {
        if (rec.exp < now) usedTokens.delete(tok);
      }
      if (usedTokens.size > USED_MAX) {
        const arr = Array.from(usedTokens.entries()).sort((a, b) => a[1].exp - b[1].exp);
        const overflow = arr.slice(0, usedTokens.size - USED_MAX);
        overflow.forEach(([k]) => usedTokens.delete(k));
      }
    } catch {}
  }, GC_INTERVAL_MS);
}

export async function GET({ params, request }: { params: { token: string }, request: Request }) {
  const token = params.token;
  const secret = envVar('LEAD_HMAC_SECRET') || '';
  const pdfUrl = envVar('PDF_DOWNLOAD_URL') || '';

  if (!secret || !pdfUrl) {
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

  // IP制約（発行時IPと一致必須、発行時にIPが入っていれば）
  try {
    const reqIp = getIp(request);
    if (payload.ip && reqIp && payload.ip !== reqIp) {
      const h = secHeaders({ 'content-type': 'application/json' });
      return new Response(JSON.stringify({ ok: false, error: 'ip_mismatch' }), { status: 403, headers: h });
    }
  } catch {}

  // ワンタイム使用（一度使ったトークンは失効）
  const maxUses = typeof payload.maxUses === 'number' ? payload.maxUses : 1;
  const rec = usedTokens.get(token) || { count: 0, exp: payload.exp || (Date.now() + 3600_000) };
  if (rec.count >= maxUses) {
    const h = secHeaders({ 'content-type': 'application/json' });
    return new Response(JSON.stringify({ ok: false, error: 'used' }), { status: 410, headers: h });
  }
  rec.count += 1;
  rec.exp = payload.exp || rec.exp;
  usedTokens.set(token, rec);

  // Optional: add per-token download counters or logging here
  const h = secHeaders();
  h.set('Location', pdfUrl);
  return new Response(null, { status: 302, headers: h });
}
