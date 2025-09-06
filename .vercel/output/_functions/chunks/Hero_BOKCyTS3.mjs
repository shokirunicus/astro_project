import { c as createComponent, a as createAstro, m as maybeRenderHead, e as renderSlot, b as renderTemplate } from './astro/server_CDXv8TJD.mjs';

const $$Astro = createAstro();
const $$Hero = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Hero;
  const { title = "Executive AI Consulting", subtitle = "90-day results. ROI-first." } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section> <h1>${title}</h1> <p>${subtitle}</p> ${renderSlot($$result, $$slots["default"])} </section>`;
}, "/Users/purpl/Projects/astro_project/src/components/Hero.astro", void 0);

export { $$Hero as $ };
