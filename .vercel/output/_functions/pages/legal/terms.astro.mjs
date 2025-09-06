import { c as createComponent, r as renderComponent, b as renderTemplate, F as Fragment, m as maybeRenderHead } from '../../chunks/astro/server_CDXv8TJD.mjs';
import { $ as $$Base, a as $$Nav } from '../../chunks/Base_BQHmndEO.mjs';
import { $ as $$Footer } from '../../chunks/Footer_Dv69hvV5.mjs';
export { renderers } from '../../renderers.mjs';

const $$Terms = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "\u5229\u7528\u898F\u7D04 | AIHALO" }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<h1>利用規約（ドラフト）</h1> <p>後日、法務レビュー後に確定。</p>  `, "footer": ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "footer" }, { "default": ($$result3) => renderTemplate`${renderComponent($$result3, "Footer", $$Footer, {})}` })}`, "nav": ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "nav" }, { "default": ($$result3) => renderTemplate`${renderComponent($$result3, "Nav", $$Nav, {})}` })}` })}`;
}, "/Users/purpl/Projects/astro_project/src/pages/legal/terms.astro", void 0);

const $$file = "/Users/purpl/Projects/astro_project/src/pages/legal/terms.astro";
const $$url = "/legal/terms";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Terms,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
