import { originalGameEntries, urlset, xmlResponse } from '@/lib/sitemapXml';

export function GET() {
  return xmlResponse(urlset(originalGameEntries()));
}
