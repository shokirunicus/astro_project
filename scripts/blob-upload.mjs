#!/usr/bin/env node
import { put } from '@vercel/blob';

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.error('BLOB_READ_WRITE_TOKEN is required');
    process.exit(1);
  }
  const [filePath, slug] = process.argv.slice(2);
  if (!filePath || !slug) {
    console.error('Usage: pnpm blob:upload <filePath> <slug>');
    process.exit(1);
  }
  const fs = await import('node:fs');
  const data = fs.readFileSync(filePath);
  const key = `docs/${slug}.pdf`;
  const { url } = await put(key, data, {
    access: 'public',
    addRandomSuffix: false,
    token,
    contentType: 'application/pdf'
  });
  console.log('Uploaded:', key);
  console.log('URL:', url);
  console.log('\nSet BLOB_BASE_URL to:', new URL(url).origin);
}

main().catch((e) => { console.error(e); process.exit(1); });

