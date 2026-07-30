import { localizedSitemapPaths } from '@/lib/localizedSitemaps';
import { partnerSitemapCount } from '@/lib/sitemapXml';

export function masterSitemapPaths() {
  return [
    '/sitemaps/core.xml',
    '/sitemaps/original-games.xml',
    '/sitemaps/collections.xml',
    ...Array.from({ length: partnerSitemapCount() }, (_, index) => `/sitemaps/partner-games-${index + 1}.xml`),
    '/sitemap-images.xml',
    ...localizedSitemapPaths()
  ];
}
