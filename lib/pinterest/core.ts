import boardsData from '@/src/data/pinterest/boards.json';
import destinationsData from '@/src/data/pinterest/destinations.json';
import rightsData from '@/src/data/pinterest/rights-registry.json';
import settingsData from '@/src/data/pinterest/settings.json';
import scheduleData from '@/src/data/pinterest/schedule.json';
import { canonical } from '@/lib/features';
import { getAllGames, type Gr8Game } from '@/lib/games';

export type PinterestEligibilityState =
  | 'gr8_original_owned'
  | 'partner_distribution_authorised'
  | 'artwork_only_authorised'
  | 'gameplay_capture_authorised'
  | 'category_only'
  | 'excluded'
  | 'unknown';

export type PinterestBoard = (typeof boardsData.boards)[number];

export type PinterestDestination = {
  id: string;
  kind: 'collection' | 'gr8_original';
  path: string;
  title: string;
  description: string;
  boardId: string;
  campaign: string;
  hooks: string[];
  artworkPath: string;
  artworkAlt: string;
  eligibilityState: PinterestEligibilityState;
  rightsSource: string;
  allowedAssetTypes: string[];
  category: string;
  mobileFriendly: boolean;
  score: number;
  scoreEvidence: Record<string, string | number>;
};

export type PinterestCreative = {
  id: string;
  destinationId: string;
  destinationPath: string;
  destinationTitle: string;
  boardId: string;
  campaign: string;
  conceptIndex: number;
  family: 'direct-game-challenge' | 'quick-browser-game' | 'category-discovery' | 'play-when-bored';
  hook: string;
  title: string;
  description: string;
  artworkPath: string;
  artworkAlt: string;
  score: number;
};

export type ScheduledPinterestCreative = PinterestCreative & { publishAt: string };

const boardIds = new Set(boardsData.boards.map((board) => board.id));
const originalDestinationPattern = new RegExp(
  rightsData.originalGameRule.allowedDestinationPattern
);
const collectionDestinationPattern = new RegExp(
  rightsData.collectionRule.allowedDestinationPattern
);
const excludedGameSlugs = new Set<string>(rightsData.excludedGameSlugs as string[]);
const excludedDestinationPaths = new Set<string>(rightsData.excludedDestinationPaths as string[]);

const searchOpportunityByCategory: Record<string, number> = {
  racing: 20,
  puzzle: 18,
  strategy: 16,
  arcade: 15,
  action: 14,
  shooter: 14,
  sports: 12,
  skill: 12,
  adventure: 11,
};

