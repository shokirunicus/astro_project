import { c as createComponent, r as renderComponent, b as renderTemplate, F as Fragment, m as maybeRenderHead, d as addAttribute } from '../chunks/astro/server_CDXv8TJD.mjs';
import { $ as $$Base, a as $$Nav } from '../chunks/Base_BQHmndEO.mjs';
import { $ as $$Footer } from '../chunks/Footer_Dv69hvV5.mjs';
import { $ as $$Seo } from '../chunks/Seo_DW7XwJq6.mjs';
import { g as getCollection } from '../chunks/_astro_content_DZy1kbD8.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  const sorted = posts.sort((a, b) => (b.data.date || "").localeCompare(a.data.date || ""));
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Blog | AIHALO", "description": "AIHALO\u306E\u30D6\u30ED\u30B0\u3002AI\u30B3\u30F3\u30B5\u30EB\u306E\u5B9F\u4F8B\u3068\u610F\u601D\u6C7A\u5B9A\u306B\u5F79\u7ACB\u3064\u77E5\u898B\u3092\u767A\u4FE1\u3057\u307E\u3059\u3002" }, { "default": async ($$result2) => renderTemplate`   ${maybeRenderHead()}<h1 class="text-3xl md:text-4xl font-semibold">ブログ</h1> <h2 class="sr-only">最新記事</h2> <ul class="mt-6 space-y-4"> ${sorted.map((p) => renderTemplate`<li> <a class="text-navy underline"${addAttribute(`/blog/${p.slug}`, "href")}> ${p.data.title} </a> ${p.data.date && renderTemplate`<span class="ml-2 text-sm text-slate-500">${p.data.date}</span>`} ${p.data.tags?.length ? renderTemplate`<span class="ml-2 text-xs text-slate-600">${p.data.tags.join(", ")}</span>` : null} ${p.data.description && renderTemplate`<p class="text-slate-700">${p.data.description}</p>`} </li>`)} </ul>  `, "footer": async ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "footer" }, { "default": async ($$result3) => renderTemplate`${renderComponent($$result3, "Footer", $$Footer, {})}` })}`, "head": async ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "head" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "Seo", $$Seo, { "title": "\u30D6\u30ED\u30B0", "description": "AI\u30B3\u30F3\u30B5\u30EB\u306E\u5B9F\u4F8B\u3068\u610F\u601D\u6C7A\u5B9A\u306B\u5F79\u7ACB\u3064\u77E5\u898B\u3092\u767A\u4FE1", "path": "/blog", "breadcrumbs": [{ name: "Home", url: "/" }, { name: "Blog", url: "/blog" }] })} ` })}`, "nav": async ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "nav" }, { "default": async ($$result3) => renderTemplate`${renderComponent($$result3, "Nav", $$Nav, {})}` })}` })}`;
}, "/Users/purpl/Projects/astro_project/src/pages/blog/index.astro", void 0);

const $$file = "/Users/purpl/Projects/astro_project/src/pages/blog/index.astro";
const $$url = "/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
