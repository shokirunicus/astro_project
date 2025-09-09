# Vercel環境変数設定の完全攻略ガイド：初心者が必ずつまづく全ポイントを徹底解説

## はじめに：なぜこの記事を書いたのか

Vercelで本番環境を構築する際、最大の難関は**環境変数の設定**です。私自身、以下のような問題に直面しました：

- 「DOWNLOAD_TOKEN_SECRET」を設定したのに、実は不要な変数だった
- Base64デコードサイトを使おうとして、セキュリティリスクに気づいて慌てた
- Resendのドメイン認証で、お名前.comの入力方法がわからず30分悩んだ
- Slackのテストコマンドをそのままコピペして、エラーで困惑した
- 「Add New」ボタンを探して、Vercelの画面を何度も往復した

この記事では、**実際につまづいた全ポイント**を余すことなく共有し、あなたが同じ失敗をしないよう、親切丁寧に解説します。

---

## 第1章：Vercel環境変数の基礎知識（5分で理解）

### 1.1 なぜ環境変数が必要なのか

#### 🔴 環境変数を使わない場合の危険性

```javascript
// ❌ 絶対にやってはいけない例
const config = {
  apiKey: "sk_live_4242424242424242",  // GitHubに公開される！
  dbPassword: "myPassword123",         // 全世界に漏洩！
  webhookUrl: "https://hooks.slack..." // 悪用される！
}
```

**実際に起こる被害**：
- APIキーが漏洩 → 高額請求が発生
- データベースパスワード漏洩 → 顧客データ流出
- Webhook URL漏洩 → スパム攻撃

#### 🟢 環境変数を使った安全な方法

```javascript
// ✅ 正しい実装
const config = {
  apiKey: process.env.API_KEY,        // Vercelで管理
  dbPassword: process.env.DB_PASS,    // GitHubには保存されない
  webhookUrl: process.env.WEBHOOK_URL // 環境ごとに異なる値
}
```

### 1.2 Vercelの3つの環境を完全理解

| 環境 | いつ使われる | URL | 用途 |
|------|-------------|-----|------|
| **Production** | メインブランチにプッシュ時 | `yoursite.com` | 実際のユーザーが使う |
| **Preview** | プルリクエスト作成時 | `yoursite-pr-123.vercel.app` | レビュー・テスト用 |
| **Development** | ローカル開発時 | `localhost:3000` | 開発者のPC |

#### 🚨 最重要ポイント：環境変数の設定ミスパターン

**ケース1：本番環境で動かない**
```
設定：Preview ✓ Production ✗
結果：テストは成功、本番でエラー
```

**ケース2：開発環境の値が本番に流出**
```
設定：All Environments ✓
結果：テスト用APIキーが本番で使われる
```

**ケース3：同じ変数名で環境ごとに異なる値を設定したい**
```
解決方法：
1. SITE_BASE_URL (Preview) = https://staging.example.com
2. SITE_BASE_URL (Production) = https://example.com
→ 同じ変数名でも環境ごとに異なる値が使える！
```

---

## 第2章：つまづきポイント①「環境変数の追加画面が見つからない問題」

### 2.1 「Add New」ボタンはどこ？

多くの人が最初につまづくポイントです。実は**「Add New」という明確なボタンは存在しません**。

#### 📍 環境変数を追加する場所（3パターン）

**パターン1：画面上部の入力欄（最も一般的）**

```
Environment Variables
[説明文...]

Create new ← このセクション！
Key: [  入力欄  ]
Value: [  入力欄  ]
Environment: [ ドロップダウン ]
              [ Save ]
```

**パターン2：既存リストの下部**

```
既存の環境変数リスト
SITE_BASE_URL    Production    •••
API_KEY          Production    •••
↓
[空の入力欄が表示される]
```

**パターン3：画面をリロードすると出現**
- Vercelの画面は動的に変化することがある
- `Cmd + R`（Mac）または`Ctrl + R`（Windows）でリロード

### 2.2 実際の操作手順（スクリーンショット付き解説）

1. **Vercelにログイン**
   ```
   https://vercel.com → Log In → GitHubでログイン
   ```

2. **プロジェクトを選択**
   ```
   ダッシュボード → あなたのプロジェクト名をクリック
   ```

3. **Settings画面へ**
   ```
   上部メニュー「Settings」→ 左メニュー「Environment Variables」
   ```

4. **入力欄を見つける**
   ```
   ページ上部の「Create new」セクションを探す
   （「Add New」ボタンではない！）
   ```

