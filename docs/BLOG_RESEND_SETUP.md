# Resendでメール送信を実装する完全ガイド：登録から本番運用まで、つまづきポイントを徹底解説

## はじめに：なぜResendを選ぶのか

Webサービスを開発していると、必ず必要になるのが「メール送信機能」です。お問い合わせの自動返信、会員登録の確認メール、PDFダウンロードリンクの送付など、様々な場面でメール送信が必要になります。

従来は、SendGridやAmazon SESが主流でしたが、2023年に登場したResendは、その圧倒的な使いやすさと開発者体験の良さで急速にシェアを伸ばしています。本記事では、Resendの登録から本番運用まで、実際につまづきやすいポイントを交えながら詳しく解説します。

### 本記事で学べること

- Resendアカウントの作成からAPIキー取得まで
- ドメイン認証の正しい設定方法（既存メールを壊さない方法）
- 開発環境と本番環境の使い分け
- よくあるトラブルと解決方法
- 料金プランの選び方と注意点

## 第1章：Resendアカウントの作成とAPIキーの取得

### 1-1. アカウント作成の手順

まずは[Resend公式サイト](https://resend.com)にアクセスし、「Start for free」ボタンをクリックします。GitHubアカウントでのサインアップも可能ですが、メールアドレスでの登録がおすすめです。理由は、後々チーム開発する際に、GitHubアカウントに依存しない方が管理しやすいからです。

登録時の注意点：
- パスワードは16文字以上が推奨
- 2要素認証は後から必ず設定する
- タイムゾーンは「Asia/Tokyo」に設定

### 1-2. 初回ログインと画面構成

ログイン後、ダッシュボードが表示されます。左側のメニューは以下の構成になっています：

```
Overview     - 送信数やエラー率の概要
Emails       - 送信履歴の確認
Domains      - ドメイン認証の管理
API Keys     - APIキーの管理
Webhooks     - イベント通知の設定
Billing      - 料金プランと使用量
```

### 1-3. APIキーの作成

「API Keys」メニューから「Create API Key」をクリックします。ここで重要なのは、キーに分かりやすい名前を付けることです。

推奨される命名規則：
- `Production - AIHALO Website` （本番環境用）
- `Development - Local Testing` （開発環境用）
- `Staging - Preview Deploy` （ステージング環境用）

**つまづきポイント①：APIキーは一度しか表示されない**

作成したAPIキーは、作成時にしか完全な文字列が表示されません。必ず安全な場所（パスワードマネージャーなど）に保存してください。もし忘れてしまった場合は、新しいキーを作成し直す必要があります。

## 第2章：ドメイン認証の設定（既存メールを壊さない方法）

### 2-1. なぜドメイン認証が必要なのか

ドメイン認証をしない場合、Resendのサブドメイン（`@resend.dev`）からしかメールを送信できません。これでは、企業のブランディング的にも、迷惑メールフィルタ的にも問題があります。しかし、ドメイン認証には大きな落とし穴があります。

### 2-2. MXレコードの罠

**つまづきポイント②：MXレコードを設定すると既存メールが受信できなくなる**

これは非常に重要な点です。ResendのドキュメントにはMXレコードの設定が記載されていますが、これを設定すると、そのドメインの全てのメール受信先がResendに向いてしまいます。つまり、Google WorkspaceやMicrosoft 365で受信していた既存のメールが届かなくなってしまうのです。

### 2-3. 安全な設定方法（3つのパターン）

#### パターン1：SPF/DKIMのみ設定（推奨）

最も安全で実用的な方法です。MXレコードは設定せず、SPFとDKIMのみを設定します。

```dns
; SPFレコード（TXTレコード）
example.com. IN TXT "v=spf1 include:amazonses.com include:_spf.google.com ~all"

; DKIMレコード（TXTレコード）
resend._domainkey.example.com. IN TXT "p=MIGfMA0GCS..."
```

この方法のメリット：
- 既存のメール受信に影響なし
- 送信ドメイン認証は正常に機能
- Google WorkspaceとResendを併用可能

#### パターン2：サブドメインを使用

メール送信専用のサブドメインを作成する方法です。

```dns
; mail.example.com用の設定
mail.example.com. IN TXT "v=spf1 include:amazonses.com ~all"
resend._domainkey.mail.example.com. IN TXT "p=MIGfMA0GCS..."
```

環境変数での設定：
```env
MAIL_FROM=noreply@mail.example.com
```

#### パターン3：別ドメインを使用

システムメール専用のドメインを取得する方法です。例えば、`example-system.com`のようなドメインを別途取得します。

### 2-4. DNS設定の実際の手順

1. Resendダッシュボードで「Domains」→「Add Domain」
2. ドメイン名を入力（サブドメインの場合は`mail.example.com`）
3. 表示されたDNSレコードをコピー
4. お使いのDNSプロバイダ（Route53、Cloudflare等）で設定
5. 「Verify Domain」をクリック

**つまづきポイント③：DNS反映には時間がかかる**

DNS設定後、すぐに認証できないことがあります。通常5〜10分で反映されますが、最大48時間かかる場合もあります。`nslookup`や`dig`コマンドで確認できます：

```bash
# TXTレコードの確認
dig TXT _resend.example.com

# 結果が表示されればOK
```

## 第3章：開発環境での実装

### 3-1. Node.js/TypeScriptでの実装例

まずは必要なパッケージをインストールします：

```bash
npm install resend
# または
pnpm add resend
```

基本的な送信コード：

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'noreply@example.com',
      to: ['user@example.com'],
      subject: 'PDFダウンロードリンクのお知らせ',
      html: '<p>ダウンロードリンクはこちら...</p>',
    });

    if (error) {
      console.error('送信エラー:', error);
      return;
    }

    console.log('送信成功:', data);
  } catch (error) {
    console.error('予期しないエラー:', error);
  }
}
```

### 3-2. テンプレートの活用

Resendは、React Emailというテンプレートエンジンをサポートしています：

```tsx
import {
  Html,
  Button,
  Container,
  Text,
} from '@react-email/components';

