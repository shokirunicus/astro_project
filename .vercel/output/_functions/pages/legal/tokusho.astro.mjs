import { c as createComponent, r as renderComponent, b as renderTemplate, F as Fragment, m as maybeRenderHead } from '../../chunks/astro/server_CDXv8TJD.mjs';
import { $ as $$Base, a as $$Nav } from '../../chunks/Base_BQHmndEO.mjs';
import { $ as $$Footer } from '../../chunks/Footer_Dv69hvV5.mjs';
export { renderers } from '../../renderers.mjs';

const $$Tokusho = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "\u7279\u5B9A\u5546\u53D6\u5F15\u6CD5\u306B\u57FA\u3065\u304F\u8868\u8A18 | AIHALO" }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<h1>特定商取引法に基づく表記（ドラフト）</h1> <p>有償販売開始時に記載事項を整備。</p>  `, "footer": ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "footer" }, { "default": ($$result3) => renderTemplate`${renderComponent($$result3, "Footer", $$Footer, {})}` })}`, "nav": ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "nav" }, { "default": ($$result3) => renderTemplate`${renderComponent($$result3, "Nav", $$Nav, {})}` })}` })}`;
}, "/Users/purpl/Projects/astro_project/src/pages/legal/tokusho.astro", void 0);

const $$file = "/Users/purpl/Projects/astro_project/src/pages/legal/tokusho.astro";
const $$url = "/legal/tokusho";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Tokusho,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
