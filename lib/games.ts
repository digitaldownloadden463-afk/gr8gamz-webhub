export type Gr8Category = {
  [key: string]: any;
  id: string;
  slug: string;
  name: string;
  title?: string;
  emoji?: string;
  description?: string;
};

export type Category = Gr8Category;

export type Gr8Game = {
  [key: string]: any;
  id: string;
  slug: string;
  name: string;
  title?: string;
  genre?: string;
  category?: string;
  categorySlug?: string;
  description?: string;
  iframeUrl?: string;
  embedUrl?: string;
  url?: string;
  href?: string;
  thumbnail?: string;
  image?: string;
  emoji?: string;
  featured?: boolean;
  isFeatured?: boolean;
  plays?: number;
  rating?: number;
  difficulty?: string;
};

export type Game = Gr8Game;

export const categoryObjects: Gr8Category[] = [
  { id: 'arcade', slug: 'arcade', name: 'Arcade', title: 'Arcade Games', emoji: '🕹️', description: 'Fast browser games built for instant play.' },
  { id: 'puzzle', slug: 'puzzle', name: 'Puzzle', title: 'Puzzle Games', emoji: '🧩', description: 'Quick thinking, matching and block games.' },
  { id: 'racing', slug: 'racing', name: 'Racing', title: 'Racing Games', emoji: '🏎️', description: 'Speed, drift and reflex games for mobile and desktop.' },
  { id: 'skill', slug: 'skill', name: 'Skill', title: 'Skill Games', emoji: '🎯', description: 'Tap, time and precision challenges.' },
  { id: 'casual', slug: 'casual', name: 'Casual', title: 'Casual Games', emoji: '⚡', description: 'Easy games for short repeat sessions.' }
];

// Keep this as strings because the live app/page.tsx maps these directly into <span key={category}>.
export const categories: string[] = categoryObjects.map((category) => category.name);

export const games: Gr8Game[] = [
  { id: 'neon-snake-rush', slug: 'neon-snake-rush', name: 'Neon Snake Rush', title: 'Neon Snake Rush', genre: 'Arcade', category: 'Arcade', categorySlug: 'arcade', description: 'A neon arcade snake challenge for quick replay sessions.', emoji: '⚡', featured: true, isFeatured: true, plays: 1240, rating: 4.8, difficulty: 'Easy', href: '/arcade/neon-snake-rush' },
  { id: 'stack-tower-rush', slug: 'stack-tower-rush', name: 'Stack Tower Rush', title: 'Stack Tower Rush', genre: 'Skill', category: 'Skill', categorySlug: 'skill', description: 'Stack carefully, keep the tower steady and push for height.', emoji: '🏗️', featured: true, isFeatured: true, plays: 990, rating: 4.7, difficulty: 'Medium', href: '/arcade/stack-tower-rush' },
  { id: 'turbo-drift-grid', slug: 'turbo-drift-grid', name: 'Turbo Drift Grid', title: 'Turbo Drift Grid', genre: 'Racing', category: 'Racing', categorySlug: 'racing', description: 'A fast racing-style game page for GR8 GAMZ players.', emoji: '🏎️', featured: true, isFeatured: true, plays: 875, rating: 4.7, difficulty: 'Medium', href: '/arcade/turbo-drift-grid' },
  { id: 'retro-snake-run', slug: 'retro-snake-run', name: 'Retro Snake Run', title: 'Retro Snake Run', genre: 'Arcade', category: 'Arcade', categorySlug: 'arcade', description: 'A fast arcade run built for instant browser play.', emoji: '🐍', featured: true, isFeatured: true, plays: 820, rating: 4.6, difficulty: 'Easy', href: '/arcade/retro-snake-run' },
  { id: 'matrix-blocks', slug: 'matrix-blocks', name: 'Matrix Blocks', title: 'Matrix Blocks', genre: 'Puzzle', category: 'Puzzle', categorySlug: 'puzzle', description: 'Stack blocks, clear lines and chase a better score.', emoji: '🧩', featured: false, isFeatured: false, plays: 770, rating: 4.5, difficulty: 'Medium', href: '/arcade/matrix-blocks' },
  { id: 'quantum-click-fishing', slug: 'quantum-click-fishing', name: 'Quantum Click Fishing', title: 'Quantum Click Fishing', genre: 'Casual', category: 'Casual', categorySlug: 'casual', description: 'A quick clicker-style fishing loop for short sessions.', emoji: '🎣', featured: false, isFeatured: false, plays: 650, rating: 4.4, difficulty: 'Easy', href: '/arcade/quantum-click-fishing' }
];

export function normaliseSlug(value: string | string[] | undefined | null) {
  const raw = Array.isArray(value) ? value[0] : value;
  return String(raw || '').replace(/-unblocked$/i, '').trim().toLowerCase();
}

export function getAllGames(): Gr8Game[] {
  return games;
}

export function getFeaturedGames(limit?: number): Gr8Game[] {
  const featured = games.filter((game) => Boolean(game.featured || game.isFeatured));
  return typeof limit === 'number' ? featured.slice(0, limit) : featured;
}

export function getTopGames(limit?: number): Gr8Game[] {
  const ordered = [...games].sort((a, b) => Number(Boolean(b.isFeatured || b.featured)) - Number(Boolean(a.isFeatured || a.featured)) || Number(b.plays || 0) - Number(a.plays || 0));
  return typeof limit === 'number' ? ordered.slice(0, limit) : ordered;
}

export function getGamesByCategory(category: string | string[] | undefined): Gr8Game[] {
  const clean = normaliseSlug(category);
  return games.filter((game) => game.categorySlug === clean || String(game.category || '').toLowerCase() === clean || String(game.genre || '').toLowerCase() === clean);
}

export function getCategoryBySlug(slug: string | string[] | undefined): Gr8Category | null {
  const clean = normaliseSlug(slug);
  return categoryObjects.find((category) => category.slug === clean || category.id === clean || category.name.toLowerCase() === clean) || null;
}

export function getGameBySlug(slug: string | string[] | undefined): Gr8Game | null {
  const clean = normaliseSlug(slug);
  return games.find((game) => game.slug === clean || game.id === clean) || null;
}

export function getGameById(id: string | string[] | undefined): Gr8Game | null {
  return getGameBySlug(id);
}

export function findGameBySlug(slug: string | string[] | undefined): Gr8Game | null {
  return getGameBySlug(slug);
}

export const featuredGames = getFeaturedGames();
export const topGames = getTopGames();
export default games;
