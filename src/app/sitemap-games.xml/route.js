import { getGameRoutes, renderUrlSet } from '../../lib/crawl';

export const dynamic = 'force-static';

export function GET() {
  return new Response(renderUrlSet(getGameRoutes(), { changeFrequency: 'weekly', priority: 0.9 }), {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600'
    }
  });
}
