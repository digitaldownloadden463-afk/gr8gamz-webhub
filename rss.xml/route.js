import { getAllUpdatePosts } from '../../lib/content';
import { renderRssFeed } from '../../lib/crawl';

export const dynamic = 'force-static';

export function GET() {
  return new Response(renderRssFeed(getAllUpdatePosts()), {
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
      'cache-control': 'public, max-age=3600'
    }
  });
}
