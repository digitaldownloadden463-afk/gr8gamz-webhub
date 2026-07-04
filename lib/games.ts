export type Gr8Category = {
  id: string;
  slug: string;
  name: string;
  title: string;
  emoji: string;
  description: string;
};

export type Gr8Game = {
  id: string;
  slug: string;
  name: string;
  title: string;
  genre: string;
  category?: string;
  categorySlug?: string;
  description: string;
  iframeUrl?: string;
  embedUrl?: string;
  url?: string;
  thumbnail?: string;
  emoji: string;
  featured?: boolean;
};

export const categories: Gr8Category[] = [
  { id: 'arcade', slug: 'arcade', name: 'Arcade', title: 'Arcade Games', emoji: '🕹️', description: 'Fast browser games built for instant play.' },
  { id: 'puzzle', slug: 'puzzle', name: 'Puzzle', title: 'Puzzle Games', emoji: '🧩', description: 'Quick thinking, matching and block games.' },
  { id: 'racing', slug: 'racing', name: 'Racing', title: 'Racing Games', emoji: '🏎️', description: 'Speed, drift and reflex games for mobile and desktop.' },
  { id: 'skill', slug: 'skill', name: 'Skill', title: 'Skill Games', emoji: '🎯', description: 'Tap, time and precision challenges.' },
  { id: 'casual', slug: 'casual', name: 'Casual', title: 'Casual Games', emoji: '⚡', description: 'Easy games for short repeat sessions.' }
];

export const games: Gr8Game[] = [
  { id: 'slope', slug: 'slope', name: 'Retro Snake Run', title: 'Retro Snake Run', genre: 'Arcade', category: 'Arcade', categorySlug: 'arcade', description: 'A fast arcade run built for instant browser play.', emoji: '🐍', featured: true },
  { id: 'tetris', slug: 'tetris', name: 'Matrix Blocks', title: 'Matrix Blocks', genre: 'Puzzle', category: 'Puzzle', categorySlug: 'puzzle', description: 'Stack blocks, clear lines and chase a better score.', emoji: '🧩', featured: true },
  { id: 'tiny-fishing', slug: 'tiny-fishing', name: 'Quantum Click Fishing', title: 'Quantum Click Fishing', genre: 'Casual', category: 'Casual', categorySlug: 'casual', description: 'A quick clicker-style fishing loop for short sessions.', emoji: '🎣', featured: true },
  { id: 'neon-snake-rush', slug: 'neon-snake-rush', name: 'Neon Snake Rush', title: 'Neon Snake Rush', genre: 'Arcade', category: 'Arcade', categorySlug: 'arcade', description: 'A neon arcade snake challenge for quick replay sessions.', emoji: '⚡', featured: true },
  { id: 'stack-tower-rush', slug: 'stack-tower-rush', name: 'Stack Tower Rush', title: 'Stack Tower Rush', genre: 'Skill', category: 'Skill', categorySlug: 'skill', description: 'Stack carefully, keep the tower steady and push for height.', emoji: '🏗️', featured: true },
  { id: 'turbo-drift-grid', slug: 'turbo-drift-grid', name: 'Turbo Drift Grid', title: 'Turbo Drift Grid', genre: 'Racing', category: 'Racing', categorySlug: 'racing', description: 'A fast racing-style game page for GR8 GAMZ players.', emoji: '🏎️', featured: true }
];

export function normaliseSlug(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  return String(raw || '').replace(/-unblocked$/i, '').trim().toLowerCase();
}

export function getAllGames() {
  return games;
}

export function getFeaturedGames(limit?: number) {
  const featured = games.filter((game) => game.featured);
  return typeof limit === 'number' ? featured.slice(0, limit) : featured;
}

export function getGamesByCategory(category: string) {
  const clean = normaliseSlug(category);
  return games.filter((game) => game.categorySlug === clean || game.category.toLowerCase() === clean);
}

export function getGameBySlug(slug: string | string[] | undefined) {
  const clean = normaliseSlug(slug);
  return games.find((game) => game.slug === clean || game.id === clean) || null;
}

export function getGameById(id: string | string[] | undefined) {
  return getGameBySlug(id);
}

export function findGameBySlug(slug: string | string[] | undefined) {
  return getGameBySlug(slug);
}

export const featuredGames = getFeaturedGames();
export default games;
