import cmsCategoriesData from './gamemonetizeCmsCategories.json';
import cmsGamesData from './gamemonetizeCmsGames.json';

export type GameMonetizeCmsCategory = {
  id: number;
  slug: string;
  name: string;
  image: string;
  description: string;
  showHome: boolean;
  totalGames: number;
};

export type GameMonetizeCmsGame = {
  id: string;
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  provider: 'gamemonetize';
  image: string;
  playUrl: string;
  width: number;
  height: number;
  description: string;
  instructions: string;
  rating: number;
  plays: number;
  featured: boolean;
  mobile: boolean;
  dateAdded: string;
  videoUrl: string;
};

export const gamemonetizeCmsCategories = cmsCategoriesData as GameMonetizeCmsCategory[];
export const gamemonetizeCmsGames = cmsGamesData as GameMonetizeCmsGame[];

export function getGameMonetizeCmsStats() {
  return {
    games: gamemonetizeCmsGames.length,
    categories: gamemonetizeCmsCategories.length,
    provider: 'GameMonetize CMS'
  };
}

export function getGameMonetizeCmsCategories() {
  return gamemonetizeCmsCategories;
}

export function getGameMonetizeCmsGames({
  category,
  query,
  page = 1,
  pageSize = 48
}: {
  category?: string;
  query?: string;
  page?: number;
  pageSize?: number;
} = {}) {
  const cleanCategory = String(category || '').toLowerCase();
  const cleanQuery = String(query || '').trim().toLowerCase();
  const safePage = Math.max(1, Number(page) || 1);
  const safePageSize = Math.max(12, Math.min(96, Number(pageSize) || 48));
  const filtered = gamemonetizeCmsGames.filter((game) => {
    const matchesCategory = !cleanCategory || game.categorySlug === cleanCategory;
    const matchesQuery =
      !cleanQuery ||
      game.title.toLowerCase().includes(cleanQuery) ||
      game.category.toLowerCase().includes(cleanQuery) ||
      game.description.toLowerCase().includes(cleanQuery);
    return matchesCategory && matchesQuery;
  });
  const start = (safePage - 1) * safePageSize;
  return {
    items: filtered.slice(start, start + safePageSize),
    total: filtered.length,
    page: safePage,
    pageSize: safePageSize,
    pageCount: Math.max(1, Math.ceil(filtered.length / safePageSize))
  };
}

export function getGameMonetizeCmsGame(slug: string | string[] | undefined) {
  const clean = Array.isArray(slug) ? slug[0] : slug;
  return gamemonetizeCmsGames.find((game) => game.slug === String(clean || '').toLowerCase()) || null;
}

export function getFeaturedGameMonetizeCmsGames(limit = 24) {
  return gamemonetizeCmsGames
    .filter((game) => game.featured || game.mobile || game.image)
    .slice(0, limit);
}

export function getGameMonetizeCmsSitemapGames(limit = gamemonetizeCmsGames.length) {
  const safeLimit = Math.max(0, Math.min(gamemonetizeCmsGames.length, Number(limit) || 0));
  return gamemonetizeCmsGames.slice(0, safeLimit);
}
