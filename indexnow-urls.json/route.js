import { INDEXNOW_KEY, absolutePath, getIndexNowUrlList } from '../../lib/crawl';

export const dynamic = 'force-static';

export function GET() {
  return Response.json({
    host: new URL(absolutePath('/')).host,
    key: INDEXNOW_KEY,
    keyLocation: absolutePath(`/${INDEXNOW_KEY}.txt`),
    count: getIndexNowUrlList().length,
    urlList: getIndexNowUrlList()
  }, {
    headers: {
      'cache-control': 'public, max-age=1800'
    }
  });
}
