import { getAllGames } from '@/lib/games';
import { canonical } from '@/lib/features';
import { getPartnerGameProfiles } from '@/src/data/partnerGameProfiles';

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

const registryDate = '2026-07-27';

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
    lastModified: game.dateAdded || registryDate
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
    indexable: true,
    category: profile.category || 'Arcade',
    tags: [profile.intent, profile.category].filter((tag): tag is string => Boolean(tag)),
    controls: profile.controls || 'Use the controls shown in the game',
    difficulty: profile.difficulty || 'Quick play',
    deviceSupport: profile.deviceFit || 'Phone, tablet and desktop support depends on the game',
    sessionLength: profile.bestFor || 'Quick browser session',
    summary: profile.description,
    artwork: profile.image || '/og/gr8gamz-og.png',
    lastModified: registryDate
  }));

  return uniqueByUrl([...originals, ...select]);
}

export function getIndexableRegistryGames() {
  return getRegistryGames().filter((game) => game.status === 'active' && game.indexable);
}

export function registryJson() {
  return {
    generatedAt: registryDate,
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
