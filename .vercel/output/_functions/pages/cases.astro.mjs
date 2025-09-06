import { c as createComponent, r as renderComponent, b as renderTemplate, F as Fragment, m as maybeRenderHead } from '../chunks/astro/server_CDXv8TJD.mjs';
import { $ as $$Base, a as $$Nav } from '../chunks/Base_BQHmndEO.mjs';
import { $ as $$Footer } from '../chunks/Footer_Dv69hvV5.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Cases | AIHALO" }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<h1>ケーススタディ一覧</h1> <p>MDXコンテンツ（準備中）。</p>  `, "footer": ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "footer" }, { "default": ($$result3) => renderTemplate`${renderComponent($$result3, "Footer", $$Footer, {})}` })}`, "nav": ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "nav" }, { "default": ($$result3) => renderTemplate`${renderComponent($$result3, "Nav", $$Nav, {})}` })}` })}`;
}, "/Users/purpl/Projects/astro_project/src/pages/cases/index.astro", void 0);

const $$file = "/Users/purpl/Projects/astro_project/src/pages/cases/index.astro";
const $$url = "/cases";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
