import { localizedSitemapPaths } from '@/lib/localizedSitemaps';
import { partnerSitemapCount, sitemapEntry } from '@/lib/sitemapXml';

export function GET() {
  const sitemaps = [
    '/sitemap.xml',
    '/sitemaps/original-games.xml',
    '/sitemaps/collections.xml',
    ...Array.from({ length: partnerSitemapCount() }, (_, index) => `/sitemaps/partner-games-${index + 1}.xml`),
    '/sitemap-images.xml',
    ...localizedSitemapPaths()
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemaps.map((path) => sitemapEntry(path)).join('\n')}
  </sitemapindex>`;
  return new Response(body, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
}
