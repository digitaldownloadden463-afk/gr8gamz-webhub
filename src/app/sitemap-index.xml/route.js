import { absolutePath, xmlEscape } from '../../lib/crawl';

export const dynamic = 'force-static';

export function GET() {
  const now = new Date().toISOString();
  const sitemaps = ['/sitemap.xml', '/sitemap-games.xml', '/sitemap-content.xml', '/sitemap-discovery.xml', '/sitemap-partner-games.xml', '/sitemap-images.xml'];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemaps.map((path) => `  <sitemap>\n    <loc>${xmlEscape(absolutePath(path))}</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>`).join('\n')}\n</sitemapindex>`;

  return new Response(body, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600'
    }
  });
}
