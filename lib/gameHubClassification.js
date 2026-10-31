import { createRequire } from 'node:module';

const loadRuntimeData = createRequire(import.meta.url);
const cache = loadRuntimeData('../src/data/partnerHubClassification.generated.json');

export const gameHubRuleIds = cache.hubs;
export const partnerHubClassificationReport = {
  schemaVersion: cache.schemaVersion,
  sourceCatalogueGeneratedAt: cache.sourceCatalogueGeneratedAt,
  eligibleProfileCount: cache.eligibleProfileCount,
  counts: cache.counts
};

const hubBits = new Map(gameHubRuleIds.map((id, index) => [id, 1 << index]));
const slugsByHub = new Map(gameHubRuleIds.map((id) => [id, []]));
for (const [slug, evidence] of Object.entries(cache.records)) {
  for (const id of gameHubRuleIds) {
    if ((evidence[0] & hubBits.get(id)) !== 0) slugsByHub.get(id).push(slug);
  }
}

export function getPartnerHubSlugs(hubId) {
  return [...(slugsByHub.get(hubId) || [])];
}

export function hasPartnerHubMembership(hubId, evidence) {
  const bit = hubBits.get(hubId) || 0;
  return Boolean(bit && evidence && (evidence[0] & bit) !== 0);
}

export function getPartnerHubEvidence(slug) {
  return cache.records[slug];
}
