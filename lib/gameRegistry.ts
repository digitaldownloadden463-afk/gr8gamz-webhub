import { getAllGames } from '@/lib/games';
import { canonical } from '@/lib/features';
import { getPartnerGameProfiles, getPartnerIndexQuality } from '@/src/data/partnerGameProfiles';

type PartnerProfile = {
  title: string;
  provider?: string;
  slug: string;
  path: string;
  playPath?: string;
  category?: string;
  intent?: string;
  controls?: string;
  difficulty?: string;
  deviceFit?: string;
  bestFor?: string;
  description: string;
  image?: string;
};

export type RegistryGame = {
  id: string;
  sourceId: string;
  source: 'gr8-originals' | 'gr8-select';
  provider: 'gr8' | 'gamepix' | 'gamemonetize';
  title: string;
  slug: string;
  url: string;
  playUrl: string;
  status: 'active' | 'review' | 'disabled' | 'removed';
  indexable: boolean;
  category: string;
  tags: string[];
  controls: string;
  difficulty: string;
  deviceSupport: string;
  sessionLength: string;
  summary: string;
  artwork: string;
  lastModified: string;
};

let registryCache: RegistryGame[] | null = null;
let playableRegistryCache: RegistryGame[] | null = null;
let indexableRegistryCache: RegistryGame[] | null = null;
let registryBySlugCache: Map<string, RegistryGame> | null = null;

