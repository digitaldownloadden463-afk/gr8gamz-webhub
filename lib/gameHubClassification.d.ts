import type { HubRuleId } from './gameHubRules';

export type PartnerHubEvidence = [membershipMask: number, sourceCategory: string, tags: string[]];

export const gameHubRuleIds: HubRuleId[];
export const partnerHubClassificationReport: {
  schemaVersion: number;
  sourceCatalogueGeneratedAt: string;
  eligibleProfileCount: number;
  counts: Record<HubRuleId, number>;
};
export function getPartnerHubSlugs(hubId: HubRuleId): string[];
export function hasPartnerHubMembership(hubId: HubRuleId, evidence?: PartnerHubEvidence): boolean;
export function getPartnerHubEvidence(slug: string): PartnerHubEvidence | undefined;
