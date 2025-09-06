import { c as createComponent, a as createAstro, r as renderComponent, b as renderTemplate, F as Fragment, m as maybeRenderHead } from '../../chunks/astro/server_CDXv8TJD.mjs';
import { $ as $$Base, a as $$Nav } from '../../chunks/Base_BQHmndEO.mjs';
import { $ as $$Footer } from '../../chunks/Footer_Dv69hvV5.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$slug = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": `Case: ${slug} | AIHALO` }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<h1>Case: ${slug}</h1> <p>詳細ページ（MDX読み込み予定）。</p>  `, "footer": ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "footer" }, { "default": ($$result3) => renderTemplate`${renderComponent($$result3, "Footer", $$Footer, {})}` })}`, "nav": ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "nav" }, { "default": ($$result3) => renderTemplate`${renderComponent($$result3, "Nav", $$Nav, {})}` })}` })}`;
}, "/Users/purpl/Projects/astro_project/src/pages/cases/[slug].astro", void 0);

const $$file = "/Users/purpl/Projects/astro_project/src/pages/cases/[slug].astro";
const $$url = "/cases/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