function uniqueByUrl(games: RegistryGame[]) {
  const seen = new Set<string>();
  return games.filter((game) => {
    const key = game.url.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function getRegistryGames(): RegistryGame[] {
  if (registryCache) return registryCache;
  const originals = getAllGames().map((game) => ({
    id: `original:${game.slug || game.id}`,
    sourceId: game.id,
    source: 'gr8-originals' as const,
    provider: 'gr8' as const,
    title: game.name,
    slug: game.slug || game.id,
    url: `/arcade/${game.slug || game.id}`,
    playUrl: `/arcade/${game.slug || game.id}`,
    status: 'active' as const,
    indexable: true,
    category: game.category || game.genre || 'Arcade',
    tags: game.tags || [],
    controls: game.shortControls || game.controls?.[0] || 'Touch, mouse or keyboard depending on the game',
    difficulty: game.difficulty || 'Quick play',
    deviceSupport: game.platforms?.join(', ') || 'Phone, tablet and desktop',
    sessionLength: game.playStyle || 'Short arcade run',
    summary: game.description || game.longDescription || `Play ${game.name} on GR8 GAMZ.`,
    artwork: game.thumbnail || '/og/gr8gamz-og.png',
    lastModified: game.dateAdded || ''
  }));

  const select = (getPartnerGameProfiles() as PartnerProfile[]).map((profile) => ({
    id: `select:${profile.provider}:${profile.slug}`,
    sourceId: String(profile.slug),
    source: 'gr8-select' as const,
    provider: profile.provider === 'gamemonetize' ? 'gamemonetize' as const : 'gamepix' as const,
    title: profile.title,
    slug: profile.slug,
    url: profile.path,
    playUrl: profile.playPath || `${profile.path}/play`,
    status: 'active' as const,
    indexable: getPartnerIndexQuality(profile.slug).state === 'indexable',
    category: profile.category || 'Arcade',
    tags: [profile.intent, profile.category].filter((tag): tag is string => Boolean(tag)),
    controls: profile.controls || 'Use the controls shown in the game',
    difficulty: profile.difficulty || 'Quick play',
    deviceSupport: profile.deviceFit || 'Phone, tablet and desktop support depends on the game',
    sessionLength: profile.bestFor || 'Quick browser session',
    summary: profile.description,
    artwork: profile.image || '/og/gr8gamz-og.png',
    lastModified: ''
  }));

  registryCache = uniqueByUrl([...originals, ...select]);
  return registryCache;
}

export function getIndexableRegistryGames() {
  if (!indexableRegistryCache) indexableRegistryCache = getRegistryGames().filter((game) => game.status === 'active' && game.indexable);
  return indexableRegistryCache;
}

export function getPlayableRegistryGames() {
  if (!playableRegistryCache) playableRegistryCache = getRegistryGames().filter((game) => game.status === 'active');
  return playableRegistryCache;
}

export function getRegistryGamesBySlugs(slugs: string[]) {
  const requested = new Set(slugs);
  return getPlayableRegistryGames().filter((game) => requested.has(game.slug));
}

export function getRegistryGameBySlug(slug: string, source?: RegistryGame['source']) {
  if (!registryBySlugCache) registryBySlugCache = new Map(getPlayableRegistryGames().map((game) => [`${game.source}:${game.slug}`, game]));
  if (source) return registryBySlugCache.get(`${source}:${slug}`);
  return registryBySlugCache.get(`gr8-originals:${slug}`) || registryBySlugCache.get(`gr8-select:${slug}`);
}

export function registryJson() {
  return {
    generatedAt: '',
    site: canonical('/'),
    totals: {
      all: getRegistryGames().length,
      indexable: getIndexableRegistryGames().length
    },
    games: getRegistryGames().map((game) => ({
      ...game,
      canonicalUrl: canonical(game.url)
    }))
  };
}

export function slugifyRegistryValue(value: string) {
  return value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function getRegistryCategories(minimumGames = 4) {
  const counts = new Map<string, { slug: string; name: string; count: number }>();
  for (const game of getPlayableRegistryGames()) {
    const name = game.category || 'Arcade';
    const slug = slugifyRegistryValue(name);
    const current = counts.get(slug) || { slug, name, count: 0 };
    current.count += 1;
    counts.set(slug, current);
  }
  return [...counts.values()].filter((item) => item.count >= minimumGames).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getRegistryGamesByCategory(slug: string) {
  return getPlayableRegistryGames().filter((game) => slugifyRegistryValue(game.category) === slug);
}

export function searchRegistryGames(query: string, page = 1, pageSize = 48) {
  const normalizedQuery = String(query || '').trim().toLowerCase().slice(0, 80);
  const safePageSize = Math.max(12, Math.min(96, Number(pageSize) || 48));
  if (!normalizedQuery) return { games: [], page: 1, pageSize: safePageSize, totalGames: 0, totalPages: 0 };
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);
  const matches = getPlayableRegistryGames()
    .map((game) => {
      const title = game.title.toLowerCase();
      const searchable = `${title} ${game.category} ${game.summary} ${game.tags.join(' ')}`.toLowerCase();
      if (!terms.every((term) => searchable.includes(term))) return null;
      const score = title === normalizedQuery ? 4 : title.startsWith(normalizedQuery) ? 3 : title.includes(normalizedQuery) ? 2 : 1;
      return { game, score };
    })
    .filter((match): match is { game: RegistryGame; score: number } => Boolean(match))
    .sort((left, right) => right.score - left.score || left.game.title.localeCompare(right.game.title));
  const totalGames = matches.length;
  const totalPages = Math.max(1, Math.ceil(totalGames / safePageSize));
  const safePage = Math.max(1, Math.min(totalPages, Number(page) || 1));
  const start = (safePage - 1) * safePageSize;
  return {
    games: matches.slice(start, start + safePageSize).map((match) => match.game),
    page: safePage,
    pageSize: safePageSize,
    totalGames,
    totalPages
  };
}

export const controlHubs = [
  { slug: 'tap', name: 'Tap', pattern: /tap|click|one-tap/i },
  { slug: 'swipe', name: 'Swipe', pattern: /swipe/i },
  { slug: 'drag', name: 'Drag', pattern: /drag|aim/i },
  { slug: 'keyboard', name: 'Keyboard', pattern: /keyboard|arrow|wasd|space/i },
  { slug: 'mouse', name: 'Mouse', pattern: /mouse|click|drag/i }
];

export function getRegistryControlHubs(minimumGames = 4) {
  return controlHubs
    .map((hub) => ({ ...hub, count: getRegistryGamesByControl(hub.slug).length }))
    .filter((hub) => hub.count >= minimumGames);
}

export function getRegistryGamesByControl(slug: string) {
  const hub = controlHubs.find((item) => item.slug === slug);
  if (!hub) return [];
  return getPlayableRegistryGames().filter((game) => hub.pattern.test(`${game.controls} ${game.tags.join(' ')} ${game.sessionLength}`));
}
