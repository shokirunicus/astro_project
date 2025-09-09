# E2E Test Scenarios (v1)

Goal: Verify lead flow end-to-end, email delivery, PDF redirect, and analytics signaling without adding new test dependencies.

## Preconditions
- `.env.local` configured with:
  - `SITE_BASE_URL=http://localhost:4321`
  - `LEAD_HMAC_SECRET=...`
  - `PDF_DOWNLOAD_URL=https://example.com/pdfs/guide.pdf`
  - `RESEND_API_KEY=re_xxx`
  - `RESEND_FROM=no-reply@example.com`
  - `GOOGLE_APPLICATION_CREDENTIALS=./credentials/sheets-service-account.json`
  - `SHEETS_SPREADSHEET_ID=...`
  - (Optional) `GA_MEASUREMENT_ID=G-XXXXXXX`

## Scenarios

1) Lead submit (Tally embed)
- Navigate to `/lead?utm_source=test&utm_medium=e2e`
- Submit the form in the Tally frame with a test email
- Expect: redirect to `/thanks?s=lead` or embed success message
- GA DebugView: `lead_form_submit` appears with utm params (if consent granted)

2) Lead submit (native form)
- Temporarily switch to native `<FormLead />` (or POST manually):
  ```bash
  curl -i -XPOST http://localhost:4321/api/lead \
    -H "Content-Type: application/json" \
    -d '{"email":"e2e@example.com","name":"E2E","company":"Test","consent":1}'
  ```
- Expect: `200 { ok: true, token }` or `303 Location: /thanks?s=lead`

3) Email delivery
- Check the recipient inbox or Resend Dashboard → Email sent
- Email contains link to `/api/pdf/{token}`

4) PDF download (valid)
- Open the link once → Expect 302 redirect to `PDF_DOWNLOAD_URL`
- (Optional) GA server event `pdf_download` with `token_status=valid` if Measurement Protocol configured

5) PDF download (expired)
- Tamper the token payload `exp` to a past time or wait >24h
- Expect `410 { error: 'expired' }`
- (Optional) GA server event `pdf_download` with `token_status=expired`

6) Sheets append
- Open the target spreadsheet → New row appended with timestamp/email/name/company

7) Rate limit
- Rapidly POST > `RATE_LIMIT_MAX` within window
- Expect `429 { error: 'rate_limited' }`

## Notes
- All external calls are best-effort; failures should not leak secrets in logs.
- Consent banner controls GA script loading; grant to see events in DebugView.

