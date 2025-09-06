# 実装仕様書 / EN: Implementation Specification

## 1. ルーティング（Astro Pages）
- `src/pages/index.astro`（Home, F-001/012/015）
- `src/pages/services.astro`（F-002）
- `src/pages/cases/[slug].astro` + `src/pages/cases/index.astro`（F-003）
- `src/pages/blog/[slug].astro` + `src/pages/blog/index.astro`（F-004）
- `src/pages/lead.astro`（LP, F-005）
- `src/pages/contact.astro`（F-017）
- `src/pages/legal/privacy.astro` / `src/pages/legal/terms.astro` / `src/pages/legal/tokusho.astro`（F-018）
- `src/pages/thanks.astro`（共通サンクス）

## 2. コンテンツ構造（MDX + Content Collections）
- `src/content/config.ts`（collections: `blog`, `cases`、draft/タグ/OGPメタ）
- `src/content/blog/*.mdx`（draftフラグ、タグ、OGP）
- `src/content/cases/*.mdx`（匿名事例対応、メトリクス範囲表記）

## 3. UI/デザイン（Tailwind）
- テーマ: Navy on white, Cyan accent / Typography: Noto Sans JP + Inter
- コンポーネント: `src/components/Hero.astro`, `Nav.astro`, `Footer.astro`, `CTA.astro`, `FormLead.astro`
- A11y: Skipリンク、フォーカス可視、コントラスト、フォームのARIA

## 4. API Routes（Astro）
### 4.1 `/api/lead`（POST, F-006, F-008, F-009）
- 検証: 必須/形式/同意、ハニーポット、Rate Limit（10 req/min/IP）
- 動作: メール送信（PDF署名URL発行）、Slack通知、Sheets upsert（emailでupsert）

### 4.2 `/api/pdf/[token]`（GET, F-007）
- 署名トークン検証（HMAC-SHA256, `exp`, `purpose: pdf`, `sub: email`）
- 有効期限（既定72h）、期限切れ/不正トークンはエラーレスポンス/画面
- 署名付きストレージURLへ302リダイレクト（ファイル本体は配信しない）

### 4.3 `/api/stripe/webhook`（POST, F-011）
- イベント: `checkout.session.completed`
- 署名検証、冪等化（`checkout_session_id`）、案内メール送信、内部通知

## 5. 署名トークン仕様（依存追加なし）
- Payload: `{ sub: email, iat, exp, purpose: "pdf", nonce }`
- Signature: `base64url(HMAC_SHA256(JSON.stringify(payload), DOWNLOAD_TOKEN_SECRET))`
- Verify: `exp > now`, `purpose === "pdf"`, HMAC一致、（任意）`nonce`消費ログ（Sheets `Tokens`）

## 6. 環境変数（F-016）
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`
- `SLACK_WEBHOOK_URL`
- `SHEETS_SPREADSHEET_ID`, `SHEETS_SERVICE_ACCOUNT_JSON`（Base64）
- `DOWNLOAD_TOKEN_SECRET`, `SITE_BASE_URL`, `ENVIRONMENT`

## 7. SEO/OGP/サイトマップ
- メタユーティリティ、`src/pages/sitemap.xml.ts`, `src/pages/robots.txt`
- OGP: タイトル/説明/画像の規約統一、Blog/Casesでフィールド化

## 8. 計測/同意（F-013/018）
- Vercel Analytics + イベント: `form_submit`, `pdf_download`, `checkout_start`, `checkout_success`
- 現状Cookie不要。将来GA導入時に同意UIを拡張

## 9. 監視/運用
- Webhook失敗時の再試行（最大3回）と失敗通知
- フォームRate Limit 429 + `Retry-After`

## 10. 受入テスト（Acceptance）
- 正常: リード登録→2分以内メール→PDFダウンロード可
- 異常: 期限切れトークン→適切なエラーレスポンス/画面
- Stripe: Checkout成功→Webhook→案内メール送付

