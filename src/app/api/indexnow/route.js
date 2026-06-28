import { siteConfig } from '../../../data/site';
import { INDEXNOW_KEY, absolutePath } from '../../../lib/crawl';

export const dynamic = 'force-dynamic';

function normaliseUrl(url) {
  if (!url) return null;
  if (url.startsWith('/')) return `${siteConfig.siteUrl.replace(/\/$/, '')}${url}`;
  if (url.startsWith(siteConfig.siteUrl)) return url;
  return null;
}

export async function GET(request) {
  const key = INDEXNOW_KEY;
  const { searchParams } = new URL(request.url);
  const targetUrl = normaliseUrl(searchParams.get('url'));

  if (!key) {
    return Response.json({
      ok: false,
      message: 'INDEXNOW_KEY fallback is active.',
      example: '/api/indexnow?url=/arcade/neon-snake-rush'
    }, { status: 200 });
  }

  if (!targetUrl) {
    return Response.json({ ok: false, message: 'Add a valid site URL or path using ?url=/path' }, { status: 400 });
  }

  const host = new URL(siteConfig.siteUrl).host;
  const payload = {
    host,
    key,
    keyLocation: absolutePath(`/${key}.txt`),
    urlList: [targetUrl]
  };

  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload)
  });

  return Response.json({ ok: response.ok, status: response.status, submitted: targetUrl });
}
