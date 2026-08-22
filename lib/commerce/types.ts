export type Merchant = 'razer';

export type CommerceCategorySlug =
  | 'gaming-mice'
  | 'gaming-headsets'
  | 'gaming-keyboards'
  | 'gaming-controllers'
  | 'mobile-gaming'
  | 'gaming-laptops'
  | 'gaming-chairs';

export type CommercePageType = 'hub' | 'category' | 'guide' | 'comparison' | 'product';

export type ProductLifecycle = 'current' | 'predecessor' | 'uncertain';

export type ProductEvidence = {
  label: string;
  sourceUrl: string;
  checkedAt: string;
};

export type ProductSpecification = ProductEvidence & {
  value: string;
};

export type CommerceProduct = {
  schemaVersion: 2;
  id: string;
  merchant: Merchant;
  merchantProductId: string;
  brand: 'Razer';
  name: string;
  family: string;
  model: string;
  generation: string;
  lifecycle: ProductLifecycle;
  slug: string;
  category: CommerceCategorySlug;
  image: string;
  destinationUrl: string;
  officialSourceUrl: string;
  sourceCheckedAt: string;
  sourceEvidence: readonly ProductEvidence[];
  contentEvidenceState: 'verified-official-sources';
  platforms: readonly string[];
  variants: readonly string[];
  predecessorSlugs: readonly string[];
  successorSlugs: readonly string[];
  relatedAccessorySlugs: readonly string[];
  shortDescription: string;
  buyingSummary: string;
  keyFeatures: readonly string[];
  bestFor: string;
  limitations: readonly string[];
  specifications: Readonly<Record<string, ProductSpecification>>;
  price: null;
  currency: 'GBP';
  availability: 'check-merchant';
  authorisedPriceSource: null;
  priceCheckedAt: null;
  lifecycleNote?: string;
  lastUpdated: string;
};

export type EditorialSection = {
  heading: string;
  body: string;
};

export type GuideRecommendation = {
  productSlug: string;
  label: string;
  reason: string;
  limitation: string;
};

export type BuyingGuide = {
  slug: string;
  category: CommerceCategorySlug;
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

export type ComparisonRow = {
  label: string;
  left: string;
  right: string;
  decision: string;
};

export type ProductComparison = {
  slug: string;
  category: CommerceCategorySlug;
  title: string;
  description: string;
  productSlugs: readonly string[];
  externalComparisonProduct?: {
    name: string;
    officialSourceUrl: string;
  };
  verdict: string;
  comparisonRows: readonly ComparisonRow[];
  recommendations: readonly EditorialSection[];
  parentGuideSlug: string;
  sourceCheckedAt: string;
};

export type KeywordOpportunity = {
  keyword: string;
  intent: 'commercial' | 'transactional';
  country: 'UK';
  demand: 'high' | 'medium' | 'emerging';
  source: string;
  checked: string;
  difficulty: 'high' | 'medium' | 'lower';
  productValue: 'high' | 'medium';
  razerRelevance: 'strong' | 'partial';
  pageType: 'guide' | 'comparison' | 'product';
  priority: number;
  selected: boolean;
};
