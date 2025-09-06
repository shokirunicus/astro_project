const SITE = {
  name: "AIHALO",
  url: "https://aihalo.jp",
  logo: "/favicon.svg",
  locale: "ja-JP",
  twitter: "@your_account",
  description: "90日で成果を出すAIコンサルティング。経営者のためのAI活用戦略をご提案します。"
};
function absoluteUrl(path) {
  try {
    const base = SITE.url?.replace(/\/$/, "") || "";
    return `${base}${path.startsWith("/") ? path : `/${path}`}`;
  } catch {
    return path;
  }
}

export { SITE as S, absoluteUrl as a };
