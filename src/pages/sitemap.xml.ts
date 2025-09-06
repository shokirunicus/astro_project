import { getCollection } from 'astro:content';
import { absoluteUrl } from '../lib/site';

export async function GET() {
  const staticPaths = ['/', '/services', '/cases', '/blog', '/lead', '/contact', '/legal/privacy', '/legal/terms', '/legal/tokusho'];
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const postUrls = posts.map((p) => `/blog/${p.slug}`);
  const all = [...staticPaths, ...postUrls];
  const urls = all
    .map((p) => `  <url><loc>${absoluteUrl(p)}</loc></url>`) 
    .join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
  return new Response(body, { headers: { 'content-type': 'application/xml' } });
}
