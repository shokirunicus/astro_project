import { g as getCollection } from '../chunks/_astro_content_DZy1kbD8.mjs';
import { a as absoluteUrl } from '../chunks/site_BPGYfmJL.mjs';
export { renderers } from '../renderers.mjs';

async function GET() {
  const staticPaths = ["/", "/services", "/cases", "/blog", "/lead", "/contact", "/legal/privacy", "/legal/terms", "/legal/tokusho"];
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  const postUrls = posts.map((p) => `/blog/${p.slug}`);
  const all = [...staticPaths, ...postUrls];
  const urls = all.map((p) => `  <url><loc>${absoluteUrl(p)}</loc></url>`).join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  return new Response(body, { headers: { "content-type": "application/xml" } });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
