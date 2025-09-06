export const SITE = {
  name: 'AIHALO',
  url: (import.meta.env.SITE_BASE_URL as string) || 'http://localhost:4321',
  logo: '/favicon.svg',
  locale: 'ja-JP',
  twitter: '@your_account',
  description:
    '90日で成果を出すAIコンサルティング。経営者のためのAI活用戦略をご提案します。',
};

export function absoluteUrl(path: string) {
  try {
    const base = SITE.url?.replace(/\/$/, '') || '';
    return `${base}${path.startsWith('/') ? path : `/${path}`}`;
  } catch {
    return path;
  }
}

