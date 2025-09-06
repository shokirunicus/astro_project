# Astro Starter Kit: Minimal

```sh
pnpm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

## 🔐 Environment & Secrets

- Copy `.env.example` to `.env.local` and fill values for local dev. Do not commit real secrets.
- Secrets must be set in deployment env (e.g., Vercel project settings), not in the repo.
- Google Service Account: prefer `GOOGLE_APPLICATION_CREDENTIALS=./credentials/sheets-service-account.json` and keep that file under `credentials/` (gitignored).
- See `docs/SECRETS.md` for key rotation and history purge procedures.

Required variables (subset):
- `SITE_BASE_URL` – Base site URL (e.g., http://localhost:4321)
- `LEAD_HMAC_SECRET` – Random 32+ bytes for token signing
- `PDF_DOWNLOAD_URL` – Public URL for lead PDF asset
- `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX` – Rate limit settings
- `RESEND_API_KEY` – Email provider API key
  - `RESEND_FROM` – Sender email (e.g., no-reply@domain)
  - `RESEND_SUBJECT` – Mail subject for PDF link
- `GOOGLE_APPLICATION_CREDENTIALS` – Path to SA JSON (local only)
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` – For checkout & webhook

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## 💳 Stripe Checkout/Webhook Setup
- See `docs/SETUP_STRIPE.md` for environment variables, Checkout `success_url`/`cancel_url`, and webhook configuration.

## 🚀 Deployment
- Before going live, review `docs/DEPLOYMENT_CHECKLIST.md`.
 - Deploying to Vercel? See `docs/DEPLOY_VERCEL.md` for adapter setup (`@astrojs/vercel`) and `output: 'server'` configuration.
