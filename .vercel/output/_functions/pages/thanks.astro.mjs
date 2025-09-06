import { c as createComponent, a as createAstro, r as renderComponent, b as renderTemplate, F as Fragment, m as maybeRenderHead } from '../chunks/astro/server_CDXv8TJD.mjs';
import { $ as $$Base, a as $$Nav } from '../chunks/Base_BQHmndEO.mjs';
import { $ as $$Footer } from '../chunks/Footer_Dv69hvV5.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Thanks = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Thanks;
  const source = Astro2.url.searchParams.get("s") || "lead";
  const messages = {
    lead: {
      title: "\u30EA\u30FC\u30C9\u767B\u9332\u3042\u308A\u304C\u3068\u3046\u3054\u3056\u3044\u307E\u3059",
      text: "\u767B\u9332\u306E\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u5B9B\u306B\u3054\u6848\u5185\u3092\u304A\u9001\u308A\u3057\u307E\u3057\u305F\u3002\u5C4A\u304B\u306A\u3044\u5834\u5408\u306F\u8FF7\u60D1\u30E1\u30FC\u30EB\u3092\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044\u3002"
    },
    contact: {
      title: "\u304A\u554F\u3044\u5408\u308F\u305B\u3042\u308A\u304C\u3068\u3046\u3054\u3056\u3044\u307E\u3059",
      text: "\u62C5\u5F53\u8005\u3088\u308A2\u55B6\u696D\u65E5\u4EE5\u5185\u306B\u3054\u9023\u7D61\u3044\u305F\u3057\u307E\u3059\u3002"
    },
    purchase: {
      title: "\u3054\u8CFC\u5165\u3042\u308A\u304C\u3068\u3046\u3054\u3056\u3044\u307E\u3059",
      text: "\u6C7A\u6E08\u78BA\u8A8D\u5F8C\u3001\u9818\u53CE\u66F8\u3068\u6B21\u306E\u30B9\u30C6\u30C3\u30D7\u3092\u3054\u6848\u5185\u3057\u307E\u3059\u3002"
    }
  };
  const msg = messages[source] || messages.lead;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": `${msg.title} | AIHALO` }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="max-w-2xl mx-auto text-center py-12"> <h1 class="text-3xl md:text-4xl font-semibold text-navy">${msg.title}</h1> <p class="mt-4 text-slate-700">${msg.text}</p> <div class="mt-8 flex items-center justify-center gap-4"> <a href="/" class="inline-block rounded-lg bg-cyan px-6 py-3 text-navy font-bold hover:bg-cyan/90 transition-colors">トップへ戻る</a> <a href="/blog" class="inline-block rounded-lg border-2 border-white/80 px-6 py-3 text-white font-bold hover:bg-white/10 transition-colors">最新の洞察を見る</a> </div> </section>  `, "footer": ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "footer" }, { "default": ($$result3) => renderTemplate`${renderComponent($$result3, "Footer", $$Footer, {})}` })}`, "nav": ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "nav" }, { "default": ($$result3) => renderTemplate`${renderComponent($$result3, "Nav", $$Nav, {})}` })}` })}`;
}, "/Users/purpl/Projects/astro_project/src/pages/thanks.astro", void 0);

const $$file = "/Users/purpl/Projects/astro_project/src/pages/thanks.astro";
const $$url = "/thanks";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Thanks,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