export function WelcomeEmail({ userName, downloadUrl }) {
  return (
    <Html>
      <Container>
        <Text>こんにちは、{userName}さん</Text>
        <Button href={downloadUrl}>
          PDFをダウンロード
        </Button>
      </Container>
    </Html>
  );
}
```

**つまづきポイント④：開発環境でのレート制限**

無料プランでは、1日100通、1秒1通の制限があります。開発中にループ処理でメールを送信してしまうと、すぐに制限に達してしまいます。必ず以下の対策を実施してください：

```typescript
// 開発環境では実際に送信しない
if (process.env.NODE_ENV === 'development') {
  console.log('メール送信（開発環境）:', { to, subject });
  return { success: true, mockData: true };
}
```

## 第4章：本番環境への移行

### 4-1. 環境変数の管理

Vercelを使用する場合の設定例：

```bash
# Vercel CLIでの設定
vercel env add RESEND_API_KEY production
vercel env add MAIL_FROM production
vercel env add ADMIN_EMAIL production
```

### 4-2. エラーハンドリングとリトライ

本番環境では、確実にメールを送信するためのリトライ機能が重要です：

```typescript
async function sendEmailWithRetry(
  emailData: EmailData,
  maxRetries: number = 3
) {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await resend.emails.send(emailData);
      
      // 成功したらSlackに通知
      await notifySlack(`メール送信成功: ${emailData.to}`);
      
      return result;
    } catch (error) {
      lastError = error;
      
      // 指数バックオフで待機
      const waitTime = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  // 全てのリトライが失敗
  await notifySlack(`メール送信失敗: ${lastError.message}`);
  throw lastError;
}
```

### 4-3. モニタリングとログ

送信履歴の管理は重要です。Resendのダッシュボードでも確認できますが、自前でもログを残しましょう：

```typescript
// Google Sheetsにログを記録
async function logEmailSent(emailData: EmailLog) {
  const sheets = google.sheets({ version: 'v4' });
  
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.LOG_SHEET_ID,
    range: 'EmailLog!A:E',
    valueInputOption: 'RAW',
    requestBody: {
      values: [[
        new Date().toISOString(),
        emailData.to,
        emailData.subject,
        emailData.status,
        emailData.messageId
      ]]
    }
  });
}
```

## 第5章：料金プランと最適化

### 5-1. 料金プランの選び方

Resendの料金体系（2024年1月現在）：

| プラン | 月額 | 送信数 | 特徴 |
|--------|------|--------|------|
| Free | $0 | 100通/日、3,000通/月 | 個人開発向け |
| Pro | $20 | 50,000通/月 | スタートアップ向け |
| Team | $80 | 300,000通/月 | 中規模サービス向け |
| Enterprise | カスタム | 無制限 | 大規模サービス向け |

**つまづきポイント⑤：送信数のカウント方法**

CCやBCCの宛先も1通としてカウントされます。つまり、1通のメールを10人にCCで送ると、11通としてカウントされます。

### 5-2. コスト最適化のテクニック

1. **バッチ送信の活用**
   ```typescript
   // 個別送信ではなく、バッチ送信を使用
   const batch = users.map(user => ({
     from: 'noreply@example.com',
     to: user.email,
     subject: 'お知らせ',
     html: generateHtml(user)
   }));
   
   await resend.batch.send(batch);
   ```

2. **不要な送信の削減**
   - バウンスメールのアドレスは送信リストから除外
   - 配信停止希望者の管理
   - 重複送信の防止

## 第6章：トラブルシューティング

### 6-1. よくあるエラーと対処法

#### エラー1：「Domain not verified」

原因：ドメイン認証が完了していない
対処法：DNS設定を確認し、24時間待つ

#### エラー2：「Rate limit exceeded」

原因：送信制限に達した
対処法：
- プランのアップグレード
- 送信間隔の調整
- キューイングシステムの導入

#### エラー3：「Invalid from address」

原因：認証されていないドメインから送信
対処法：送信元アドレスのドメインを確認

### 6-2. デバッグのコツ

```typescript
// 詳細なログ出力
const result = await resend.emails.send({
  from: 'noreply@example.com',
  to: 'test@example.com',
  subject: 'Test',
  html: '<p>Test</p>',
  headers: {
    'X-Debug-Mode': 'true',
    'X-Request-ID': crypto.randomUUID()
  }
});

console.log('送信結果:', JSON.stringify(result, null, 2));
```

## まとめ：Resendを使いこなすために

Resendは、シンプルで使いやすいメール送信サービスですが、本番運用では様々な考慮点があります。特に重要なのは：

1. **ドメイン認証は慎重に**：MXレコードは設定せず、SPF/DKIMのみ設定
2. **環境ごとの設定**：開発/ステージング/本番を明確に分ける
3. **エラーハンドリング**：リトライとログ記録を確実に実装
4. **コスト管理**：送信数を監視し、適切なプランを選択

これらのポイントを押さえれば、Resendを使った堅牢なメール送信システムを構築できます。

最後に、Resendは積極的にアップデートされているサービスです。公式ドキュメントやChangelogを定期的に確認することをおすすめします。

## 参考リンク

- [Resend公式ドキュメント](https://resend.com/docs)
- [React Email](https://react.email)
- [DNS設定チェッカー](https://mxtoolbox.com)
- [Resend Status Page](https://status.resend.com)

---

*本記事は2024年1月時点の情報を基に作成しています。最新の情報は公式サイトでご確認ください。*