import { masterSitemapPaths } from '@/lib/masterSitemap';
import { sitemapIndex, xmlResponse } from '@/lib/sitemapXml';

export const dynamic = 'force-static';

export function GET() {
  return xmlResponse(sitemapIndex(masterSitemapPaths()));
}
