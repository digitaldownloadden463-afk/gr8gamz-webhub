import { siteConfig } from '../../data/site';
import { getAllUpdatePosts } from '../../lib/content';
import { absolutePath } from '../../lib/crawl';

export const dynamic = 'force-static';

export function GET() {
  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: `${siteConfig.name} Updates`,
    home_page_url: absolutePath('/'),
    feed_url: absolutePath('/feed.json'),
    description: 'Fresh GR8 GAMZ updates, guides, collections and game platform notes.',
    language: 'en-GB',
    items: getAllUpdatePosts().map((post) => ({
      id: absolutePath(`/updates/${post.slug}`),
      url: absolutePath(`/updates/${post.slug}`),
      title: post.title,
      summary: post.description,
      content_text: [post.description, ...(post.summary || [])].join('\n\n'),
      date_published: new Date(post.date).toISOString(),
      tags: post.tags || []
    }))
  };

  return Response.json(feed, {
    headers: {
      'cache-control': 'public, max-age=3600'
    }
  });
}
