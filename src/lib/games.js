import games from '../data/games.json';
import { siteConfig } from '../data/site';

export function getAllGames() {
  return [...games].sort((a, b) => (a.launchOrder || 999) - (b.launchOrder || 999));
}

export function getFeaturedGames(limit = 6) {
  return getAllGames().slice(0, limit);
}

export function getPopularGames(limit) {
  const sorted = getAllGames().filter((game) => game.isPopular).sort((a, b) => (b.rating || 0) - (a.rating || 0));
  return typeof limit === 'number' ? sorted.slice(0, limit) : sorted;
}

export function getNewGames(limit) {
  const sorted = getAllGames().filter((game) => game.isNew).sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0));
  return typeof limit === 'number' ? sorted.slice(0, limit) : sorted;
}

export function getGamesAlphabetical() {
  return [...getAllGames()].sort((a, b) => a.name.localeCompare(b.name));
}

export function getGameBySlug(slug) {
  return games.find((game) => game.id === slug);
}

export function getGamesByCategory(categoryId) {
  return getAllGames().filter((game) => game.category === categoryId);
}

export function getCategoryBySlug(slug) {
  return siteConfig.categories.find((category) => category.id === slug);
}

export function getPlatformBySlug(slug) {
  return siteConfig.platforms.find((platform) => platform.id === slug);
}

export function getGamesByPlatform(platformId) {
  return getAllGames().filter((game) => game.platforms?.includes(platformId));
}

export function getAllTags() {
  const tagSet = new Set();
  getAllGames().forEach((game) => (game.tags || []).forEach((tag) => tagSet.add(tag)));
  return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
}

export function getGamesByTag(tag) {
  return getAllGames().filter((game) => game.tags?.includes(tag));
}

export function getRelatedGames(game, limit = 4) {
  if (!game) return [];
  const sourceTags = new Set(game.tags || []);
  return getAllGames()
    .filter((item) => item.id !== game.id)
    .map((item) => ({
      item,
      score:
        (item.category === game.category ? 5 : 0) +
        (item.platforms || []).filter((platform) => game.platforms?.includes(platform)).length * 2 +
        (item.tags || []).filter((tag) => sourceTags.has(tag)).length
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);
}

export function searchGames(query = '') {
  const q = query.trim().toLowerCase();
  if (!q) return getAllGames();
  return getAllGames().filter((game) => {
    const haystack = [
      game.name,
      game.genre,
      game.category,
      game.playStyle,
      game.description,
      game.longDescription,
      ...(game.tags || [])
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function getGameTranslation(game, locale = siteConfig.defaultLocale) {
  if (!game) return null;
  const translated = game.translations?.[locale] || {};
  return {
    ...game,
    name: translated.name || game.name,
    description: translated.description || game.description
  };
}

export function getLocalizedPath(path, locale = siteConfig.defaultLocale) {
  if (locale === siteConfig.defaultLocale) return path;
  return `/${locale}${path === '/' ? '' : path}`;
}

export function isValidLocale(locale) {
  return siteConfig.locales.includes(locale);
}
