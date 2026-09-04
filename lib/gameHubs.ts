import gameHubData from '@/src/data/gameHubs.json';
import generatedPartnerCatalogue from '@/src/data/partnerCatalog.generated.json';
import gamesData from '@/src/data/games.json';
import { getRegistryGamesBySlugs, type RegistryGame } from '@/lib/gameRegistry';
import { matchesHubRule, type HubMatchRecord, type HubRuleId } from '@/lib/gameHubRules';

export type GameHubDefinition = {
  id: HubRuleId;
  slug: string;
  label: string;
  primaryKeyword: string;
  aliases: string[];
  parentCategory: string;
  title: string;
  description: string;
  h1: string;
  introduction: string;
  selectionNote: string;
  playStyles: string[];
  deviceGuidance: string;
  controlsGuidance: string;
  sessionGuidance: string;
  relatedHubIds: HubRuleId[];
  relatedCategorySlugs: string[];
};

type GameHubData = {
  schemaVersion: number;
  reviewedAt: string;
  minimumInventory: number;
  hubs: GameHubDefinition[];
};

const data = gameHubData as GameHubData;
const partnerRecords = generatedPartnerCatalogue.games as HubMatchRecord[];
const originalRecords = (gamesData as Array<Record<string, unknown>>).map((game) => ({
  title: String(game.name || ''),
  slug: String(game.slug || game.id || ''),
  category: String(game.category || game.genre || ''),
  sourceCategory: String(game.category || game.genre || ''),
  description: String(game.description || game.longDescription || ''),
  instructions: Array.isArray(game.controls) ? game.controls.join(' ') : String(game.shortControls || ''),
  tags: Array.isArray(game.tags) ? game.tags.map(String) : []
}));

const definitions = new Map(data.hubs.map((hub) => [hub.slug, hub]));
const definitionsById = new Map(data.hubs.map((hub) => [hub.id, hub]));
const gamesByHub = new Map<string, RegistryGame[]>();
let hubsByGameSlug: Map<string, GameHubDefinition[]> | null = null;

export const gameHubReviewedAt = data.reviewedAt;
export const gameHubMinimumInventory = data.minimumInventory;

export function getGameHubDefinitions() {
  return data.hubs;
}

export function getGameHubDefinition(slug: string) {
  return definitions.get(slug);
}

export function getRelatedGameHubs(hub: GameHubDefinition) {
  return hub.relatedHubIds.map((id) => definitionsById.get(id)).filter((item): item is GameHubDefinition => Boolean(item));
}

export function getGameHubGames(slug: string) {
  const cached = gamesByHub.get(slug);
  if (cached) return cached;
  const hub = getGameHubDefinition(slug);
  if (!hub) return [];
  const slugs = new Set([
    ...partnerRecords.filter((record) => matchesHubRule(hub.id, record)).map((record) => String(record.slug || '')),
    ...originalRecords.filter((record) => matchesHubRule(hub.id, record)).map((record) => String(record.slug || ''))
  ].filter(Boolean));
  const games = getRegistryGamesBySlugs([...slugs]).sort((left, right) => left.title.localeCompare(right.title) || left.url.localeCompare(right.url));
  gamesByHub.set(slug, games);
  return games;
}

export function getActiveGameHubs() {
  return data.hubs.filter((hub) => getGameHubGames(hub.slug).length >= data.minimumInventory);
}

export function getGameHubsForGameSlug(slug: string) {
  if (!hubsByGameSlug) {
    hubsByGameSlug = new Map();
    for (const hub of getActiveGameHubs()) {
      for (const game of getGameHubGames(hub.slug)) {
        const current = hubsByGameSlug.get(game.slug) || [];
        current.push(hub);
        hubsByGameSlug.set(game.slug, current);
      }
    }
  }
  return hubsByGameSlug.get(slug) || [];
}

export function gameHubPath(slug: string, page = 1) {
  return page === 1 ? `/${slug}` : `/${slug}/page/${page}`;
}
