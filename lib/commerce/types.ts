export type Merchant = 'razer';

export type CommerceCategorySlug =
  | 'gaming-mice'
  | 'gaming-headsets'
  | 'gaming-keyboards'
  | 'gaming-controllers'
  | 'mobile-gaming';

export type CommercePageType = 'hub' | 'category' | 'guide' | 'comparison' | 'product';

export type CommerceProduct = {
  id: string;
  merchant: Merchant;
  merchantProductId: string;
  brand: 'Razer';
  name: string;
  slug: string;
  category: CommerceCategorySlug;
  image: string;
  destinationUrl: string;
  shortDescription: string;
  keyFeatures: readonly string[];
  bestFor: string;
  limitations: readonly string[];
  specifications: Readonly<Record<string, string>>;
  price: null;
  currency: 'GBP';
  availability: 'check-merchant';
  lastUpdated: string;
};

export type BuyingGuide = {
  slug: string;
  category: CommerceCategorySlug;
  title: string;
  description: string;
  query: string;
  productSlugs: readonly string[];
  intent: string;
};

export type ProductComparison = {
  slug: string;
  category: CommerceCategorySlug;
  title: string;
  description: string;
  productSlugs: readonly [string, string];
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
