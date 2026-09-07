import { getActivePseoIntents, pseoGeneratedAt, pseoIntentPath } from '@/lib/pseoIntents';
import { urlEntry, urlset, xmlResponse } from '@/lib/sitemapXml';

export function GET() {
  const entries = getActivePseoIntents()
    .map((intent) => urlEntry(pseoIntentPath(intent.slug), pseoGeneratedAt, '0.65'))
    .join('');
  return xmlResponse(urlset(entries));
}
