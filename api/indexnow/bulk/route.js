import { INDEXNOW_KEY, absolutePath, getIndexNowUrlList } from '../../../../lib/crawl';

export const dynamic = 'force-dynamic';

function pickUrls(scope) {
  const all = getIndexNowUrlList();
  if (scope === 'content') return all.filter((url) => url.includes('/updates') || url.includes('/collections') || url.includes('/new-this-week'));
  if (scope === 'games') return all.filter((url) => url.includes('/arcade/'));
  if (scope === 'core') return all.filter((url) => !url.includes('/arcade/') && !url.includes('/tags/'));
  return all;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const dryRun = searchParams.get('dryRun') === '1';
  const scope = searchParams.get('scope') || 'content';
  const limit = Math.max(1, Math.min(100, Number(searchParams.get('limit') || 40)));
  const urls = pickUrls(scope).slice(0, limit);
  const host = new URL(absolutePath('/')).host;
  const payload = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: absolutePath(`/${INDEXNOW_KEY}.txt`),
    urlList: urls
  };

  if (dryRun) {
    return Response.json({ ok: true, dryRun: true, scope, count: urls.length, payload });
  }

  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload)
  });

  return Response.json({
    ok: response.ok,
    status: response.status,
    scope,
    count: urls.length,
    submitted: urls
  });
}
