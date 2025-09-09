// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  inlineStylesheets: 'auto',
  integrations: [mdx()],
  vite: { plugins: [tailwindcss()] },
  adapter: vercel(),
});
