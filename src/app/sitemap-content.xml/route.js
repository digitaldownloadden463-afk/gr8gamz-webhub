import { getContentRoutes, getCoreRoutes, renderUrlSet } from '../../lib/crawl';

export const dynamic = 'force-static';

export function GET() {
  const routes = [...getCoreRoutes().filter((route) => ['/updates', '/collections', '/new-this-week'].includes(route)), ...getContentRoutes()];
  return new Response(renderUrlSet(routes, { changeFrequency: 'daily', priority: 0.85 }), {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600'
    }
  });
}
