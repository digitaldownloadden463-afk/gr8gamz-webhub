import { commerceProducts } from '@/src/data/commerce/products';
import { buyingGuides } from '@/src/data/commerce/guides';
import { productComparisons } from '@/src/data/commerce/comparisons';
import type { CommerceCategorySlug } from '@/lib/commerce/types';

const productEvidenceMaxAgeDays = 45;

export const commerceCategories: readonly {
  slug: CommerceCategorySlug;
  name: string;
  description: string;
}[] = [
  { slug: 'gaming-mice', name: 'Gaming Mice', description: 'Compare grip, weight, controls and wireless features before choosing your next mouse.' },
  { slug: 'gaming-headsets', name: 'Gaming Headsets', description: 'Find the right balance of clear communication, platform support and immersive audio.' },
  { slug: 'gaming-keyboards', name: 'Gaming Keyboards', description: 'Choose a switch system, layout and control set that genuinely fits your desk.' },
  { slug: 'gaming-controllers', name: 'Gaming Controllers', description: 'Compare platform support, connection mode and competitive controls before choosing a controller.' },
  { slug: 'mobile-gaming', name: 'Mobile Gaming', description: 'Check device compatibility first, then compare full-size controls for play on the move.' },
  { slug: 'gaming-laptops', name: 'Gaming Laptops', description: 'Choose the Blade size and performance class before comparing exact UK configurations.' },
  { slug: 'gaming-chairs', name: 'Gaming Chairs', description: 'Compare support design, materials and official dimensions before choosing a chair.' }
];

export function getCommerceProduct(slug: string) {
  return commerceProducts.find((product) => product.slug === slug);
}

export function commerceEvidenceState(sourceCheckedAt: string, now = new Date()) {
  const checkedAt = new Date(`${sourceCheckedAt}T00:00:00Z`);
  if (Number.isNaN(checkedAt.getTime())) return 'invalid' as const;
  const ageDays = (now.getTime() - checkedAt.getTime()) / 86_400_000;
  return ageDays > productEvidenceMaxAgeDays ? 'stale' as const : 'current' as const;
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

export function commerceRouteLastmod(route: string) {
  const product = commerceProducts.find((item) => route === `/gaming-gear/products/${item.slug}`);
  if (product) return product.lastUpdated;
  const guide = buyingGuides.find((item) => route === `/gaming-gear/${item.category}/${item.slug}`);
  if (guide) return guide.sourceCheckedAt;
  const comparison = productComparisons.find((item) => route === `/gaming-gear/${item.category}/${item.slug}`);
  if (comparison) return comparison.sourceCheckedAt;
  return '2026-08-22';
}
