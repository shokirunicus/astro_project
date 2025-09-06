import crypto from 'node:crypto';
import { a as absoluteUrl } from '../../chunks/site_BPGYfmJL.mjs';
export { renderers } from '../../renderers.mjs';

const rateStore = /* @__PURE__ */ new Map();
function readInt(name, def) {
  const v = process.env[name];
  const n = v ? parseInt(v, 10) : NaN;
  return Number.isFinite(n) && n > 0 ? n : def;
}
const WINDOW_MS = readInt("RATE_LIMIT_WINDOW_MS", 6e4);
const LIMIT_MAX = readInt("RATE_LIMIT_MAX", 5);
function now() {
  return Date.now();
}
function getIp(req) {
  const h = req.headers;
  const xff = h.get("x-forwarded-for") || "";
  if (xff) return xff.split(",")[0].trim();
  const real = h.get("x-real-ip") || h.get("cf-connecting-ip");
  if (real) return real;
  return "unknown:fallback";
}
function checkRate(ip) {
  const rec = rateStore.get(ip);
  const t = now();
  if (!rec || t >= rec.resetAt) {
    rateStore.set(ip, { count: 1, resetAt: t + WINDOW_MS });
    return { ok: true };
  }
  if (rec.count >= LIMIT_MAX) {
    return { ok: false, resetAt: rec.resetAt };
  }
  rec.count += 1;
  return { ok: true };
}
function isEmail(v) {
  if (typeof v !== "string") return false;
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(v.trim());
}
function hasConsent(v) {
  if (v === true || v === 1 || v === "1") return true;
  if (typeof v === "string") return ["true", "on", "yes"].includes(v.toLowerCase());
  return false;
}
function secHeaders(init) {
  const h = new Headers(init);
  h.set("X-Frame-Options", "DENY");
  h.set("X-Content-Type-Options", "nosniff");
  return h;
}
const prerender = false;
function base64url(buf) {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function signToken(payload, secret) {
  const data = Buffer.from(JSON.stringify(payload));
  const sig = crypto.createHmac("sha256", secret).update(data).digest();
  return `${base64url(data)}.${base64url(sig)}`;
}
async function parseBody(request) {
  const ctRaw = request.headers.get("content-type") || "";
  const ct = ctRaw.toLowerCase();
  try {
    if (ct.startsWith("application/json")) {
      return await request.json();
    }
    if (ct.startsWith("application/x-www-form-urlencoded") || ct.startsWith("multipart/form-data")) {
      const fd = await request.formData();
      return Object.fromEntries(fd.entries());
    }
    const text = await request.text();
    if (text && /\w+=/.test(text)) {
      const params = new URLSearchParams(text);
      return Object.fromEntries(params.entries());
    }
    if (text && (text.trim().startsWith("{") || text.trim().startsWith("["))) {
      try {
        return JSON.parse(text);
      } catch {
      }
    }
    return {};
  } catch {
    return {};
  }
}
async function sendEmailViaResend(to, token) {
  try {
    const apiKey = process.env["RESEND_API_KEY"];
    if (!apiKey) return;
    const from = process.env["RESEND_FROM"] || "no-reply@example.com";
    const subject = process.env["RESEND_SUBJECT"] || "AIHALO 資料ダウンロードリンク";
    const link = token ? absoluteUrl(`/api/pdf/${encodeURIComponent(token)}`) : void 0;
    const text = link ? `資料のダウンロードリンク: ${link}
本リンクは24時間有効です。` : "資料のダウンロード準備が整い次第、別途ご案内します。";
    const html = link ? `<p>資料のダウンロードリンクは <a href="${link}">${link}</a> です。<br/>このリンクは24時間有効です。</p>` : "<p>資料のダウンロード準備が整い次第、別途ご案内します。</p>";
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ from, to, subject, text, html })
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      try {
        console.error("[Resend] Email sending failed:", error);
      } catch {
      }
    }
  }
}
async function POST({ request }) {
  try {
    const ip = getIp(request);
    const rl = checkRate(ip);
    if (!rl.ok) {
      const h2 = secHeaders({ "content-type": "application/json", "retry-after": Math.max(0, Math.ceil((rl.resetAt - now()) / 1e3)).toString() });
      return new Response(JSON.stringify({ ok: false, error: "rate_limited" }), { status: 429, headers: h2 });
    }
    const body = await parseBody(request);
    if (typeof body.hp === "string" && body.hp.trim().length > 0) {
      const h2 = secHeaders({ "content-type": "application/json" });
      return new Response(JSON.stringify({ ok: false, error: "honeypot" }), { status: 400, headers: h2 });
    }
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const company = typeof body.company === "string" ? body.company.trim() : "";
    const consent = hasConsent(body.consent);
    if (!isEmail(email) || !consent) {
      const h2 = secHeaders({ "content-type": "application/json" });
      return new Response(JSON.stringify({ ok: false, error: "validation" }), { status: 400, headers: h2 });
    }
    const secret = process.env["LEAD_HMAC_SECRET"];
    if (!secret) {
      const h2 = secHeaders({ "content-type": "application/json" });
      return new Response(
        JSON.stringify({ ok: false, error: "server_misconfigured" }),
        { status: 500, headers: h2 }
      );
    }
    const exp = now() + 24 * 60 * 60 * 1e3;
    const token = signToken({ sub: email, name, company, exp, purpose: "pdf" }, secret);
    if (token) {
      await sendEmailViaResend(email, token).catch(() => {
      });
    }
    const ct = request.headers.get("content-type") || "";
    const accept = request.headers.get("accept") || "";
    if (ct.includes("application/x-www-form-urlencoded") || ct.includes("multipart/form-data")) {
      const h2 = secHeaders();
      h2.set("Location", "/thanks?s=lead");
      return new Response(null, { status: 303, headers: h2 });
    }
    if (accept.includes("text/html")) {
      const h2 = secHeaders();
      h2.set("Location", "/thanks?s=lead");
      return new Response(null, { status: 303, headers: h2 });
    }
    const h = secHeaders({ "content-type": "application/json" });
    return new Response(JSON.stringify({ ok: true, token }), { status: 200, headers: h });
  } catch (err) {
    try {
      console.error(`[${(/* @__PURE__ */ new Date()).toISOString()}] lead_api_error`, err);
    } catch {
    }
    const h = secHeaders({ "content-type": "application/json" });
    return new Response(JSON.stringify({ ok: false, error: "server_error" }), { status: 500, headers: h });
  }
}
const GC_INTERVAL = 9e5;
const MAX_ENTRIES = 1e4;
const processId = typeof process !== "undefined" && process.pid || Math.random().toString(36);
const GC_FLAG = Symbol.for(`aihalo.rate.gc.${processId}`);
if (!globalThis[GC_FLAG]) {
  globalThis[GC_FLAG] = true;
  setInterval(() => {
    try {
      const cutoff = now() - WINDOW_MS;
      let cleaned = 0;
      for (const [ip, rec] of rateStore) {
        if (rec.resetAt < cutoff) {
          rateStore.delete(ip);
          cleaned++;
        }
      }
      if (rateStore.size > MAX_ENTRIES) {
        const entries = Array.from(rateStore.entries()).sort((a, b) => a[1].resetAt - b[1].resetAt);
        const toDelete = entries.slice(0, rateStore.size - MAX_ENTRIES);
        toDelete.forEach(([ip]) => rateStore.delete(ip));
      }
      if (process.env.NODE_ENV === "development" && cleaned > 0) {
        try {
          console.log(`[GC] Cleaned ${cleaned} entries, current size: ${rateStore.size}`);
        } catch {
        }
      }
    } catch (error) {
      try {
        console.error("[GC] Failed:", error);
      } catch {
      }
    }
  }, GC_INTERVAL);
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