---

## 第3章：つまづきポイント②「秘密鍵の生成と設定」

### 3.1 LEAD_HMAC_SECRETの正しい生成方法

#### ❌ 私が最初にやってしまった間違い

```
Key: LEAD_HMAC_SECRET
Value: test-secret-key-for-development-only  ← 絶対ダメ！
```

**なぜダメなのか**：
- 推測可能 → ハッキングされる
- 弱い鍵 → セキュリティが無意味
- GitHubで見つかる → 「test-secret」で検索される

#### ✅ 正しい生成方法（OS別）

**macOS/Linuxの場合**
```bash
# ターミナルで実行
openssl rand -hex 32

# 結果例（これをコピー）
a7b9c2d4e5f6789012345678901234567890abcdef123456789012345678901234
```

**Windowsの場合（PowerShell）**
```powershell
# PowerShellで実行
[Convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Maximum 256}))

# または、WSLをインストールして
wsl
openssl rand -hex 32
```

**オンラインツールを使う場合（最終手段）**
```
https://www.random.org/strings/
- Length: 64
- Character Set: Hexadecimal
```

### 3.2 私が遭遇した問題：既存の弱い鍵を変更できない

**問題**：
```
LEAD_HMAC_SECRET (test-secret-key...) を削除しようとしたら
「Delete」ボタンがない、またはエラーになる
```

**解決方法**：
1. 削除ではなく「Edit」をクリック
2. Valueを新しい秘密鍵で上書き
3. 「Save」で更新

---

## 第4章：つまづきポイント③「Google認証JSONの設定地獄」

### 4.1 最大の落とし穴：Base64デコード問題

#### 🔴 私が最初にやろうとした危険な方法

```
1. .env.localのBase64文字列をコピー
2. 「base64 decode online」でGoogle検索
3. オンラインツールに貼り付け... ← 待って！危険！
```

**なぜ危険なのか**：
- サービスアカウントの秘密鍵が含まれている
- 第三者のサイトに秘密情報を送信することになる
- そのサイトが悪意があれば、あなたのGoogle認証情報が盗まれる

#### 🟢 安全なデコード方法

**方法1：ターミナルでデコード（推奨）**

```bash
# 1. .env.localから値をコピー（最初と最後の文字を確認）
SHEETS_SERVICE_ACCOUNT_JSON=ewogICJ0eXBlIj... # この部分をコピー

# 2. ターミナルで実行
echo "ewogICJ0eXBlIj..." | base64 -d

# 3. 表示されたJSONをコピー
{
  "type": "service_account",
  "project_id": "your-project",
  ...
}
```

**方法2：私が実際に使った解決策**

```
実は、Claudeに「この.env.localのBase64をデコードして」と
お願いすれば、安全にデコードしてくれます！
（外部サイトを使わないので安全）
```

### 4.2 次の落とし穴：「どのスプレッドシート？」問題

**私の混乱**：
```
「Googleスプレッドシートに共有設定してください」
→ どのスプレッドシート？？
```

**答えの見つけ方**：

1. **.env.localを確認**
   ```
   SHEETS_SPREADSHEET_ID=1suPp_8HcUE4ru0LNZ9SjRa6MvYQ1oRrBbVIBQPw7W94
   ```

2. **URLを構築**
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

3. **共有設定**
   - スプレッドシートを開く
   - 右上「共有」ボタン
   - サービスアカウントのメールを追加（JSONの`client_email`）
   - 「編集者」権限を付与

### 4.3 「サービスアカウントのメールって何？」問題

**見つけ方**：
デコードしたJSONの中を探す
```json
{
  "type": "service_account",
  "client_email": "aihalo-sheets-service@aihalo-web.iam.gserviceaccount.com", ← これ！
  ...
}
```

---

## 第5章：つまづきポイント④「Resendメール設定の複雑な罠」

### 5.1 サブドメイン問題：私の30分の迷走

**最初の理解**：
```
ドメイン：aihalo.jp
送信元：noreply@aihalo.jp
```

**実際の設定**：
```
ドメイン：send.aihalo.jp （サブドメイン！）
送信元：noreply@send.aihalo.jp
```

#### なぜサブドメインを使うのか？

| 項目 | メインドメイン | サブドメイン |
|------|--------------|------------|
| 既存メールへの影響 | あり（危険） | なし（安全） |
| 設定の複雑さ | 既存設定と競合 | 独立して設定可能 |
| 推奨度 | △ | ◎ |

