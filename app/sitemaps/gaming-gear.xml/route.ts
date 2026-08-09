import { commerceEntries, urlset, xmlResponse } from '@/lib/sitemapXml';

export const dynamic = 'force-static';

export function GET() {
  return xmlResponse(urlset(commerceEntries()));
}
