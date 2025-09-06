# Vercel Deployment Guide

This project uses API routes and server-rendered endpoints. For production on Vercel, install and configure the Astro Vercel adapter.

## 1) Install adapter (local)

```bash
pnpm add @astrojs/vercel
```

## 2) Update `astro.config.mjs`

```ts
// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  output: 'server',
  integrations: [mdx()],
  vite: { plugins: [tailwindcss()] },
  adapter: vercel(),
});
```

Notes:
- `output: 'server'` is required for serverless/API behavior.
- API routes declare `export const prerender = false;` and will be executed on Vercel functions.

## 3) Environment Variables
Set required env vars in Vercel Project Settings → Environment Variables:

- `SITE_BASE_URL`
- `LEAD_HMAC_SECRET`
- `PDF_DOWNLOAD_URL`
- `RESEND_API_KEY`, `RESEND_FROM`, `RESEND_SUBJECT` (optional)
- `STRIPE_WEBHOOK_SECRET`

## 4) Robots & Static Assets
`public/robots.txt` and other static files are served automatically.

## 5) Testing
- Use Stripe CLI to forward webhooks to the deployed URL or Vercel preview URL.
- Confirm `/api/lead` POST and `/api/pdf/[token]` redirect behavior.

