import { canonical, siteUrl } from '@/lib/features';
import { getAllGames } from '@/lib/games';
import { getIndexableRegistryGames, getRegistryCategories, getRegistryControlHubs } from '@/lib/gameRegistry';
import { getPartnerCataloguePage } from '@/src/data/partnerGameProfiles';
import { commerceRouteLastmod, commerceRoutePaths } from '@/lib/commerce/catalogue';

export const partnerSitemapSize = 1000;

export function xmlEscape(value: string) {
  return value.replace(/[<>&'"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[char] || char));
}

export function validLastmod(value?: string) {
  if (!value) return '';
  const text = String(value).trim();
  if (!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z)?$/.test(text)) return '';
  const date = new Date(text);
  if (Number.isNaN(date.getTime()) || date.getTime() > Date.now()) return '';
  return text;
}

export function xmlResponse(body: string) {
  return new Response(body, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
}

export function urlset(entries: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}
  </urlset>`;
}

export function sitemapEntry(path: string, lastmod?: string) {
  const safeLastmod = validLastmod(lastmod);
  return `<sitemap><loc>${siteUrl}${path}</loc>${safeLastmod ? `<lastmod>${safeLastmod}</lastmod>` : ''}</sitemap>`;
}

export function urlEntry(path: string, lastmod?: string, priority = '0.7') {
  const safeLastmod = validLastmod(lastmod);
  return `<url><loc>${canonical(path)}</loc>${safeLastmod ? `<lastmod>${safeLastmod}</lastmod>` : ''}<changefreq>monthly</changefreq><priority>${priority}</priority></url>`;
}

export function originalGameEntries() {
  return getAllGames().map((game) => urlEntry(`/arcade/${game.slug || game.id}`, game.dateAdded, '0.8')).join('');
}

export function coreEntries() {
  const staticRoutes = ['/', '/about', '/contact', '/privacy', '/terms', '/cookie-policy', '/partner-disclosure', '/affiliate-disclosure', '/accessibility', '/child-safety', '/copyright', '/report-a-game', '/editorial-policy'];
  return staticRoutes.map((route) => urlEntry(route, undefined, route === '/' ? '1.0' : '0.7')).join('');
}

export function partnerGames() {
  return getIndexableRegistryGames().filter((game) => game.source === 'gr8-select');
}

export function partnerSitemapCount() {
  return Math.max(1, Math.ceil(partnerGames().length / partnerSitemapSize));
}

export function partnerGameEntries(page: number) {
  const start = (page - 1) * partnerSitemapSize;
  return partnerGames().slice(start, start + partnerSitemapSize).map((game) => urlEntry(game.url, game.lastModified, '0.6')).join('');
}

export function collectionEntries() {
  const categoryRoutes = getRegistryCategories().flatMap((category) => [
    `/categories/${category.slug}`,
    ...Array.from({ length: Math.max(0, Math.ceil(category.count / 48) - 1) }, (_, index) => `/categories/${category.slug}/page/${index + 2}`)
  ]);
  const controlRoutes = getRegistryControlHubs().flatMap((hub) => [
    `/controls/${hub.slug}`,
    ...Array.from({ length: Math.max(0, Math.ceil(hub.count / 48) - 1) }, (_, index) => `/controls/${hub.slug}/page/${index + 2}`)
  ]);
  const routes = [
    '/games',
    '/gr8-originals',
    '/gr8-select',
    '/more-free-games',
    '/gr8-trending',
    '/gr8-daily',
    '/new-games',
    '/popular-games',
    '/quick-games',
    '/mobile-games',
    ...categoryRoutes,
    ...controlRoutes,
    ...Array.from({ length: Math.max(0, getPartnerCataloguePage(1).totalPages - 1) }, (_, index) => `/gr8-select/page/${index + 2}`)
  ];
  return routes.map((route) => urlEntry(route, undefined, route === '/games' ? '0.85' : '0.65')).join('');
}

export function commerceEntries() {
  return commerceRoutePaths().map((route) => urlEntry(route, commerceRouteLastmod(route), route === '/gaming-gear' ? '0.8' : '0.65')).join('');
}

export function sitemapIndex(paths: string[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${paths.map((path) => sitemapEntry(path)).join('\n')}
  </sitemapindex>`;
}
