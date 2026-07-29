import { localizedGameEntries, localizedGameSitemapCount, localizedHubEntries, localizedImageEntries } from '@/lib/localizedSitemaps';
import { isLocale, nonEnglishLocales, type NonEnglishLocale } from '@/lib/i18n';
import { urlset, xmlResponse } from '@/lib/sitemapXml';

function parseLocalizedSitemap(name: string): { locale: NonEnglishLocale; kind: 'hubs' | 'games' | 'images'; page: number } | null {
  const match = name.match(/^locale-(.+)-(hubs|games|images)(?:-(\d+))?\.xml$/);
  if (!match) return null;
  const locale = match[1];
  const kind = match[2] as 'hubs' | 'games' | 'images';
  const page = Number(match[3] || 1);
  if (!isLocale(locale) || locale === 'en' || !nonEnglishLocales.includes(locale) || !Number.isInteger(page) || page < 1) return null;
  if ((kind === 'hubs' || kind === 'images') && page !== 1) return null;
  if (kind === 'games' && page > localizedGameSitemapCount()) return null;
  return { locale, kind, page };
}

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const parsed = parseLocalizedSitemap((await params).name);
  if (!parsed) return new Response('Not found', { status: 404 });
  if (parsed.kind === 'hubs') return xmlResponse(urlset(localizedHubEntries(parsed.locale)));
  if (parsed.kind === 'images') {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${localizedImageEntries(parsed.locale)}
  </urlset>`;
    return xmlResponse(xml);
  }
  return xmlResponse(urlset(localizedGameEntries(parsed.locale, parsed.page)));
}
