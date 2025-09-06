import { p as decodeKey } from './chunks/astro/server_CDXv8TJD.mjs';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_DBplWpSj.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/purpl/Projects/astro_project/","cacheDir":"file:///Users/purpl/Projects/astro_project/node_modules/.astro/","outDir":"file:///Users/purpl/Projects/astro_project/dist/","srcDir":"file:///Users/purpl/Projects/astro_project/src/","publicDir":"file:///Users/purpl/Projects/astro_project/public/","buildClientDir":"file:///Users/purpl/Projects/astro_project/dist/client/","buildServerDir":"file:///Users/purpl/Projects/astro_project/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/.pnpm/astro@5.13.5_@types+node@24.3.1_@vercel+functions@2.2.13_jiti@2.5.1_lightningcss@1.30.1_f8a8d59a3c52debcf57f8bb7fc69822a/node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/lead","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/lead\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"lead","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/lead.ts","pathname":"/api/lead","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/pdf/[token]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/pdf\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"pdf","dynamic":false,"spread":false}],[{"content":"token","dynamic":true,"spread":false}]],"params":["token"],"component":"src/pages/api/pdf/[token].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/stripe/webhook","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/stripe\\/webhook\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"stripe","dynamic":false,"spread":false}],[{"content":"webhook","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/stripe/webhook.ts","pathname":"/api/stripe/webhook","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.DdzYcCMo.css"}],"routeData":{"route":"/blog","isIndex":true,"type":"page","pattern":"^\\/blog\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/index.astro","pathname":"/blog","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.DdzYcCMo.css"}],"routeData":{"route":"/cases/[slug]","isIndex":false,"type":"page","pattern":"^\\/cases\\/([^/]+?)\\/?$","segments":[[{"content":"cases","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/cases/[slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.DdzYcCMo.css"}],"routeData":{"route":"/cases","isIndex":true,"type":"page","pattern":"^\\/cases\\/?$","segments":[[{"content":"cases","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/cases/index.astro","pathname":"/cases","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.DdzYcCMo.css"}],"routeData":{"route":"/contact","isIndex":false,"type":"page","pattern":"^\\/contact\\/?$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact.astro","pathname":"/contact","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.DdzYcCMo.css"}],"routeData":{"route":"/lead","isIndex":false,"type":"page","pattern":"^\\/lead\\/?$","segments":[[{"content":"lead","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/lead.astro","pathname":"/lead","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.DdzYcCMo.css"}],"routeData":{"route":"/legal/privacy","isIndex":false,"type":"page","pattern":"^\\/legal\\/privacy\\/?$","segments":[[{"content":"legal","dynamic":false,"spread":false}],[{"content":"privacy","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/legal/privacy.astro","pathname":"/legal/privacy","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.DdzYcCMo.css"}],"routeData":{"route":"/legal/terms","isIndex":false,"type":"page","pattern":"^\\/legal\\/terms\\/?$","segments":[[{"content":"legal","dynamic":false,"spread":false}],[{"content":"terms","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/legal/terms.astro","pathname":"/legal/terms","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.DdzYcCMo.css"}],"routeData":{"route":"/legal/tokusho","isIndex":false,"type":"page","pattern":"^\\/legal\\/tokusho\\/?$","segments":[[{"content":"legal","dynamic":false,"spread":false}],[{"content":"tokusho","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/legal/tokusho.astro","pathname":"/legal/tokusho","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.DdzYcCMo.css"}],"routeData":{"route":"/services","isIndex":false,"type":"page","pattern":"^\\/services\\/?$","segments":[[{"content":"services","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/services.astro","pathname":"/services","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/sitemap.xml","isIndex":false,"type":"endpoint","pattern":"^\\/sitemap\\.xml\\/?$","segments":[[{"content":"sitemap.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/sitemap.xml.ts","pathname":"/sitemap.xml","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.DdzYcCMo.css"}],"routeData":{"route":"/thanks","isIndex":false,"type":"page","pattern":"^\\/thanks\\/?$","segments":[[{"content":"thanks","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/thanks.astro","pathname":"/thanks","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.DdzYcCMo.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["/Users/purpl/Projects/astro_project/src/pages/blog/[slug].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/blog/[slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["/Users/purpl/Projects/astro_project/src/pages/blog/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/blog/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/purpl/Projects/astro_project/src/pages/sitemap.xml.ts",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/sitemap.xml@_@ts",{"propagation":"in-tree","containsHead":false}],["/Users/purpl/Projects/astro_project/src/pages/cases/[slug].astro",{"propagation":"none","containsHead":true}],["/Users/purpl/Projects/astro_project/src/pages/cases/index.astro",{"propagation":"none","containsHead":true}],["/Users/purpl/Projects/astro_project/src/pages/contact.astro",{"propagation":"none","containsHead":true}],["/Users/purpl/Projects/astro_project/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/Users/purpl/Projects/astro_project/src/pages/lead.astro",{"propagation":"none","containsHead":true}],["/Users/purpl/Projects/astro_project/src/pages/legal/privacy.astro",{"propagation":"none","containsHead":true}],["/Users/purpl/Projects/astro_project/src/pages/legal/terms.astro",{"propagation":"none","containsHead":true}],["/Users/purpl/Projects/astro_project/src/pages/legal/tokusho.astro",{"propagation":"none","containsHead":true}],["/Users/purpl/Projects/astro_project/src/pages/services.astro",{"propagation":"none","containsHead":true}],["/Users/purpl/Projects/astro_project/src/pages/thanks.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astro-page:node_modules/.pnpm/astro@5.13.5_@types+node@24.3.1_@vercel+functions@2.2.13_jiti@2.5.1_lightningcss@1.30.1_f8a8d59a3c52debcf57f8bb7fc69822a/node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/api/lead@_@ts":"pages/api/lead.astro.mjs","\u0000@astro-page:src/pages/api/pdf/[token]@_@ts":"pages/api/pdf/_token_.astro.mjs","\u0000@astro-page:src/pages/api/stripe/webhook@_@ts":"pages/api/stripe/webhook.astro.mjs","\u0000@astro-page:src/pages/blog/[slug]@_@astro":"pages/blog/_slug_.astro.mjs","\u0000@astro-page:src/pages/blog/index@_@astro":"pages/blog.astro.mjs","\u0000@astro-page:src/pages/cases/[slug]@_@astro":"pages/cases/_slug_.astro.mjs","\u0000@astro-page:src/pages/cases/index@_@astro":"pages/cases.astro.mjs","\u0000@astro-page:src/pages/contact@_@astro":"pages/contact.astro.mjs","\u0000@astro-page:src/pages/lead@_@astro":"pages/lead.astro.mjs","\u0000@astro-page:src/pages/legal/privacy@_@astro":"pages/legal/privacy.astro.mjs","\u0000@astro-page:src/pages/legal/terms@_@astro":"pages/legal/terms.astro.mjs","\u0000@astro-page:src/pages/legal/tokusho@_@astro":"pages/legal/tokusho.astro.mjs","\u0000@astro-page:src/pages/services@_@astro":"pages/services.astro.mjs","\u0000@astro-page:src/pages/sitemap.xml@_@ts":"pages/sitemap.xml.astro.mjs","\u0000@astro-page:src/pages/thanks@_@astro":"pages/thanks.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_CK-jXYf5.mjs","/Users/purpl/Projects/astro_project/node_modules/.pnpm/astro@5.13.5_@types+node@24.3.1_@vercel+functions@2.2.13_jiti@2.5.1_lightningcss@1.30.1_f8a8d59a3c52debcf57f8bb7fc69822a/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_CBk0g7hK.mjs","/Users/purpl/Projects/astro_project/.astro/content-assets.mjs":"chunks/content-assets_DleWbedO.mjs","/Users/purpl/Projects/astro_project/.astro/content-modules.mjs":"chunks/content-modules_B1tDLiEY.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_39xG-ZWh.mjs","/Users/purpl/Projects/astro_project/src/content/blog/hello-world.mdx?astroPropagatedAssets":"chunks/hello-world_Hf403XOY.mjs","/Users/purpl/Projects/astro_project/src/content/blog/hello-world.mdx":"chunks/hello-world_BorKxnjV.mjs","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/_slug_.DdzYcCMo.css","/favicon.svg","/robots.txt","/og/default.svg"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"sMr9Up8RI+GJobcduRu5gAYdcv38xVQHJ94qPnDSVf8="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
