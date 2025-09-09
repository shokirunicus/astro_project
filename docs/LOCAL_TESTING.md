# Local Testing Guide

## 1. Setup
1) Install deps
```bash
pnpm install
```

2) Environment
```bash
cp .env.example .env.local
```
Fill at minimum:
- `SITE_BASE_URL=http://localhost:4321`
- `LEAD_HMAC_SECRET=...` (32+ bytes random)
- `PDF_DOWNLOAD_URL=https://example.com/pdfs/guide.pdf`
- `RESEND_API_KEY=re_xxx`
- `RESEND_FROM=no-reply@example.com`
- `GOOGLE_APPLICATION_CREDENTIALS=./credentials/sheets-service-account.json`
- `SHEETS_SPREADSHEET_ID=...`
- (Optional) `GA_MEASUREMENT_ID=G-XXXXXXX`

3) Google credentials
- Create `credentials/` and place `sheets-service-account.json`
- Share target spreadsheet with the service account email (editor)

## 2. Run
```bash
pnpm dev
```
Open http://localhost:4321

## 3. Manual checks
- `/lead` → submit → `/thanks?s=lead`
- Email arrives with PDF link
- Click link → 302 to `PDF_DOWNLOAD_URL`
- Spreadsheet gets a new row
- GA DebugView shows events after granting consent

## 4. Troubleshooting
- 401/403 on Sheets: spreadsheet not shared to service account
- Email missing: check Resend Dashboard and sender domain verification
- `server_misconfigured`: ensure required envs are set
- Token invalid/expired: verify `LEAD_HMAC_SECRET` and link age

