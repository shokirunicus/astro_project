# Deployment Checklist

Use this list before promoting to production.

## Environment
- [ ] `.env` secrets configured in hosting platform (no real secrets in repo)
- [ ] `SITE_BASE_URL` matches production domain
- [ ] `LEAD_HMAC_SECRET` rotated and strong (≥ 32 bytes)
- [ ] `PDF_DOWNLOAD_URL` reachable and correct asset
- [ ] `RESEND_API_KEY`/`RESEND_FROM`/`RESEND_SUBJECT` set (optional)
- [ ] `STRIPE_WEBHOOK_SECRET` set; Stripe keys managed securely

## Domain & TLS
- [ ] Custom domain connected
- [ ] SSL/TLS certificate issued and valid
- [ ] Redirect HTTP → HTTPS forced

## Platform & Routing
- [ ] Build succeeds on CI
- [ ] `/api/*` routes accessible
- [ ] `robots.txt`/`sitemap.xml` served correctly

## Rate Limiting & Security
- [ ] `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX` tuned for expected traffic
- [ ] Security headers present on API responses
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Cache-Control: no-store` (for sensitive endpoints)

## Stripe
- [ ] Checkout `success_url=/thanks?s=purchase` / `cancel_url=/services`
- [ ] Webhook endpoint configured: `/api/stripe/webhook`
- [ ] Event: `checkout.session.completed`
- [ ] Signature verification tested (Stripe CLI)

## Email & PDF
- [ ] Email delivers to inbox (spam checks)
- [ ] `/api/pdf/[token]` redirects to PDF and expires as expected

## Monitoring
- [ ] Minimal error logs captured (server logs)
- [ ] 4xx/5xx rate tracked (optional)
- [ ] Alerting on elevated failure rates (optional)

