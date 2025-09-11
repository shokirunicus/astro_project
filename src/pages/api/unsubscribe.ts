export const prerender = false;

function secHeaders(init?: HeadersInit) {
  const h = new Headers(init);
  h.set('Cache-Control', 'no-store');
  h.set('X-Content-Type-Options', 'nosniff');
  h.set('X-Frame-Options', 'DENY');
  return h;
}

export async function POST() {
  // One-Click List-Unsubscribe endpoint
  // Gmail等は本文に 'List-Unsubscribe=One-Click' を含むPOSTを行います。
  // 現時点では実ストレージが無いため、204で応答のみ（将来はDB/SaaSに記録）。
  const h = secHeaders();
  return new Response(null, { status: 204, headers: h });
}

export async function GET() {
  const h = secHeaders({ 'content-type': 'text/plain; charset=utf-8' });
  return new Response('Unsubscribe endpoint. Please use the email link to unsubscribe.', { status: 200, headers: h });
}

