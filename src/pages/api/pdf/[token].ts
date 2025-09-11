import crypto from 'node:crypto';
export const prerender = false;

function secHeaders(init?: HeadersInit) {
  const h = new Headers(init);
  h.set('X-Frame-Options', 'DENY');
  h.set('X-Content-Type-Options', 'nosniff');
  h.set('Cache-Control', 'no-store');
  return h;
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

export async function GET({ params }: { params: { token: string } }) {
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
  try {
    const doc = (payload as any)?.doc as string | undefined;
    if (blobBase && doc) dest = `${blobBase}/docs/${encodeURIComponent(doc)}.pdf`;
  } catch {}
  const h = secHeaders();
  h.set('Location', dest);
  return new Response(null, { status: 302, headers: h });
}
