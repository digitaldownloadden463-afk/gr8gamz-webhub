import games from '../data/games.json';
import { siteConfig } from '../data/site';

export function getAllGames() {
  return games;
}

export function getFeaturedGames(limit = 6) {
  return games.slice(0, limit);
}

export function getGameBySlug(slug) {
  return games.find((game) => game.id === slug);
}

export function getGamesByCategory(categoryId) {
  return games.filter((game) => game.category === categoryId);
}

export function getCategoryBySlug(slug) {
  return siteConfig.categories.find((category) => category.id === slug);
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
