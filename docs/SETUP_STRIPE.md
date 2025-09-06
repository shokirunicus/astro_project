# Stripe設定手順

## 1. アカウント作成
1. [Stripe](https://stripe.com/jp)にアクセス
2. 「今すぐ始める」をクリックしてアカウント作成
3. メール認証を完了

## 2. APIキーの取得
1. [Stripeダッシュボード](https://dashboard.stripe.com)にログイン
2. 右上の「開発者」をクリック
3. 「APIキー」タブを選択

### テスト環境のキー
- **公開可能キー**: `pk_test_...` で始まる（フロントエンドで使用）
- **シークレットキー**: `sk_test_...` で始まる（バックエンドで使用）

### 本番環境のキー（本番移行時）
- 「本番環境のキーを表示」トグルをON
- **公開可能キー**: `pk_live_...`
- **シークレットキー**: `sk_live_...`

## 3. Webhook設定
1. 「開発者」→「Webhook」
2. 「エンドポイントを追加」
3. エンドポイントURL: `https://your-domain.com/api/stripe/webhook`
4. リッスンするイベント: `checkout.session.completed`を選択
5. 「エンドポイントを追加」
6. 「署名シークレット」をコピー（`whsec_...`）

## 3.1 Checkout セッション設定（フロント導線）
Checkout セッション作成時に以下を指定してください。

- `success_url`: `https://your-domain.com/thanks?s=purchase`
- `cancel_url`: `https://your-domain.com/services`

成功時は即座に`/thanks?s=purchase`へ遷移し、Webhookは記録・通知など信頼できる処理を担当します（ベストプラクティスとして分離）。

メモ:
- 本番/ステージングの各ドメインに合わせてURLを変更してください。
- Webhookの署名検証はサーバ側で手動実装済みです（`src/pages/api/stripe/webhook.ts`）。

## 4. 商品と価格の作成
1. 「商品」→「商品を追加」
2. 商品情報を入力（例：AIコンサルティングパッケージ）
3. 価格設定（一回払い or サブスクリプション）
4. 価格IDをコピー（`price_...`）

## 環境変数
```env
# Stripe（テスト環境）
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
```

参考:
- Webhookエンドポイント: `https://your-domain.com/api/stripe/webhook`
- 監視/通知は任意で、Slack連携やエラーログ収集を追加可能です。
