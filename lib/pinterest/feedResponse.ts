import { buildPinterestRss } from '@/lib/pinterest/core';

export function pinterestFeedResponse(boardId: string) {
  const rss = buildPinterestRss(boardId);
  if (!rss) {
    return new Response('Not found', {
      status: 404,
      headers: { 'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': 'noindex, nofollow' },
    });
  }
  return new Response(rss, {
    status: 200,
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
      'cache-control': 'public, s-maxage=900, stale-while-revalidate=300',
      'x-content-type-options': 'nosniff',
      'x-robots-tag': 'noindex, nofollow',
    },
  });
}