function cleanPath(value: string) {
  const [pathname] = value.split(/[?#]/, 1);
  if (!pathname) return '/';
  return pathname === '/' ? '/' : `/${pathname.replace(/^\/+|\/+$/g, '')}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function stableBucket(value: string, modulo: number) {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % modulo;
}

function rightsCurrent(expiry: string | null) {
  if (!expiry) return true;
  const timestamp = Date.parse(expiry);
  return Number.isFinite(timestamp) && timestamp > Date.now();
}

function originalBoard(game: Gr8Game) {
  const category = String(game.category || game.genre || '').toLowerCase();
  if (category === 'racing') return 'car-games';
  if (['puzzle', 'strategy'].includes(category)) return 'puzzle-games';
  if (game.platforms?.includes('mobile') && stableBucket(game.slug || game.id, 3) === 0)
    return 'mobile-games';
  return 'gr8-originals';
}

function originalHooks(game: Gr8Game) {
  const control = String(game.shortControls || game.playStyle || '').trim();
  return [
    `Can You Master ${game.name}?`,
    control ? `${control} in ${game.name}` : `Try This ${game.name} Challenge`,
  ];
}

function originalScore(game: Gr8Game) {
  const category = String(game.category || game.genre || '').toLowerCase();
  const searchOpportunity = searchOpportunityByCategory[category] ?? 8;
  const visualSuitability = game.thumbnail?.startsWith('/') ? 15 : 0;
  const mobileUsability = game.platforms?.includes('mobile') ? 10 : 0;
  const playability =
    game.status === 'Live' && String(game.iframeUrl || '').startsWith('/') ? 10 : 0;
  const replayability =
    (game.engagementHooks?.length || 0) > 0 ||
    (game.tags || []).some((tag) => /quick-play|high-score|one-tap/i.test(tag))
      ? 10
      : 5;
  const destinationQuality = game.description && game.controls?.length ? 10 : 5;
  const freshness = /^2026-/.test(String(game.dateAdded || '')) ? 5 : 2;
  const engagement = 0;
  return {
    score:
      searchOpportunity +
      engagement +
      visualSuitability +
      mobileUsability +
      playability +
      replayability +
      destinationQuality +
      freshness,
    evidence: {
      search_category_score: searchOpportunity,
      engagement_score: engagement,
      engagement_evidence: 'missing-no-first-party-game-engagement-export',
      visual_score: visualSuitability,
      mobile_score: mobileUsability,
      playability_score: playability,
      replayability_score: replayability,
      destination_quality_score: destinationQuality,
      freshness_score: freshness,
    },
  };
}

function collectionScore(path: string) {
  const searchOpportunity = path === '/' || path === '/games' ? 20 : 18;
  return {
    score: searchOpportunity + 0 + 15 + 10 + 10 + 7 + 10 + 5,
    evidence: {
      search_category_score: searchOpportunity,
      engagement_score: 0,
      engagement_evidence: 'missing-no-page-level-engagement-export',
      visual_score: 15,
      mobile_score: 10,
      playability_score: 10,
      replayability_score: 7,
      destination_quality_score: 10,
      freshness_score: 5,
    },
  };
}

function eligibleOriginal(game: Gr8Game) {
  const slug = game.slug || game.id;
  const path = `/arcade/${slug}`;
  return Boolean(
    slug &&
    game.status === 'Live' &&
    game.platforms?.includes('originals') &&
    game.thumbnail?.startsWith('/') &&
    originalDestinationPattern.test(path) &&
    !excludedGameSlugs.has(slug) &&
    !excludedDestinationPaths.has(path) &&
    rightsCurrent(rightsData.originalGameRule.expiry)
  );
}

export function getPinterestBoards() {
  return boardsData.boards;
}

export function getPinterestDestinations(): PinterestDestination[] {
  const collections: PinterestDestination[] = destinationsData.collections
    .filter((record) => boardIds.has(record.boardId))
    .filter((record) => collectionDestinationPattern.test(cleanPath(record.path)))
    .filter((record) => !excludedDestinationPaths.has(cleanPath(record.path)))
    .filter(() => rightsCurrent(rightsData.collectionRule.expiry))
    .map((record) => {
      const scored = collectionScore(cleanPath(record.path));
      return {
        ...record,
        path: cleanPath(record.path),
        kind: 'collection',
        artworkPath: '/brand/gr8-gamz-logo-mark.png',
        artworkAlt: `GR8 GAMZ artwork for ${record.title}`,
        eligibilityState: rightsData.collectionRule.state as PinterestEligibilityState,
        rightsSource: rightsData.collectionRule.source,
        allowedAssetTypes: [...rightsData.collectionRule.allowedAssetTypes],
        category: record.campaign,
        mobileFriendly: true,
        score: scored.score,
        scoreEvidence: scored.evidence,
      };
    });

  const originals: PinterestDestination[] = getAllGames()
    .filter(eligibleOriginal)
    .map((game) => {
      const slug = game.slug || game.id;
      const scored = originalScore(game);
      return {
        id: `original-${slug}`,
        kind: 'gr8_original',
        path: `/arcade/${slug}`,
        title: game.name,
        description: String(game.description || `Play ${game.name}, a GR8 Original browser game.`),
        boardId: originalBoard(game),
        campaign: `gr8-original-${slug}`,
        hooks: originalHooks(game),
        artworkPath: `/pinterest/originals/${slug}.jpg`,
        artworkAlt: String(game.thumbnailAlt || `${game.name} GR8 Original game artwork`),
        eligibilityState: rightsData.originalGameRule.state as PinterestEligibilityState,
        rightsSource: rightsData.originalGameRule.source,
        allowedAssetTypes: [...rightsData.originalGameRule.allowedAssetTypes],
        category: String(game.category || game.genre || 'arcade').toLowerCase(),
        mobileFriendly: Boolean(game.platforms?.includes('mobile')),
        score: scored.score,
        scoreEvidence: scored.evidence,
      };
    });

  return [...collections, ...originals].sort(
    (a, b) => b.score - a.score || a.id.localeCompare(b.id)
  );
}

const collectionFamilies: PinterestCreative['family'][] = [
  'category-discovery',
  'play-when-bored',
  'quick-browser-game',
  'category-discovery',
];

export function getPinterestCreatives(): PinterestCreative[] {
  const excludedCreativeIds = new Set<string>(settingsData.excludedCreativeIds as string[]);
  return getPinterestDestinations()
    .flatMap((destination) =>
      destination.hooks.map((hook, index) => {
        const family: PinterestCreative['family'] =
          destination.kind === 'gr8_original'
            ? index === 0
              ? 'direct-game-challenge'
              : 'quick-browser-game'
            : collectionFamilies[index] || 'category-discovery';
        return {
          id: `pin-${slugify(destination.boardId)}-${slugify(destination.id)}-${index + 1}`,
          destinationId: destination.id,
          destinationPath: destination.path,
          destinationTitle: destination.title,
          boardId: destination.boardId,
          campaign: destination.campaign,
          conceptIndex: index,
          family,
          hook,
          title: hook,
          description: `${destination.description} Open GR8 GAMZ to choose a game and play in your browser.`,
          artworkPath: destination.artworkPath,
          artworkAlt: destination.artworkAlt,
          score: destination.score,
        };
      })
    )
    .filter((creative) => !excludedCreativeIds.has(creative.id));
}

export function getPinterestCreative(creativeId: string) {
  return getPinterestCreatives().find((creative) => creative.id === creativeId) || null;
}

function roundRobinCreatives() {
  const boardOrder = boardsData.boards.map((board) => board.id);
  const byBoard = new Map<string, PinterestCreative[]>();
  for (const boardId of boardOrder) {
    const items = getPinterestCreatives()
      .filter((creative) => creative.boardId === boardId)
      .sort(
        (a, b) =>
          a.conceptIndex - b.conceptIndex ||
          b.score - a.score ||
          a.destinationId.localeCompare(b.destinationId)
      );
    byBoard.set(boardId, items);
  }
  const generatedOrder: PinterestCreative[] = [];
  let remaining = true;
  while (remaining) {
    remaining = false;
    for (const boardId of boardOrder) {
      const items = byBoard.get(boardId) || [];
      const next = items.shift();
      if (!next) continue;
      generatedOrder.push(next);
      remaining = true;
    }
  }
  const byId = new Map(generatedOrder.map((creative) => [creative.id, creative]));
  const priority = (settingsData.priorityCreativeIds as string[])
    .map((creativeId) => byId.get(creativeId))
    .filter((creative): creative is PinterestCreative => Boolean(creative));
  const fixed = scheduleData.creativeIds
    .map((creativeId) => byId.get(creativeId))
    .filter((creative): creative is PinterestCreative => Boolean(creative));
  const used = new Set([...priority, ...fixed].map((creative) => creative.id));
  const appended = generatedOrder.filter((creative) => !used.has(creative.id));
  return [
    ...priority,
    ...fixed.filter((creative) => !priority.some((item) => item.id === creative.id)),
    ...appended,
  ];
}

function parseScheduleStart(value: string | undefined) {
  if (!value || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value)) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp) : null;
}

function parseScheduleEnd(value: string | undefined) {
  return parseScheduleStart(value);
}

export function getPinterestPublishingState(env: Record<string, string | undefined> = process.env) {
  const explicitlyEnabled = env.PINTEREST_RSS_ENABLED === 'true';
  const emergencyPaused = env.PINTEREST_EMERGENCY_PAUSE === 'true';
  const start = parseScheduleStart(env.PINTEREST_SCHEDULE_START_DATE);
  const end = parseScheduleEnd(env.PINTEREST_SCHEDULE_END_DATE);
  const paused = !explicitlyEnabled || emergencyPaused || !start || Boolean(end && end <= start);
  const reason = !explicitlyEnabled
    ? 'publishing-disabled'
    : emergencyPaused
      ? 'emergency-pause'
      : !start
        ? 'missing-or-invalid-start-date'
        : end && end <= start
          ? 'invalid-end-date'
          : 'active';
  return { paused, reason, start, end };
}

export function getPinterestSchedule(startDate: Date): ScheduledPinterestCreative[] {
  const items = roundRobinCreatives();
  return items.map((creative, index) => {
    const dayIndex = Math.floor(index / settingsData.dailyRate);
    const slotIndex = index % settingsData.dailyRate;
    const [hours, minutes] = settingsData.scheduleTimesUtc[slotIndex].split(':').map(Number);
    const publishAt = new Date(
      Date.UTC(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        startDate.getUTCDate() + dayIndex,
        hours,
        minutes,
        0
      )
    );
    return { ...creative, publishAt: publishAt.toISOString() };
  });
}

export function pinterestDestinationUrl(creative: PinterestCreative) {
  const url = new URL(canonical(creative.destinationPath));
  url.searchParams.set('utm_source', 'pinterest');
  url.searchParams.set('utm_medium', 'organic');
  url.searchParams.set('utm_campaign', creative.campaign);
  url.searchParams.set('utm_content', creative.id);
  return url.toString();
}

export function pinterestCreativeUrl(creativeId: string) {
  return canonical(`/pinterest/assets/${creativeId}`);
}

function xmlEscape(value: string) {
  return value.replace(
    /[<>&'\"]/g,
    (character) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        "'": '&apos;',
        '"': '&quot;',
      })[character] || character
  );
}

function boardPaused(boardId: string, env: Record<string, string | undefined>) {
  const key = `PINTEREST_PAUSE_BOARD_${boardId.toUpperCase().replace(/-/g, '_')}`;
  return env[key] === 'true';
}

export function buildPinterestRss(
  boardId: string,
  options: {
    now?: Date;
    env?: Record<string, string | undefined>;
  } = {}
) {
  const board = boardsData.boards.find((candidate) => candidate.id === boardId);
  if (!board) return null;
  const now = options.now || new Date();
  const env = options.env || process.env;
  const state = getPinterestPublishingState(env);
  const paused = state.paused || boardPaused(boardId, env);
  const schedule = state.start ? getPinterestSchedule(state.start) : [];
  const items = paused
    ? []
    : schedule
        .filter((item) => item.boardId === boardId && Date.parse(item.publishAt) <= now.getTime())
        .filter((item) => !state.end || Date.parse(item.publishAt) <= state.end.getTime())
        .slice(-settingsData.feedItemLimit);
  const rssItems = items
    .map((item) => {
      const destination = pinterestDestinationUrl(item);
      const image = pinterestCreativeUrl(item.id);
      return `<item>
      <guid isPermaLink="false">${xmlEscape(item.id)}</guid>
      <title>${xmlEscape(item.title)}</title>
      <description>${xmlEscape(item.description)}</description>
      <link>${xmlEscape(destination)}</link>
      <pubDate>${new Date(item.publishAt).toUTCString()}</pubDate>
      <category>${xmlEscape(board.name)}</category>
      <enclosure url="${xmlEscape(image)}" length="0" type="image/png" />
      <media:content url="${xmlEscape(image)}" type="image/png" medium="image" width="1000" height="1500" />
      <media:description>${xmlEscape(item.artworkAlt)}</media:description>
    </item>`;
    })
    .join('\n');
  const status = paused ? (state.reason === 'active' ? 'board-pause' : state.reason) : 'active';
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${xmlEscape(`GR8 GAMZ - ${board.name}`)}</title>
    <link>${xmlEscape(canonical('/'))}</link>
    <description>${xmlEscape(board.description)}</description>
    <language>en-gb</language>
    <generator>GR8 Pinterest Distribution Engine v1</generator>
    <docs>https://www.rssboard.org/rss-specification</docs>
    <ttl>60</ttl>
    <gr8:status xmlns:gr8="https://www.gr8gamz.com/pinterest/ns">${status}</gr8:status>
    ${rssItems}
  </channel>
</rss>`;
}

export function getPinterestRightsAudit(partnerGameCount = 33231) {
  const destinations = getPinterestDestinations();
  const originals = destinations.filter(
    (destination) => destination.kind === 'gr8_original'
  ).length;
  const collections = destinations.filter(
    (destination) => destination.kind === 'collection'
  ).length;
  return {
    eligibleDestinations: destinations.length,
    eligibleOriginalGames: originals,
    eligibleCollections: collections,
    excludedOrUnknownPartnerGames: partnerGameCount,
    excludedOriginalGames: getAllGames().length - originals,
    rightsReviewedAt: rightsData.reviewedAt,
    activationConfirmationRequired: true,
  };
}

export const pinterestSettings = settingsData;
export const pinterestRightsRegistry = rightsData;
