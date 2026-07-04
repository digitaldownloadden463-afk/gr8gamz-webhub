export type Gr8Game = {
  id: string;
  slug?: string;
  name: string;
  title?: string;
  genre?: string;
  description?: string;
  iframeUrl?: string;
  url?: string;
  thumbnail?: string;
  emoji?: string;
};

export const games: Gr8Game[] = [
  {
    id: 'slope',
    slug: 'slope',
    name: 'Retro Snake Run',
    title: 'Retro Snake Run',
    genre: 'Arcade',
    description: 'A fast arcade run built for instant browser play.',
    emoji: '🐍'
  },
  {
    id: 'tetris',
    slug: 'tetris',
    name: 'Matrix Blocks',
    title: 'Matrix Blocks',
    genre: 'Puzzle',
    description: 'Stack blocks, clear lines and chase a better score.',
    emoji: '🧩'
  },
  {
    id: 'tiny-fishing',
    slug: 'tiny-fishing',
    name: 'Quantum Click Fishing',
    title: 'Quantum Click Fishing',
    genre: 'Casual',
    description: 'A quick clicker-style fishing loop for short sessions.',
    emoji: '🎣'
  },
  {
    id: 'neon-snake-rush',
    slug: 'neon-snake-rush',
    name: 'Neon Snake Rush',
    title: 'Neon Snake Rush',
    genre: 'Arcade',
    description: 'A neon arcade snake challenge for quick replay sessions.',
    emoji: '⚡'
  },
  {
    id: 'stack-tower-rush',
    slug: 'stack-tower-rush',
    name: 'Stack Tower Rush',
    title: 'Stack Tower Rush',
    genre: 'Skill',
    description: 'Stack carefully, keep the tower steady and push for height.',
    emoji: '🏗️'
  },
  {
    id: 'turbo-drift-grid',
    slug: 'turbo-drift-grid',
    name: 'Turbo Drift Grid',
    title: 'Turbo Drift Grid',
    genre: 'Racing',
    description: 'A fast racing-style game page for GR8 GAMZ players.',
    emoji: '🏎️'
  }
];

export function normaliseSlug(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  return String(raw || '').replace(/-unblocked$/i, '').trim().toLowerCase();
}

export function getAllGames() {
  return games;
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

export const featuredGames = games;
export default games;