### 5.2 お名前.comでのDNS設定：入力ルールの罠

#### ❌ 私がやってしまった間違い

**間違い1：ホスト名にドメインを含めた**
```
ホスト名: send.aihalo.jp  ← 間違い！
正解: send
```

**間違い2：default._domainkeyに上書きしてしまった**
```
既存: default._domainkey.send
変更: resend._domainkey.send に値を設定... あれ？
```

**解決**：
- `default._domainkey`は他のメールサービス用の可能性
- 削除せず、`resend._domainkey`を新規追加

#### ✅ 正しいDNSレコード設定

```
1. MXレコード
   ホスト名: send
   タイプ: MX
   優先度: 10  ← 忘れがち！
   値: feedback-smtp.ap-northeast-1.amazonses.com

2. SPFレコード（TXT）
   ホスト名: send
   タイプ: TXT
   値: v=spf1 include:amazonses.com ~all

3. DKIMレコード（TXT）← CNAMEじゃない！
   ホスト名: resend._domainkey.send
   タイプ: TXT
   値: p=MIGfMA0GCS... （Resendが提供する長い文字列）

4. DMARC（推奨）
   ホスト名: _dmarc  ← サブドメイン不要
   タイプ: TXT
   値: v=DMARC1; p=none;  ← 「なし」じゃなくて「none」！
```

### 5.3 認証が完了しない問題

**待ち時間の目安**：
- 最短：15分
- 通常：30分
- 最長：48時間（まれ）

**確認方法**：
```bash
# DNSが反映されているか確認
dig MX send.aihalo.jp
dig TXT send.aihalo.jp
```

---

## 第6章：つまづきポイント⑤「Slack設定のコマンドコピペ罠」

### 6.1 最もよくある失敗：テストコマンドのコピペ

**私の失敗**：
```bash
# ドキュメントのコマンド
curl -X POST [コピーしたURL] \
  -H 'Content-Type: application/json' \
  -d '{"text":"テスト通知です"}'

# 私が実行したコマンド（そのままコピペ）
curl -X POST [コピーしたURL] \  ← これじゃ動かない！

# エラー
zsh: no matches found: [コピーしたURL]
```

**正解**：
```bash
# [コピーしたURL]を実際のURLに置き換える！
curl -X POST https://hooks.slack.com/services/T05ABC/B05XYZ/abcdef123 \
  -H 'Content-Type: application/json' \
  -d '{"text":"テスト通知です"}'
```

### 6.2 Webhook URLの取得手順（画面が変わりやすい）

2025年版の手順：

1. **Slack App作成**
   ```
   https://api.slack.com/apps
   → Create New App
   → From scratch（最初の選択肢）
   ```

2. **Incoming Webhook有効化**
   ```
   左メニュー：Features → Incoming Webhooks
   Toggle: Off → On に変更
   ```

3. **チャンネル選択**
   ```
   Add New Webhook to Workspace
   → チャンネル選択（#general, #leads など）
   → Allow
   ```

4. **URL取得**
   ```
   https://hooks.slack.com/services/TXXXXXX/BXXXXXX/xxxxxxxxxxxx
   ↑ これ全体をコピー
   ```

---

## 第7章：つまづきポイント⑥「再デプロイボタンが見つからない」

### 7.1 Redeployボタンの隠れ場所

**パターン1：一覧画面から**
```
Deployments画面
→ Production/Current の行
→ マウスホバー
→ 右端に「⋮」が出現
→ クリック
→ Redeploy
```

**パターン2：詳細画面から**
```
デプロイメントIDをクリック
→ 詳細画面
→ 右上にRedeployボタン
```

**パターン3：見つからない時の最終手段**
```bash
# Git経由で強制デプロイ
echo "# redeploy" >> README.md
git add .
git commit -m "chore: trigger redeploy"
git push
```

### 7.2 再デプロイ時の設定確認

**重要な確認ポイント**：
```
✓ Production が選択されている
✓ "latest configuration from your Project Settings"
  → これが表示されていれば、新しい環境変数が反映される
✓ Use existing Build Cache
  → チェックしたままでOK（ビルドが速くなる）
```

---

## 第8章：設定後の動作確認チェックリスト

### 8.1 段階的テスト手順

#### Phase 1：基本動作
```
□ https://yoursite.vercel.app にアクセス
□ 正常に表示される
□ コンソールエラーがない
```

#### Phase 2：リードフォーム
```
□ /lead ページでテスト送信
□ /thanks にリダイレクトされる
□ エラーメッセージが出ない
```

