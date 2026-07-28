import { partnerGameEntries, urlset, xmlResponse } from '@/lib/sitemapXml';

export function GET() {
  return xmlResponse(urlset(partnerGameEntries(1)));
}
