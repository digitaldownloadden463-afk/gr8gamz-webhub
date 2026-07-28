import { siteUrl } from '@/lib/features';

const sitemaps = ['/sitemap.xml', '/sitemap-images.xml'];

export function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemaps.map((path) => `<sitemap><loc>${siteUrl}${path}</loc><lastmod>2026-07-28</lastmod></sitemap>`).join('\n')}
  </sitemapindex>`;
  return new Response(body, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
}
