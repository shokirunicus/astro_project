# 要件定義 / EN: Requirements

## 概要（Summary）
- 目的: リード獲得（PDF配布）/ ブランド信頼 / Stripe少額販売
- スタック: Astro + Tailwind + MDX（Content Collections）/ Vercel / Stripe Checkout / Google Sheets / Vercel Analytics

## 機能要件（Functional Requirements, F-IDs）

### F-001 Global layout (Home/Nav/Footer)
- Why: Primary CTAs and trust surface
- User story: As an executive, I quickly grasp value and reach CTAs
- Acceptance:
  - Responsive nav/footer; primary CTA visible above the fold
  - Mobile-friendly navigation; skip links
- Edge: Nav hierarchy bloat; external link rel/target

### F-002 Services packages (incl. 90-day)
- Why: Clarity and speed in decision-making
- User story: As an exec, compare transparent packages with outcomes/prices
- Acceptance:
  - Package table with outcomes/scope/price or CTA
  - FAQ section; contact CTA
- Edge: No price → route to LP form
- Depends: F-001

### F-003 Case studies (MDX)
- Why: Social proof
- User story: Find similar-industry success quickly
- Acceptance: List/detail; tags; related posts; clear CTAs
- Edge: Anonymous cases; ranges for metrics
- Depends: F-001

### F-004 Blog (MDX)
- Why: Organic acquisition and thought leadership
- User story: Skim practical insights fast
- Acceptance: Index/detail; breadcrumbs; tags; drafts excluded
- Edge: Publish guard for drafts
- Depends: F-001

### F-005 Lead gen LP (PDF offer)
- Why: Stable MQL generation
- User story: Get high-quality PDF in exchange for email
- Acceptance: Hero; concise form; consent checkbox; thanks page
- Edge: Bot submissions; duplicate email; resend flow
- Depends: F-006, F-007

### F-006 Lead form (validation/consent/antispam)
- Why: Quality leads and compliance
- User story: Submit with minimal friction
- Acceptance: Required/format checks; consent required; honeypot; success/failure UX
- Edge: Rapid re-submits; no-JS; mobile keyboards
- Depends: F-001

### F-007 PDF delivery (email + signed URL)
- Why: Anti-bot, tracking, resends
- User story: Receive link within 2 minutes
- Acceptance: One-time/expiring link; 404/expired screens; resend
- Edge: Mail delays; leaked links; invalid tokens
- Depends: F-006, F-016

### F-008 Admin notifications (Mail/Slack)
- Why: Immediate follow-up
- User story: See new lead details promptly
- Acceptance: Name/company/email/UTM/referrer; duplicate flag
- Edge: Spam bursts; Quiet Hours
- Depends: F-006

### F-009 Lead storage (Sheet/Airtable)
- Why: NoOps CRM for v1
- User story: Keep leads with consent and UTM
- Acceptance: Upsert by email; timestamp; consent
- Edge: API failures; retries; dead-letter
- Depends: F-006, F-016

### F-010 Stripe Checkout
- Why: Monetize small offerings
- User story: Pay safely with transparent pricing
- Acceptance: Product page; checkout; success/cancel; receipt
- Edge: Currency/tax; payment failures
- Depends: F-002, F-016

### F-011 Stripe webhook processing
- Why: Post-purchase automation
- User story: Receive next steps instantly
- Acceptance: Handle checkout.session.completed; verify signature; idempotency
- Edge: Replays; delays; mismatched signatures
- Depends: F-010, F-016

### F-012 SEO baseline (meta/OGP/sitemap/robots)
- Why: Discoverability and CTR
- User story: Proper previews and indexing
- Acceptance: Per-page meta/OGP; sitemap; robots; breadcrumbs
- Edge: Future i18n
- Depends: F-001

### F-013 Analytics & conversions
- Why: KPI tracking
- User story: See MQL/checkout and LCP
- Acceptance: Event naming; consent gating; LCP telemetry
- Edge: Ad blockers; consent declines
- Depends: F-005, F-010, F-018

### F-014 Accessibility baseline (WCAG2.2-AA)
- Why: Readability and trust
- User story: Accessible content and controls
- Acceptance: Contrast; keyboard; focus; alt text
- Edge: Motion sensitivity
- Depends: F-001

### F-015 Performance optimization (LCP≤2.0s)
- Why: SEO and UX goals
- User story: Fast hero render on mobile
- Acceptance: Optimized images/fonts; lazy loading; CLS control
- Edge: Large hero images; external scripts
- Depends: F-001

### F-016 Vercel deploy & envs
- Why: Reliable operations
- User story: Simple CI/CD with secrets
- Acceptance: Env list: STRIPE, SLACK, MAIL, STORE
- Edge: Stage/prod split

### F-017 Contact / scheduling
- Why: Pipeline to meetings
- User story: Quick form or calendar booking
- Acceptance: Short form or Calendly embed; success state
- Edge: Spam; time zones
- Depends: F-006

### F-018 Legal pages & consent
- Why: Compliance and trust
- User story: Understand policy before submitting
- Acceptance: Privacy/Terms/Tokusho; checkboxes; consent log
- Edge: Versioning; ambiguous wording
- Depends: F-006

## 非機能要件（Non-Functional）
- Performance: TTFB≤200ms (P75 JP), TTI≤1500ms, JS≤120KB gz, CSS≤60KB gz, hero≤200KB (mobile), LCP≤2.0s (P75)
- Reliability: site 99.9%/month, api 99.5%/month
- Security: HTTPS+HSTS, CSP, Stripe署名検証, Rate limit+Honeypot, Secrets in Vercel env, Consent token検証
- Accessibility: WCAG 2.2 AA
- Compliance: APPI, 特商法, 外部送信規律, PCI-DSS（Stripe委任）, JIS X 8341-3

