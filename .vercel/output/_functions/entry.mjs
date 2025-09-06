import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CmFrg2HZ.mjs';
import { manifest } from './manifest_CK-jXYf5.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/lead.astro.mjs');
const _page2 = () => import('./pages/api/pdf/_token_.astro.mjs');
const _page3 = () => import('./pages/api/stripe/webhook.astro.mjs');
const _page4 = () => import('./pages/blog/_slug_.astro.mjs');
const _page5 = () => import('./pages/blog.astro.mjs');
const _page6 = () => import('./pages/cases/_slug_.astro.mjs');
const _page7 = () => import('./pages/cases.astro.mjs');
const _page8 = () => import('./pages/contact.astro.mjs');
const _page9 = () => import('./pages/lead.astro.mjs');
const _page10 = () => import('./pages/legal/privacy.astro.mjs');
const _page11 = () => import('./pages/legal/terms.astro.mjs');
const _page12 = () => import('./pages/legal/tokusho.astro.mjs');
const _page13 = () => import('./pages/services.astro.mjs');
const _page14 = () => import('./pages/sitemap.xml.astro.mjs');
const _page15 = () => import('./pages/thanks.astro.mjs');
const _page16 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/.pnpm/astro@5.13.5_@types+node@24.3.1_@vercel+functions@2.2.13_jiti@2.5.1_lightningcss@1.30.1_f8a8d59a3c52debcf57f8bb7fc69822a/node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/lead.ts", _page1],
    ["src/pages/api/pdf/[token].ts", _page2],
    ["src/pages/api/stripe/webhook.ts", _page3],
    ["src/pages/blog/[slug].astro", _page4],
    ["src/pages/blog/index.astro", _page5],
    ["src/pages/cases/[slug].astro", _page6],
    ["src/pages/cases/index.astro", _page7],
    ["src/pages/contact.astro", _page8],
    ["src/pages/lead.astro", _page9],
    ["src/pages/legal/privacy.astro", _page10],
    ["src/pages/legal/terms.astro", _page11],
    ["src/pages/legal/tokusho.astro", _page12],
    ["src/pages/services.astro", _page13],
    ["src/pages/sitemap.xml.ts", _page14],
    ["src/pages/thanks.astro", _page15],
    ["src/pages/index.astro", _page16]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "48c1e439-1e72-4abc-956b-8fc0298b8af5",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
