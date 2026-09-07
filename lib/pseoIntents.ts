import generatedIntentData from '@/src/data/pseoIntents.generated.json';
import { getIndexableRegistryGames, type RegistryGame } from '@/lib/gameRegistry';

export type PseoIntentFacets = {
  category?: string;
  sourceCategory?: string;
  tag?: string;
  mechanic?: string;
  control?: string;
  device?: string;
};

export type PseoIntentDefinition = {
  id: string;
  slug: string;
  primaryKeyword: string;
  aliases: string[];
  parentCategory: string;
  kind: string;
  facets: PseoIntentFacets;
  title: string;
  description: string;
  h1: string;
  introduction: string;
  selectionNote: string;
  playStyles: string[];
  deviceGuidance: string;
  controlsGuidance: string;
  sessionGuidance: string;
  topSignals: {
    sourceCategories: Array<{ label: string; count: number }>;
    tags: Array<{ label: string; count: number }>;
    examples: string[];
  };
  relatedSlugs: string[];
  gameIds: string[];
  inventoryCount: number;
  inventoryFingerprint: string;
  priority: number;
  evidenceClass: 'direct-gsc' | 'serp-reviewed-cluster' | 'proven-gr8-cluster' | 'deep-catalogue-intersection';
  qualityApproved: boolean;
};

type PseoIntentData = {
  schemaVersion: number;
  batchId: string;
  generatedAt: string;
  minimumInventory: number;
  targetSize: number;
  candidateCount: number;
  intents: PseoIntentDefinition[];
};

const intentData = generatedIntentData as PseoIntentData;
let registryById: Map<string, RegistryGame> | null = null;

function getRegistryById() {
  if (!registryById) registryById = new Map(getIndexableRegistryGames().map((game) => [game.id, game]));
  return registryById;
}

/** Return the generated, quality-approved pSEO intent definitions. */
export function getActivePseoIntents() {
  return intentData.intents.filter((intent) => intent.qualityApproved && intent.inventoryCount >= intentData.minimumInventory);
}

/** Return one quality-approved pSEO intent by URL slug. */
export function getPseoIntent(slug: string) {
  return getActivePseoIntents().find((intent) => intent.slug === slug);
}

/** Resolve a pSEO intent's frozen game IDs against the current indexable registry. */
export function getPseoIntentGames(slug: string) {
  const intent = getPseoIntent(slug);
  if (!intent) return [];
  const byId = getRegistryById();
  return intent.gameIds.map((id) => byId.get(id)).filter((game): game is RegistryGame => Boolean(game));
}

/** Return related quality-approved collections. */
export function getRelatedPseoIntents(intent: PseoIntentDefinition) {
  const bySlug = new Map(getActivePseoIntents().map((candidate) => [candidate.slug, candidate]));
  return intent.relatedSlugs.map((slug) => bySlug.get(slug)).filter((candidate): candidate is PseoIntentDefinition => Boolean(candidate));
}

/** Build a canonical pSEO collection path. */
export function pseoIntentPath(slug: string, page = 1) {
  return page > 1 ? `/games/${slug}/page/${page}` : `/games/${slug}`;
}

export const pseoBatchId = intentData.batchId;
export const pseoGeneratedAt = intentData.generatedAt;
export const pseoMinimumInventory = intentData.minimumInventory;
export const pseoTargetSize = intentData.targetSize;
