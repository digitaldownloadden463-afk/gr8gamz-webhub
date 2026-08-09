import { commerceProducts } from '@/src/data/commerce/products';
import { buyingGuides } from '@/src/data/commerce/guides';
import { productComparisons } from '@/src/data/commerce/comparisons';
import type { CommerceCategorySlug } from '@/lib/commerce/types';

export const commerceCategories: readonly {
  slug: CommerceCategorySlug;
  name: string;
  description: string;
}[] = [
  { slug: 'gaming-mice', name: 'Gaming Mice', description: 'Compare grip, weight, controls and wireless features before choosing your next mouse.' },
  { slug: 'gaming-headsets', name: 'Gaming Headsets', description: 'Find the right balance of clear communication, platform support and immersive audio.' },
  { slug: 'gaming-keyboards', name: 'Gaming Keyboards', description: 'Choose a switch system, layout and control set that genuinely fits your desk.' },
  { slug: 'mobile-gaming', name: 'Mobile Gaming', description: 'Check device compatibility first, then compare full-size controls for play on the move.' }
];

export function getCommerceProduct(slug: string) {
  return commerceProducts.find((product) => product.slug === slug);
}

export function getCommerceCategory(slug: string) {
  return commerceCategories.find((category) => category.slug === slug);
}

export function productsForCategory(category: CommerceCategorySlug) {
  return commerceProducts.filter((product) => product.category === category);
}

export function guidesForCategory(category: CommerceCategorySlug) {
  return buyingGuides.filter((guide) => guide.category === category);
}

export function comparisonsForCategory(category: CommerceCategorySlug) {
  return productComparisons.filter((comparison) => comparison.category === category);
}

export function getBuyingGuide(category: string, slug: string) {
  return buyingGuides.find((guide) => guide.category === category && guide.slug === slug);
}

export function getProductComparison(category: string, slug: string) {
  return productComparisons.find((comparison) => comparison.category === category && comparison.slug === slug);
}

export function commerceRoutePaths() {
  return [
    '/gaming-gear',
    ...commerceCategories.map((category) => `/gaming-gear/${category.slug}`),
    ...commerceProducts.map((product) => `/gaming-gear/products/${product.slug}`),
    ...buyingGuides.map((guide) => `/gaming-gear/${guide.category}/${guide.slug}`),
    ...productComparisons.map((comparison) => `/gaming-gear/${comparison.category}/${comparison.slug}`)
  ];
}
