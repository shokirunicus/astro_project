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
function parseStripeSigHeader(header) {
  if (!header) return null;
  const parts = header.split(",");
  const out = {};
  for (const p of parts) {
    const [k, v] = p.split("=");
    if (!k || !v) continue;
    const key = k.trim();
    const val = v.trim();
    (out[key] ||= []).push(val);
  }
  const t = out["t"]?.[0];
  const v1s = out["v1"] || [];
  if (!t || !v1s.length) return null;
  const ts = parseInt(t, 10);
  if (!Number.isFinite(ts)) return null;
  return { ts, v1s };
}
function verifyStripeSignature(raw, header, secret, toleranceSec = 300) {
  const parsed = parseStripeSigHeader(header);
  if (!parsed) return false;
  const nowSec = Math.floor(Date.now() / 1e3);
  if (Math.abs(nowSec - parsed.ts) > toleranceSec) return false;
  const payload = `${parsed.ts}.${raw}`;
  const expectedHex = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const expected = Buffer.from(expectedHex, "hex");
  for (const sig of parsed.v1s) {
    try {
      const candidate = Buffer.from(sig, "hex");
      if (candidate.length === expected.length && crypto.timingSafeEqual(candidate, expected)) {
        return true;
      }
    } catch {
    }
  }
  return false;
}
async function POST({ request }) {
  const secret = process.env["STRIPE_WEBHOOK_SECRET"] || "";
  if (!secret) {
    const h = secHeaders({ "content-type": "application/json" });
    return new Response(JSON.stringify({ ok: false, error: "server_misconfigured" }), { status: 500, headers: h });
  }
  const sigHeader = request.headers.get("stripe-signature");
  const rawBody = await request.text();
  if (!sigHeader || !verifyStripeSignature(rawBody, sigHeader, secret, 300)) {
    try {
      console.warn(`[${(/* @__PURE__ */ new Date()).toISOString()}] stripe_signature_invalid`);
    } catch {
    }
    const h = secHeaders({ "content-type": "application/json" });
    return new Response(JSON.stringify({ ok: false, error: "signature_invalid" }), { status: 400, headers: h });
  }
  try {
    const event = JSON.parse(rawBody);
    switch (event.type) {
      case "checkout.session.completed": {
        break;
      }
      default:
        break;
    }
    const h = secHeaders({ "content-type": "application/json" });
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: h });
  } catch {
    try {
      console.error(`[${(/* @__PURE__ */ new Date()).toISOString()}] stripe_event_invalid_json`);
    } catch {
    }
    const h = secHeaders({ "content-type": "application/json" });
    return new Response(JSON.stringify({ ok: false, error: "invalid_json" }), { status: 400, headers: h });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
