import { canonical, siteUrl } from '@/lib/features';
import { getAllGames } from '@/lib/games';
import { getIndexableRegistryGames, getRegistryCategories, getRegistryControlHubs } from '@/lib/gameRegistry';
import { getPartnerCataloguePage } from '@/src/data/partnerGameProfiles';

export const partnerSitemapSize = 1000;
export const sitemapDate = '2026-07-28';

export function xmlEscape(value: string) {
  return value.replace(/[<>&'"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[char] || char));
}

export function xmlResponse(body: string) {
  return new Response(body, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
}

export function urlset(entries: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}
  </urlset>`;
}

export function sitemapEntry(path: string) {
  return `<sitemap><loc>${siteUrl}${path}</loc><lastmod>${sitemapDate}</lastmod></sitemap>`;
}

export function urlEntry(path: string, lastmod = sitemapDate, priority = '0.7') {
  return `<url><loc>${canonical(path)}</loc><lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>${priority}</priority></url>`;
}

export function originalGameEntries() {
  return getAllGames().map((game) => urlEntry(`/arcade/${game.slug || game.id}`, game.dateAdded || sitemapDate, '0.8')).join('');
}

export function partnerGames() {
  return getIndexableRegistryGames().filter((game) => game.source === 'gr8-select');
}

export function partnerSitemapCount() {
  return Math.max(1, Math.ceil(partnerGames().length / partnerSitemapSize));
}

export function partnerGameEntries(page: number) {
  const start = (page - 1) * partnerSitemapSize;
  return partnerGames().slice(start, start + partnerSitemapSize).map((game) => urlEntry(game.url, game.lastModified || sitemapDate, '0.6')).join('');
}

export function collectionEntries() {
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
    ...getRegistryCategories().map((category) => `/categories/${category.slug}`),
    ...getRegistryControlHubs().map((hub) => `/controls/${hub.slug}`),
    ...Array.from({ length: Math.max(0, getPartnerCataloguePage(1).totalPages - 1) }, (_, index) => `/gr8-select/page/${index + 2}`)
  ];
  return routes.map((route) => urlEntry(route, sitemapDate, route === '/games' ? '0.85' : '0.65')).join('');
}
