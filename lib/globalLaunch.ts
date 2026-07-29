import { getAllGames } from '@/lib/games';
import type { RegistryGame } from '@/lib/gameRegistry';
import { getIndexableRegistryGames, slugifyRegistryValue } from '@/lib/gameRegistry';
import { categoryFit, categoryName, fill, type Locale } from '@/lib/i18n';

export const partnerTarget = 200;

function sortByCategoryBalance(games: RegistryGame[]) {
  const buckets = new Map<string, RegistryGame[]>();
  for (const game of games) {
    const key = slugifyRegistryValue(game.category || 'Arcade');
    const bucket = buckets.get(key) || [];
    bucket.push(game);
    buckets.set(key, bucket);
  }
  for (const bucket of buckets.values()) bucket.sort((a, b) => a.title.localeCompare(b.title));
  const ordered: RegistryGame[] = [];
  const keys = [...buckets.keys()].sort();
  while (ordered.length < games.length) {
    let moved = false;
    for (const key of keys) {
      const next = buckets.get(key)?.shift();
      if (next) {
        ordered.push(next);
        moved = true;
      }
    }
    if (!moved) break;
  }
  return ordered;
}

export function getGlobalLaunchGames() {
  const games = getIndexableRegistryGames();
  const originals = games.filter((game) => game.source === 'gr8-originals');
  const partners = sortByCategoryBalance(games.filter((game) => game.source === 'gr8-select')).slice(0, partnerTarget);
  return [...originals, ...partners];
}

export function isGlobalLaunchGame(slug: string, source?: RegistryGame['source']) {
  return getGlobalLaunchGames().some((game) => game.slug === slug && (!source || game.source === source));
}

export function getGlobalLaunchGame(slug: string, source?: RegistryGame['source']) {
  return getGlobalLaunchGames().find((game) => game.slug === slug && (!source || game.source === source));
}

export function getLocalizedGameText(game: RegistryGame, locale: Locale, text = { intro: '', why: '', tips: '', external: '' }) {
  const translatedCategory = categoryName(locale, game.category);
  const fit = categoryFit(locale, game.category);
  return {
    category: translatedCategory,
    title: game.title,
    description: fill(text.intro, { title: game.title, category: translatedCategory, fit }),
    why: fill(text.why, { title: game.title, category: translatedCategory, fit }),
    tips: text.tips,
    external: text.external,
    controls: game.controls,
    deviceSupport: game.deviceSupport,
    fit
  };
}

export function getOriginalGameBySlug(slug: string) {
  return getAllGames().find((game) => (game.slug || game.id) === slug);
}
