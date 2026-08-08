export const gameMonetizeConfig = {
  feedBase: 'https://gamemonetize.com/feed.php',
  feedFormat: 0,
  feedPageSize: 2000,
  approvedEmbedHosts: ['html5.gamemonetize.co'],
  approvedArtworkHosts: ['img.gamemonetize.com'],
  approvedDomain: 'gr8gamz.com',
  publisherIdentifier: null,
  feedAccountSpecific: false,
  disclosurePath: '/partner-disclosure'
};

export function normaliseGameMonetizeGame(game = {}) {
  return {
    id: String(game.id || ''),
    title: String(game.title || ''),
    description: String(game.description || ''),
    instructions: String(game.instructions || ''),
    category: String(game.category || ''),
    tags: String(game.tags || ''),
    thumb: String(game.thumb || ''),
    url: String(game.url || ''),
    width: Number.parseInt(String(game.width || '800'), 10) || 800,
    height: Number.parseInt(String(game.height || '600'), 10) || 600
  };
}

export function isSafeGameMonetizeUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'html5.gamemonetize.co' && /^\/[a-z0-9]+\/$/i.test(url.pathname) && !url.search && !url.hash;
  } catch {
    return false;
  }
}

export function isSafeGameMonetizeArtworkUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'img.gamemonetize.com' && /^\/[a-z0-9]+\/\d+x\d+\.(?:jpg|jpeg|png|webp)$/i.test(url.pathname);
  } catch {
    return false;
  }
}
