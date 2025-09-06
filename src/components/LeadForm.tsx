import { useState } from 'react';
import '../styles/lead-form.css';

interface FormDataShape {
  email: string;
  name: string;
  company: string;
  consent: boolean;
  hp: string; // honeypot
}

type ApiResponse = { ok: boolean; token?: string; error?: string };

export default function LeadForm() {
  const [formData, setFormData] = useState<FormDataShape>({
    email: '',
    name: '',
    company: '',
    consent: false,
    hp: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  function update<K extends keyof FormDataShape>(key: K, value: FormDataShape[K]) {
    setFormData((s) => ({ ...s, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // basic client-side validation
    if (!formData.email || !formData.name || !formData.company || !formData.consent) {
      setError('必須項目を入力/チェックしてください。');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.status === 429) {
        setError('短時間に送信が多すぎます。しばらくしてから再試行してください。');
        return;
      }

      if (!res.ok) {
        let message = '送信に失敗しました。時間をおいて再度お試しください。';
        try {
          const j = (await res.json()) as ApiResponse;
          if (j && j.error === 'validation') message = '入力内容をご確認ください。';
          else if (j && j.error === 'honeypot') message = '送信に失敗しました。';
          else if (j && j.error === 'server_misconfigured') message = 'サーバー設定に問題が発生しました。';
        } catch {
          // ignore
        }
        setError(message);
        return;
      }

      // success
      setSuccess(true);
      setFormData({ email: '', name: '', company: '', consent: false, hp: '' });
    } catch {
      setError('ネットワークエラーが発生しました。接続を確認して再試行してください。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="lead-form__container">
      <h2 className="lead-form__title">資料ダウンロード（無料）</h2>
      <p className="lead-form__subtitle">必要事項をご入力のうえ、送信してください。</p>

      {success && (
        <div className="lead-form__alert lead-form__alert--success" role="status">
          送信が完了しました。メールをご確認ください（届かない場合は迷惑メールをご確認ください）。
        </div>
      )}
      {error && (
        <div className="lead-form__alert lead-form__alert--error" role="alert">
          {error}
        </div>
      )}

      <form className="lead-form" onSubmit={onSubmit} noValidate>
        <div className="lead-form__group">
          <label htmlFor="name">お名前<span className="lead-form__req">必須</span></label>
          <input
            id="name"
            name="name"
            type="text"
            maxLength={100}
            value={formData.name}
            onChange={(e) => update('name', e.target.value)}
            required
            placeholder="山田 太郎"
          />
        </div>

        <div className="lead-form__group">
          <label htmlFor="company">会社名<span className="lead-form__req">必須</span></label>
          <input
            id="company"
            name="company"
            type="text"
            maxLength={200}
            value={formData.company}
            onChange={(e) => update('company', e.target.value)}
            required
            placeholder="株式会社AIHALO"
          />
        </div>

        <div className="lead-form__group">
          <label htmlFor="email">メールアドレス<span className="lead-form__req">必須</span></label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => update('email', e.target.value)}
            required
            placeholder="taro@example.com"
          />
        </div>

        {/* Honeypot: visually hidden */}
        <div className="lead-form__hp" aria-hidden="true">
          <label htmlFor="hp">HP</label>
          <input
            id="hp"
            name="hp"
            type="text"
            autoComplete="off"
            tabIndex={-1}
            value={formData.hp}
            onChange={(e) => update('hp', e.target.value)}
          />
        </div>

        <div className="lead-form__group lead-form__group--consent">
          <label className="lead-form__checkbox">
            <input
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={(e) => update('consent', e.target.checked)}
              required
              disabled={loading}
            />
            <span>
              <a href="/privacy" target="_blank" rel="noopener noreferrer" className="lead-form__link">プライバシーポリシー</a>
              に同意します
            </span>
          </label>
        </div>

        <div className="lead-form__actions">
          <button type="submit" className="lead-form__button" disabled={loading}>
            {loading ? '送信中…' : '送信してPDFを受け取る'}
          </button>
        </div>
      </form>
    </div>
  );
}

