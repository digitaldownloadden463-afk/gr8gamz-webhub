export type Merchant = 'gadgethyper';

export type CommerceCategorySlug =
  | 'controllers'
  | 'controller-accessories'
  | 'keyboards'
  | 'mice'
  | 'cooling'
  | 'power'
  | 'audio'
  | 'desktop-gear'
  | 'lifestyle';

export type CommercePageType = 'hub' | 'category' | 'guide' | 'comparison' | 'product';
export type ProductLifecycle = 'active' | 'sold-out' | 'retired' | 'review-required';
export type AssetRightsState = 'affiliate-authorised' | 'review-required' | 'excluded';

export type CommerceVariant = {
  id: string;
  name: string;
  available: boolean;
  price: number | null;
  compareAtPrice: number | null;
};

export type CommerceProduct = {
  schemaVersion: 3;
  id: string;
  merchant: Merchant;
  merchantProductId: string;
  brand: string;
  name: string;
  slug: string;
  category: CommerceCategorySlug;
  productType: string;
  lifecycle: ProductLifecycle;
  destinationUrl: string;
  officialSourceUrl: string;
  sourceCheckedAt: string;
  lastUpdated: string;
  sourceEvidenceState: 'official-merchant-catalogue';
  imageSourceUrl: string | null;
  imageRightsState: AssetRightsState;
  imageRightsEvidence: string | null;
  imageRightsCheckedAt: string | null;
  variants: readonly CommerceVariant[];
  price: number | null;
  compareAtPrice: number | null;
  currency: 'USD';
  availability: 'in-stock' | 'sold-out' | 'unknown';
  shortDescription: string;
  buyingSummary: string;
  keyFeatures: readonly string[];
  compatibility: readonly string[];
  bestFor: string;
  limitations: readonly string[];
  indexable: boolean;
};

export type EditorialSection = { heading: string; body: string };

export type GuideRecommendation = {
  productSlug: string;
  label: string;
  reason: string;
  limitation: string;
};

export type BuyingGuide = {
  slug: string;
  category: CommerceCategorySlug;
  legacyCategory?: string;
  title: string;
  description: string;
  query: string;
  productSlugs: readonly string[];
  intent: string;
  methodology: string;
  recommendations: readonly GuideRecommendation[];
  decisionSections: readonly EditorialSection[];
  sourceCheckedAt: string;
};

export type ComparisonRow = { label: string; left: string; right: string; decision: string };

export type ProductComparison = {
  slug: string;
  category: CommerceCategorySlug;
  title: string;
  description: string;
  productSlugs: readonly [string, string];
  verdict: string;
  comparisonRows: readonly ComparisonRow[];
  recommendations: readonly EditorialSection[];
  parentGuideSlug?: string;
  sourceCheckedAt: string;
};