#### Phase 3：外部連携
```
□ Slackに通知が届く
  - 時刻、メール、名前、会社名が表示される
□ メールが届く（5分以内）
  - PDFリンクが含まれている
  - リンクをクリックでダウンロード
□ Googleスプレッドシートに記録
  - 新しい行が追加されている
```

#### Phase 4：セキュリティ
```
□ 同じフォームを6回連続送信
  → 6回目でレート制限エラー
□ PDFリンクを2回クリック
  → 2回目は「使用済み」エラー
```

### 8.2 トラブルシューティング

#### 「環境変数が反映されない」

**チェック順序**：
1. Vercel Dashboardで値を確認
2. 環境（Production）が正しいか確認
3. 再デプロイを実行したか確認
4. Functions タブでエラーログ確認

#### 「Slackに通知が来ない」

**確認ポイント**：
```bash
# 1. Webhook URLが正しいか
echo $SLACK_WEBHOOK_URL

# 2. 手動テスト
curl -X POST [your-webhook-url] \
  -H 'Content-Type: application/json' \
  -d '{"text":"test"}'

# 3. Vercelログ確認
Vercel Dashboard → Functions → Logs
```

#### 「メールが届かない」

**確認順序**：
1. Resendダッシュボードで送信履歴確認
2. ドメイン認証のステータス確認（Verified？）
3. 迷惑メールフォルダ確認
4. SPF/DKIM/DMARCレコードの確認

---

## 第9章：セキュリティベストプラクティス

### 9.1 絶対にやってはいけないこと

```
❌ 環境変数をコードにハードコード
❌ .envファイルをGitにコミット
❌ 本番用の秘密鍵を開発環境で使用
❌ Base64エンコードを暗号化と勘違い
❌ 外部サイトに秘密情報を入力
```

### 9.2 必ずやるべきこと

```
✅ 環境ごとに異なる秘密鍵を使用
✅ 定期的な秘密鍵のローテーション（年1回）
✅ アクセスログの監視
✅ 最小権限の原則（必要な権限のみ付与）
✅ 2要素認証の有効化（Vercel、GitHub）
```

---

## 第10章：完全チェックリスト

### 必須項目チェックリスト

```markdown
## Vercel環境変数
□ SITE_BASE_URL を Production に設定
□ LEAD_HMAC_SECRET を強力な値で設定（64文字以上）
□ PDF_DOWNLOAD_URL を設定
□ SHEETS_SPREADSHEET_ID を設定
□ GOOGLE_APPLICATION_CREDENTIALS にJSON全体を貼り付け

## Google Sheets
□ スプレッドシートIDを確認
□ サービスアカウントのメールアドレスを確認
□ スプレッドシートに編集権限を付与

## Resend（メール送信）
□ APIキーを取得
□ ドメイン/サブドメインを登録
□ DNSレコード設定（MX、SPF、DKIM、DMARC）
□ 認証完了を確認（Verified）
□ RESEND_API_KEY を設定
□ RESEND_FROM を設定

## Slack（任意）
□ Slack Appを作成
□ Incoming Webhookを有効化
□ チャンネルを選択
□ Webhook URLを取得
□ テストコマンドで動作確認
□ SLACK_WEBHOOK_URL を設定

## 最終確認
□ すべての環境変数がProductionに設定されている
□ 再デプロイを実行
□ 本番環境で動作確認
```

---

## おわりに：失敗から学んだこと

この記事を書くきっかけとなった私の失敗：

1. **思い込み**：「Add New」ボタンがあるはずと30分探した
2. **安易な選択**：オンラインBase64デコーダーを使おうとした
3. **理解不足**：サブドメインの概念を理解していなかった
4. **確認不足**：環境変数名が間違っていることに気づかなかった

これらの失敗があったからこそ、この詳細なガイドを書くことができました。

**最後のアドバイス**：
- 焦らず、一つずつ確認しながら進める
- エラーが出たら、まずこの記事のチェックリストを確認
- 不明な点は、公式ドキュメントも併せて参照
- セキュリティは妥協しない

あなたの環境変数設定が無事完了することを願っています！

---

**この記事が役に立ったら**：
- 他の開発者にもシェアしてください
- つまづいた新しいポイントがあれば、コメントで教えてください
- 一緒により良い開発環境を作っていきましょう

*最終更新：2025年9月9日*
*Vercel、Resend、Slackの仕様は変更される可能性があります*