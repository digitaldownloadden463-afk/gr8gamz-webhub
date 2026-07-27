import cmsCategoriesData from './gamemonetizeCmsCategories.json';
import chunk001 from './gamemonetizeCmsGames/chunk-001.json';
import chunk002 from './gamemonetizeCmsGames/chunk-002.json';
import chunk003 from './gamemonetizeCmsGames/chunk-003.json';
import chunk004 from './gamemonetizeCmsGames/chunk-004.json';
import chunk005 from './gamemonetizeCmsGames/chunk-005.json';
import chunk006 from './gamemonetizeCmsGames/chunk-006.json';
import chunk007 from './gamemonetizeCmsGames/chunk-007.json';
import chunk008 from './gamemonetizeCmsGames/chunk-008.json';
import chunk009 from './gamemonetizeCmsGames/chunk-009.json';
import chunk010 from './gamemonetizeCmsGames/chunk-010.json';
import chunk011 from './gamemonetizeCmsGames/chunk-011.json';
import chunk012 from './gamemonetizeCmsGames/chunk-012.json';
import chunk013 from './gamemonetizeCmsGames/chunk-013.json';
import chunk014 from './gamemonetizeCmsGames/chunk-014.json';
import chunk015 from './gamemonetizeCmsGames/chunk-015.json';
import chunk016 from './gamemonetizeCmsGames/chunk-016.json';
import chunk017 from './gamemonetizeCmsGames/chunk-017.json';
import chunk018 from './gamemonetizeCmsGames/chunk-018.json';
import chunk019 from './gamemonetizeCmsGames/chunk-019.json';
import chunk020 from './gamemonetizeCmsGames/chunk-020.json';
import chunk021 from './gamemonetizeCmsGames/chunk-021.json';
import chunk022 from './gamemonetizeCmsGames/chunk-022.json';
import chunk023 from './gamemonetizeCmsGames/chunk-023.json';
import chunk024 from './gamemonetizeCmsGames/chunk-024.json';
import chunk025 from './gamemonetizeCmsGames/chunk-025.json';
import chunk026 from './gamemonetizeCmsGames/chunk-026.json';
import chunk027 from './gamemonetizeCmsGames/chunk-027.json';
import chunk028 from './gamemonetizeCmsGames/chunk-028.json';
import chunk029 from './gamemonetizeCmsGames/chunk-029.json';
import chunk030 from './gamemonetizeCmsGames/chunk-030.json';
import chunk031 from './gamemonetizeCmsGames/chunk-031.json';
import chunk032 from './gamemonetizeCmsGames/chunk-032.json';
import chunk033 from './gamemonetizeCmsGames/chunk-033.json';
import chunk034 from './gamemonetizeCmsGames/chunk-034.json';
import chunk035 from './gamemonetizeCmsGames/chunk-035.json';
import chunk036 from './gamemonetizeCmsGames/chunk-036.json';
import chunk037 from './gamemonetizeCmsGames/chunk-037.json';
import chunk038 from './gamemonetizeCmsGames/chunk-038.json';
import chunk039 from './gamemonetizeCmsGames/chunk-039.json';
import chunk040 from './gamemonetizeCmsGames/chunk-040.json';
import chunk041 from './gamemonetizeCmsGames/chunk-041.json';
import chunk042 from './gamemonetizeCmsGames/chunk-042.json';
import chunk043 from './gamemonetizeCmsGames/chunk-043.json';
import chunk044 from './gamemonetizeCmsGames/chunk-044.json';
import chunk045 from './gamemonetizeCmsGames/chunk-045.json';
import chunk046 from './gamemonetizeCmsGames/chunk-046.json';
import chunk047 from './gamemonetizeCmsGames/chunk-047.json';
import chunk048 from './gamemonetizeCmsGames/chunk-048.json';
import chunk049 from './gamemonetizeCmsGames/chunk-049.json';
import chunk050 from './gamemonetizeCmsGames/chunk-050.json';
import chunk051 from './gamemonetizeCmsGames/chunk-051.json';
import chunk052 from './gamemonetizeCmsGames/chunk-052.json';
import chunk053 from './gamemonetizeCmsGames/chunk-053.json';

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
export const gamemonetizeCmsGames = [
  chunk001,
  chunk002,
  chunk003,
  chunk004,
  chunk005,
  chunk006,
  chunk007,
  chunk008,
  chunk009,
  chunk010,
  chunk011,
  chunk012,
  chunk013,
  chunk014,
  chunk015,
  chunk016,
  chunk017,
  chunk018,
  chunk019,
  chunk020,
  chunk021,
  chunk022,
  chunk023,
  chunk024,
  chunk025,
  chunk026,
  chunk027,
  chunk028,
  chunk029,
  chunk030,
  chunk031,
  chunk032,
  chunk033,
  chunk034,
  chunk035,
  chunk036,
  chunk037,
  chunk038,
  chunk039,
  chunk040,
  chunk041,
  chunk042,
  chunk043,
  chunk044,
  chunk045,
  chunk046,
  chunk047,
  chunk048,
  chunk049,
  chunk050,
  chunk051,
  chunk052,
  chunk053
].flat() as GameMonetizeCmsGame[];

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

export function getGameMonetizeCmsSitemapGames(limit = 2500) {
  return gamemonetizeCmsGames.slice(0, limit);
}
