import { getCoreRoutes, getDiscoveryRoutes, renderUrlSet } from '../../lib/crawl';

export const dynamic = 'force-static';

export function GET() {
  return new Response(renderUrlSet([...getCoreRoutes(), ...getDiscoveryRoutes()], { changeFrequency: 'daily', priority: 0.8 }), {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600'
    }
  });
}
