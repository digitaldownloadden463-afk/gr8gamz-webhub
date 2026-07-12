export const gamePixConfig = {
  sid: process.env.GAMEPIX_SID || process.env.NEXT_PUBLIC_GAMEPIX_SID || '8G856',
  feedBase: 'https://feeds.gamepix.com/v2/json',
  defaultPagination: 12,
  maxPagination: 48,
  defaultPage: 1,
  defaultOrder: 'quality',
  partnerName: 'GamePix',
  partnerGamesPath: '/gamepix-games',
  playPath: '/gamepix-games/play',
  disclosurePath: '/partner-disclosure'
};

export const gamePixCategories = [
  { id: 'all', label: 'All' },
  { id: 'action', label: 'Action' },
  { id: 'arcade', label: 'Arcade' },
  { id: 'puzzle', label: 'Puzzle' },
  { id: 'racing', label: 'Racing' },
  { id: 'sports', label: 'Sports' },
  { id: 'shooting', label: 'Shooting' },
  { id: 'strategy', label: 'Strategy' }
];

export function normaliseGamePixGame(game = {}) {
  return {
    id: String(game.id || game.namespace || game.title || ''),
    title: game.title || 'GamePix Game',
    namespace: game.namespace || '',
    description: game.description || 'Play this partner HTML5 game through GR8 GAMZ.',
    category: game.category || 'Partner Game',
    orientation: game.orientation || 'landscape',
    qualityScore: game.quality_score ?? game.qualityScore ?? null,
    width: game.width || 960,
    height: game.height || 540,
    bannerImage: game.banner_image || game.bannerImage || game.image || '',
    image: game.image || game.banner_image || '',
    url: game.url || '',
    datePublished: game.date_published || '',
    dateModified: game.date_modified || ''
  };
}

export function isSafeGamePixUrl(url) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    const isAllowedHost = hostname === 'gamepix.com' || hostname.endsWith('.gamepix.com');
    return parsed.protocol === 'https:' && isAllowedHost;
  } catch {
    return false;
  }
}
