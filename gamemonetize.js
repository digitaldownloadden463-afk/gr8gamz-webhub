export const gameMonetizeConfig = {
  feedBase: 'https://rss.gamemonetize.com/rssfeed.php',
  defaultAmount: 12,
  maxAmount: 100,
  defaultType: 'html5',
  defaultFormat: 'json',
  defaultCategory: 'All',
  defaultCompany: 'All',
  defaultPopularity: 'newest',
  partnerName: 'GameMonetize',
  partnerGamesPath: '/gamemonetize-games',
  playPath: '/gamemonetize-games/play',
  disclosurePath: '/partner-disclosure'
};

export const gameMonetizeCategories = [
  { id: 'All', label: 'All' },
  { id: 'Action', label: 'Action' },
  { id: 'Adventure', label: 'Adventure' },
  { id: 'Arcade', label: 'Arcade' },
  { id: 'Hypercasual', label: 'Hypercasual' },
  { id: 'Puzzles', label: 'Puzzles' },
  { id: 'Racing', label: 'Racing' },
  { id: 'Shooting', label: 'Shooting' },
  { id: 'Sports', label: 'Sports' },
  { id: 'Soccer', label: 'Soccer' },
  { id: 'Stickman', label: 'Stickman' }
];

export const gameMonetizePopularity = [
  { id: 'newest', label: 'Newest' },
  { id: 'mostplayed', label: 'Most Played' },
  { id: 'hotgames', label: 'Hot Games' },
  { id: 'bestgames', label: 'Best Games' },
  { id: 'exclusive', label: 'Exclusive' },
  { id: 'editorpicks', label: 'Editor Picks' },
  { id: 'nobranding', label: 'No Branding' }
];

export function normaliseGameMonetizeGame(game = {}) {
  return {
    id: String(game.id || game.title || ''),
    title: game.title || 'GameMonetize Game',
    description: game.description || 'Play this partner HTML5 game through GR8 GAMZ.',
    instructions: game.instructions || '',
    category: game.category || 'Partner Game',
    tags: game.tags || '',
    thumb: game.thumb || '',
    url: game.url || '',
    width: Number.parseInt(game.width || '800', 10) || 800,
    height: Number.parseInt(game.height || '600', 10) || 600
  };
}

export function isSafeGameMonetizeUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && (
      parsed.hostname === 'gamemonetize.com' ||
      parsed.hostname.endsWith('.gamemonetize.com') ||
      parsed.hostname === 'gamemonetize.co' ||
      parsed.hostname.endsWith('.gamemonetize.co')
    );
  } catch {
    return false;
  }
}
