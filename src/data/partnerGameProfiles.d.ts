export type PartnerGameProfile = {
  title: string;
  provider: 'gamepix' | 'gamemonetize';
  category: string;
  intent?: string;
  rank?: number;
  slug: string;
  image: string;
  artwork?: string;
  path: string;
  playPath: string;
  playUrl?: string;
  difficulty?: string;
  bestFor?: string;
  controls?: string;
  description: string;
  whyPicked?: string;
  howToPlay?: string;
  deviceFit?: string;
  width?: number;
  height?: number;
  sourceId?: string;
  sourceAttribution?: string;
  lastChecked?: string;
  qaStatus?: string;
  keywords?: string[];
  tags?: string[];
  faqs?: Array<{ question: string; answer: string }>;
};

export type PartnerIndexQuality = {
  score: number;
  state: 'indexable' | 'needs-review' | 'quarantined';
  reasons: string[];
  hardFailures: string[];
  brandReview: string | null;
};

export type PartnerNetworkCluster = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  categories: string[];
  intent: string;
};

export type PartnerCatalogueReport = {
  generatedAt: string;
  totals: {
    raw: number;
    verifiedIndexable: number;
    verifiedNoindex?: number;
    duplicates: number;
    quarantined: number;
    canonicalPartnerProfiles: number;
    totalIndexableWithOriginals: number;
  };
  supplierTotals?: Record<string, number>;
  pagesProcessed?: Record<string, number>;
  statusCounts?: Record<string, number>;
  quarantineCounts?: Record<string, number>;
};

export const partnerGameProfiles: PartnerGameProfile[];
export const allPartnerGameProfiles: PartnerGameProfile[];
export const partnerCatalogueReport: PartnerCatalogueReport;
export const partnerIndexQualityReport: Record<string, unknown>;
export const partnerCataloguePageSize: number;
export function getPartnerCataloguePage(page?: number, pageSize?: number): {
  games: PartnerGameProfile[];
  page: number;
  pageSize: number;
  totalGames: number;
  totalPages: number;
  previousPath: string | null;
  nextPath: string | null;
};
export function getPartnerGameProfiles(): PartnerGameProfile[];
export function getPartnerGameProfile(slug: string): PartnerGameProfile | undefined;
export function getPartnerIndexQuality(slug: string): PartnerIndexQuality;
export function getFeaturedPartnerGameProfiles(limit?: number): PartnerGameProfile[];
export function getPartnerGameProfilesByCategory(category: string, limit?: number): PartnerGameProfile[];
export function getPartnerProfileUrl(title?: string): string | null;
export function getPartnerPlayUrl(title?: string): string | null;
export const partnerKeywordClusters: string[];
export const partnerNetworkClusters: PartnerNetworkCluster[];
export function getPartnerNetworkClusters(): PartnerNetworkCluster[];
export function getPartnerNetworkCluster(slug: string): PartnerNetworkCluster | undefined;
export function getPartnerNetworkClusterRoutes(): string[];
export function getPartnerGameProfilesByCluster(slug: string, limit?: number): PartnerGameProfile[];
export function getRelatedPartnerGameProfiles(profile: PartnerGameProfile | undefined, limit?: number, options?: { excludeProvider?: string }): PartnerGameProfile[];
export function getTrendingPartnerProfiles(limit?: number): PartnerGameProfile[];
export function getNewPartnerProfiles(limit?: number): PartnerGameProfile[];
export function getPopularPartnerProfiles(limit?: number): PartnerGameProfile[];
export function getPlayNextPartnerProfiles(limit?: number): PartnerGameProfile[];
