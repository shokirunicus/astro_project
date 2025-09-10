export type SlackLeadPayload = {
  email: string;
  name?: string;
  company?: string;
  utm?: Partial<Record<'utm_source'|'utm_medium'|'utm_campaign'|'utm_content'|'utm_term', string>>;
  ref?: string | null;
  ts?: string;
};

export async function notifySlack(data: SlackLeadPayload): Promise<number | undefined> {
  const url = process.env.SLACK_WEBHOOK_URL;
  const debug = (process.env.LEAD_DEBUG || '').toLowerCase() === '1' || (process.env.LEAD_DEBUG || '').toLowerCase() === 'true';
  if (!url) return; // 未設定ならスキップ
  try {
    const lines: string[] = [];
    lines.push(`*新規リード*`);
    if (data.ts) lines.push(`🕒 ${data.ts}`);
    if (data.email) lines.push(`📧 ${data.email}`);
    if (data.name) lines.push(`👤 ${data.name}`);
    if (data.company) lines.push(`🏢 ${data.company}`);
    const utmParts: string[] = [];
    if (data.utm) {
      for (const k of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'] as const) {
        const v = data.utm[k];
        if (v) utmParts.push(`${k}: ${v}`);
      }
    }
    lines.push(`🔗 ${utmParts.length ? utmParts.join(' | ') : 'なし'}`);
    if (data.ref) {
      let ref = data.ref;
      if (ref.length > 50) ref = ref.slice(0, 50) + '…';
      lines.push(`↗︎ ref: ${ref}`);
    }

    const body = {
      text: '新規リード獲得',
      blocks: [
        { type: 'section', text: { type: 'mrkdwn', text: lines.join('\n') } },
      ],
    };
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (debug) {
      try { console.log('[Slack] notify status:', resp.status); } catch {}
    }
    return resp.status;
  } catch {
    return undefined;
  }
}
