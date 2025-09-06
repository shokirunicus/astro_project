import crypto from 'node:crypto';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
function secHeaders(init) {
  const h = new Headers(init);
  h.set("X-Frame-Options", "DENY");
  h.set("X-Content-Type-Options", "nosniff");
  h.set("Cache-Control", "no-store");
  return h;
}
function b64uToBuf(s) {
  return Buffer.from(s, "base64url");
}
function verifyToken(token, secret) {
  if (!token || !secret) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [dataB64u, sigB64u] = parts;
  let data, sig;
  try {
    data = b64uToBuf(dataB64u);
    sig = b64uToBuf(sigB64u);
  } catch {
    return null;
  }
  const expected = crypto.createHmac("sha256", secret).update(data).digest();
  if (expected.length !== sig.length || !crypto.timingSafeEqual(expected, sig)) return null;
  try {
    const payload = JSON.parse(data.toString("utf8"));
    if (!payload || typeof payload !== "object") return null;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    if (payload.purpose !== "pdf") return null;
    return payload;
  } catch {
    return null;
  }
}
async function GET({ params }) {
  const token = params.token;
  const secret = process.env["LEAD_HMAC_SECRET"] || "";
  const pdfUrl = process.env["PDF_DOWNLOAD_URL"] || "";
  if (!secret || !pdfUrl) {
    const h2 = secHeaders({ "content-type": "application/json" });
    return new Response(JSON.stringify({ ok: false, error: "server_misconfigured" }), { status: 500, headers: h2 });
  }
  const payload = verifyToken(token, secret);
  if (!payload) {
    try {
      const [d] = token.split(".");
      const { exp } = JSON.parse(Buffer.from(d, "base64url").toString("utf8"));
      if (typeof exp === "number" && exp < Date.now()) {
        const h3 = secHeaders({ "content-type": "application/json" });
        return new Response(JSON.stringify({ ok: false, error: "expired" }), { status: 410, headers: h3 });
      }
    } catch {
    }
    const h2 = secHeaders({ "content-type": "application/json" });
    return new Response(JSON.stringify({ ok: false, error: "invalid_token" }), { status: 400, headers: h2 });
  }
  const h = secHeaders();
  h.set("Location", pdfUrl);
  return new Response(null, { status: 302, headers: h });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
