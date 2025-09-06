import { c as createComponent, m as maybeRenderHead, d as addAttribute, b as renderTemplate, a as createAstro, e as renderSlot, r as renderComponent, l as renderHead, u as unescapeHTML } from './astro/server_CDXv8TJD.mjs';
/* empty css                          */
import { a as absoluteUrl, S as SITE } from './site_BPGYfmJL.mjs';

const $$Nav = createComponent(($$result, $$props, $$slots) => {
  const links = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/cases", label: "Cases" },
    { href: "/blog", label: "Blog" },
    { href: "/lead", label: "Lead" },
    { href: "/contact", label: "Contact" },
    { href: "/legal/privacy", label: "Privacy" }
  ];
  return renderTemplate`${maybeRenderHead()}<header class="sticky top-0 z-50 backdrop-blur bg-white/95"> <nav aria-label="Global" class="container mx-auto px-4 py-3 flex gap-4"> ${links.map((l) => renderTemplate`<a${addAttribute(l.href, "href")}>${l.label}</a>`)} </nav> </header>`;
}, "/Users/purpl/Projects/astro_project/src/components/Nav.astro", void 0);

function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: absoluteUrl(SITE.logo)
  };
}
function breadcrumbJsonLd(segments) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: segments.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      item: absoluteUrl(s.url)
    }))
  };
}
function serviceJsonLd({ name, description, url = "/services" }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url
    },
    url: absoluteUrl(url)
  };
}
function faqJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((qa) => ({
      "@type": "Question",
      name: qa.question,
      acceptedAnswer: { "@type": "Answer", text: qa.answer }
    }))
  };
}
function articleJsonLd({
  title,
  description,
  slug,
  datePublished,
  dateModified,
  image = "/og/default.svg"
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: absoluteUrl(image),
    datePublished,
    dateModified: dateModified || datePublished,
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name, logo: { "@type": "ImageObject", url: absoluteUrl(SITE.logo) } },
    mainEntityOfPage: absoluteUrl(`/blog/${slug}`)
  };
}
function buildMeta({
  title = SITE.name,
  description = SITE.description,
  path = "/",
  image = "/og/default.svg"
}) {
  const url = absoluteUrl(path);
  const img = absoluteUrl(image);
  return {
    title,
    description,
    og: {
      title,
      description,
      type: "website",
      url,
      image: img
    },
    twitter: {
      card: "summary_large_image",
      site: SITE.twitter,
      title,
      description,
      image: img
    }
  };
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Base = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Base;
  const { title = "AIHALO", description = "Executive AI Consulting" } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="ja" data-astro-cid-5hce7sga> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description"', '><link rel="icon" type="image/svg+xml" href="/favicon.svg"><title>', "</title>", '<script type="application/ld+json">', "<\/script>", '</head> <body class="bg-white text-slate-900" data-astro-cid-5hce7sga> <a href="#main" class="skip-link" data-astro-cid-5hce7sga>\u30B9\u30AD\u30C3\u30D7\u3057\u3066\u672C\u6587\u3078</a> ', ' <main id="main" class="container mx-auto px-4" data-astro-cid-5hce7sga> ', " </main> ", "  </body> </html>"])), addAttribute(description, "content"), title, renderSlot($$result, $$slots["head"]), unescapeHTML(JSON.stringify(organizationJsonLd())), renderHead(), renderComponent($$result, "Nav", $$Nav, { "data-astro-cid-5hce7sga": true }), renderSlot($$result, $$slots["default"]), renderSlot($$result, $$slots["footer"]));
}, "/Users/purpl/Projects/astro_project/src/layouts/Base.astro", void 0);

export { $$Base as $, $$Nav as a, buildMeta as b, breadcrumbJsonLd as c, articleJsonLd as d, faqJsonLd as f, organizationJsonLd as o, serviceJsonLd as s };
