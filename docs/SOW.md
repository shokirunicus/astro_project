# SOW（Statement of Work） / EN: Statement of Work

- 背景（Background）
  - 既存WP/SWELLからAstro + Tailwind + MDXへ刷新。役員層に刺さる信頼性・洗練性を軸に、定常的なMQL獲得と少額パッケージの即時決済導線を整備。
  - EN: Refresh from WP/SWELL to Astro + Tailwind + MDX to build executive trust, steady MQL generation, and fast checkout for small offerings.

- 目的（Goals）
  - リード獲得（PDF配布）/ ブランド信頼 / Stripe少額販売
  - EN: Lead-gen (PDF), brand trust, small checkout revenue.

- 成果物（Deliverables）
  - 静的サイト: Home / Services / Cases / Blog / LP / Contact / Legal
  - リードフォーム/API、PDF配布（メール+署名URL）、通知、保存（Google Sheets）
  - Stripe Checkout + Webhook（自動メール/内部通知）
  - SEO/OGP/サイトマップ、計測（CV/速度）、A11y/性能最適化

- スコープ（In-Scope）
  - フロント: Astro + Tailwind + MDX、Content Collections、コンポーネント設計
  - バック: API Routes（リード、PDF配布、Stripe Webhook、通知）
  - インフラ/運用: Vercelデプロイ、環境変数、監視（Vercel Analytics）

- スコープ外（Out of Scope）
  - 本格CMS導入、会員/認証、定期課金/サブスク、GA4、DB本番運用（v2以降）

- 前提・制約（Assumptions & Constraints）
  - 依存追加は明示許可時のみ。秘密情報はVercel環境変数管理。Stripeでカード情報非保持。

- リスクと対策（Top Risks & Mitigations）
  - スパム/ボット: ハニーポット + Rate Limit（429）
  - メール遅延: 再送リンク/期限管理（72h）/期限切れ画面
  - Webhook失敗/リプレイ: 署名検証 + 冪等化（idempotency）
  - 速度劣化: 画像/フォント最適化、外部スクリプト最少、LCP予算維持
  - 法令ミス: プライバシー/特商法/外部送信の明記と同意ログ

- WBS（F-xxx連動）
  - T-101: IA/情報設計（F-001, F-012）
  - T-102: UI基盤/デザインシステム（F-001, F-014, F-015）
  - T-103: コンテンツ構造/MDX（F-003, F-004）
  - T-104: LP + フォーム（F-005, F-006, F-018）
  - T-105: PDF配布/通知/保存（F-007, F-008, F-009）
  - T-106: Stripe Checkout/Webhook（F-010, F-011）
  - T-107: SEO/OGP/サイトマップ（F-012）
  - T-108: 計測/同意ゲート（F-013, F-018）
  - T-109: デプロイ/環境変数/監視（F-016）
  - T-110: 受入テスト/改善（全般）

