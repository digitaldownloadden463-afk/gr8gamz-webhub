import { canonical } from '@/lib/features';
import { getGlobalLaunchGames } from '@/lib/globalLaunch';
import { categoryName, localizedCanonical, nonEnglishLocales, pathForLocale, tr, type NonEnglishLocale } from '@/lib/i18n';
import { getRegistryCategories, slugifyRegistryValue } from '@/lib/gameRegistry';
import { sitemapDate, urlEntry, xmlEscape } from '@/lib/sitemapXml';

export const localizedGameSitemapSize = 500;

export function localizedHubPaths(locale: NonEnglishLocale) {
  const launch = getGlobalLaunchGames();
  const categorySlugs = new Set(launch.map((game) => slugifyRegistryValue(game.category)));
  const totalPages = Math.max(1, Math.ceil(launch.length / 48));
  return [
    pathForLocale(locale, '/'),
    pathForLocale(locale, '/games'),
    pathForLocale(locale, '/gr8-select'),
    ...Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => pathForLocale(locale, `/gr8-select/page/${index + 2}`)),
    pathForLocale(locale, '/gr8-originals'),
    pathForLocale(locale, '/gr8-trending'),
    pathForLocale(locale, '/new-games'),
    pathForLocale(locale, '/gr8-daily'),
    pathForLocale(locale, '/my-arcade'),
    ...getRegistryCategories().filter((category) => categorySlugs.has(category.slug)).map((category) => pathForLocale(locale, `/categories/${category.slug}`))
  ];
}

export function localizedGamePaths(locale: NonEnglishLocale) {
  return getGlobalLaunchGames().map((game) => pathForLocale(locale, game.url));
}

export function localizedGameSitemapCount() {
  return Math.max(1, Math.ceil(getGlobalLaunchGames().length / localizedGameSitemapSize));
}

export function localizedSitemapPaths() {
  return nonEnglishLocales.flatMap((locale) => [
    `/sitemaps/locale-${locale}-hubs.xml`,
    ...Array.from({ length: localizedGameSitemapCount() }, (_, index) => `/sitemaps/locale-${locale}-games-${index + 1}.xml`),
    `/sitemaps/locale-${locale}-images-1.xml`
  ]);
}

export function localizedHubEntries(locale: NonEnglishLocale) {
  return localizedHubPaths(locale).map((path) => urlEntry(path, sitemapDate, path.endsWith('/games') ? '0.8' : '0.65')).join('');
}

export function localizedGameEntries(locale: NonEnglishLocale, page: number) {
  const start = (page - 1) * localizedGameSitemapSize;
  return localizedGamePaths(locale).slice(start, start + localizedGameSitemapSize).map((path) => urlEntry(path, sitemapDate, '0.6')).join('');
}

export function localizedImageEntries(locale: NonEnglishLocale) {
  const text = tr(locale);
  return getGlobalLaunchGames().map((game) => {
    const page = localizedCanonical(locale, game.url);
    const image = game.artwork.startsWith('http') ? game.artwork : canonical(game.artwork);
    const category = categoryName(locale, game.category);
    const title = `${game.title} - ${category}`;
    const caption = `${game.title}: ${text.profile.intro.replace('{title}', game.title).replace('{category}', category)}`;
    return `
      <url>
        <loc>${xmlEscape(page)}</loc>
        <image:image>
          <image:loc>${xmlEscape(image)}</image:loc>
          <image:title>${xmlEscape(title)}</image:title>
          <image:caption>${xmlEscape(caption)}</image:caption>
        </image:image>
      </url>`;
  }).join('');
}
