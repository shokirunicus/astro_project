# Secret Management Guide

This project MUST NOT commit secrets. Follow these rules and steps.

## Golden rules
- Never commit `.env*` (except `.env.example`).
- Keep credentials files under `credentials/` (gitignored).
- Prefer `GOOGLE_APPLICATION_CREDENTIALS` to point to a local JSON file.
- Avoid embedding multi-line private keys directly in env values.

## Google Service Account (Sheets)
1. In Google Cloud Console, create or rotate a Service Account key.
2. Download the JSON key locally and save it as `credentials/sheets-service-account.json`.
3. Set `GOOGLE_APPLICATION_CREDENTIALS=./credentials/sheets-service-account.json` in `.env.local`.
4. Do not commit the JSON file.

If any key was committed previously:
- Immediately disable/revoke the compromised key.
- Rotate and update deployments with the new key.
- Purge repository history using `git filter-repo` or `git filter-branch` (org policy review required).

## Env files
- Copy `.env.example` to `.env.local` for local development.
- Vercel/CI: set secrets via project settings (not in repo).

## Rate limiting and tokens
- Use `LEAD_HMAC_SECRET` for signing tokens.
- Default rate limit is strict for bots: `RATE_LIMIT_MAX=5` per `RATE_LIMIT_WINDOW_MS`.

## Stripe & Email
- Keep `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and `RESEND_API_KEY` only in environment settings.

