import { c as createComponent, a as createAstro, d as addAttribute, b as renderTemplate, u as unescapeHTML } from './astro/server_CDXv8TJD.mjs';
import { b as buildMeta, o as organizationJsonLd, c as breadcrumbJsonLd, s as serviceJsonLd, f as faqJsonLd, d as articleJsonLd } from './Base_BQHmndEO.mjs';
import { S as SITE } from './site_BPGYfmJL.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Seo = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Seo;
  const props = Astro2.props;
  const meta = buildMeta({ title: props.title, description: props.description, path: props.path, image: props.image || "/og/default.svg" });
  const jsonLd = [organizationJsonLd()];
  if (props.breadcrumbs?.length) jsonLd.push(breadcrumbJsonLd(props.breadcrumbs));
  if (props.type === "service" && props.service) jsonLd.push(serviceJsonLd(props.service));
  if (props.type === "faq" && props.faq) jsonLd.push(faqJsonLd(props.faq));
  if (props.type === "article" && props.article) jsonLd.push(articleJsonLd(props.article));
  return renderTemplate`<!-- Basic SEO / OGP / Twitter --><meta name="description"${addAttribute(meta.description, "content")}><meta property="og:title"${addAttribute(meta.og.title, "content")}><meta property="og:description"${addAttribute(meta.og.description, "content")}><meta property="og:type"${addAttribute(meta.og.type, "content")}><meta property="og:url"${addAttribute(meta.og.url, "content")}><meta property="og:image"${addAttribute(meta.og.image, "content")}><meta name="twitter:card"${addAttribute(meta.twitter.card, "content")}><meta name="twitter:site"${addAttribute(SITE.twitter, "content")}><meta name="twitter:title"${addAttribute(meta.twitter.title, "content")}><meta name="twitter:description"${addAttribute(meta.twitter.description, "content")}><meta name="twitter:image"${addAttribute(meta.twitter.image, "content")}>${jsonLd.map((obj) => renderTemplate(_a || (_a = __template(['<script type="application/ld+json">', "<\/script>"])), unescapeHTML(JSON.stringify(obj))))}`;
}, "/Users/purpl/Projects/astro_project/src/components/Seo.astro", void 0);

export { $$Seo as $ };
