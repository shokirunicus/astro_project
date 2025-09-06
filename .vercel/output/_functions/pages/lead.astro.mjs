import { c as createComponent, r as renderComponent, b as renderTemplate, F as Fragment, m as maybeRenderHead } from '../chunks/astro/server_CDXv8TJD.mjs';
import { $ as $$Base, a as $$Nav } from '../chunks/Base_BQHmndEO.mjs';
import { $ as $$Footer } from '../chunks/Footer_Dv69hvV5.mjs';
import { $ as $$Hero } from '../chunks/Hero_BOKCyTS3.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Lead = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "\u8CC7\u6599\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9 | AIHALO" }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "Hero", $$Hero, { "title": "\u7D4C\u55B6\u8005\u5411\u3051AI\u5C0E\u5165\u30AC\u30A4\u30C9", "subtitle": "\u30E1\u30FC\u30EB\u767B\u9332\u3067PDF\u3092\u304A\u9001\u308A\u3057\u307E\u3059" }, { "default": ($$result3) => renderTemplate(_a || (_a = __template([" ", `<div> <div id="tally-embed" data-tally-src="https://tally.so/r/wA7Xx5?transparentBackground=1&hideTitle=1" style="width: 100%; height: 600px;"></div> <noscript> <p>
\u304A\u4F7F\u3044\u306E\u74B0\u5883\u3067\u306F\u57CB\u3081\u8FBC\u307F\u304C\u8868\u793A\u3067\u304D\u307E\u305B\u3093\u3002
<a href="https://tally.so/r/wA7Xx5" target="_blank" rel="noopener">\u3053\u3061\u3089</a>
\u304B\u3089\u30D5\u30A9\u30FC\u30E0\u306B\u30A2\u30AF\u30BB\u30B9\u3057\u3066\u304F\u3060\u3055\u3044\u3002
</p> </noscript> </div> <script>
      (function() {
        const el = document.getElementById('tally-embed');
        if (!el) return;
        try {
          const base = el.getAttribute('data-tally-src');
          if (!base) return;
          const u = new URL(base, location.origin);
          const params = new URLSearchParams(location.search);
          const keys = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
          keys.forEach(k => { const v = params.get(k); if (v) u.searchParams.set(k, v); });
          if (document.referrer) u.searchParams.set('ref', document.referrer);
          el.setAttribute('data-tally-src', u.toString());
        } catch (e) { /* noop */ }
        function load() {
          if (window.Tally && typeof window.Tally.loadEmbeds === 'function') { window.Tally.loadEmbeds(); return; }
          const s = document.createElement('script');
          s.src = 'https://tally.so/widgets/embed.js';
          s.async = true;
          s.onload = () => { try { window.Tally.loadEmbeds(); } catch(_){} };
          document.body.appendChild(s);
        }
        load();
      })();
    <\/script> `])), maybeRenderHead()) })}  `, "footer": ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "footer" }, { "default": ($$result3) => renderTemplate`${renderComponent($$result3, "Footer", $$Footer, {})}` })}`, "nav": ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "nav" }, { "default": ($$result3) => renderTemplate`${renderComponent($$result3, "Nav", $$Nav, {})}` })}` })}`;
}, "/Users/purpl/Projects/astro_project/src/pages/lead.astro", void 0);

const $$file = "/Users/purpl/Projects/astro_project/src/pages/lead.astro";
const $$url = "/lead";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Lead,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
