import { commerceProducts } from '@/src/data/commerce/products';
import { buyingGuides } from '@/src/data/commerce/guides';
import { productComparisons } from '@/src/data/commerce/comparisons';
import type { BuyingGuide, CommerceCategorySlug, CommerceProduct } from '@/lib/commerce/types';

export const commerceReviewedAt = '2026-09-07';
export const productEvidenceMaxAgeDays = 7;

export const commerceCategories: readonly {
  slug: CommerceCategorySlug;
  name: string;
  description: string;
  indexable: boolean;
}[] = [
  { slug: 'controllers', name: 'Gaming Controllers', description: 'Compare current wired and wireless controllers by platform, connection, sticks, triggers and extra controls.', indexable: true },
  { slug: 'controller-accessories', name: 'Controller Accessories', description: 'Find docks, replacement controls, cases, grips and connection accessories matched to specific controller families.', indexable: true },
  { slug: 'keyboards', name: 'Gaming Keyboards', description: 'Compare the current compact keyboard range by switch technology, layout and connection.', indexable: false },
  { slug: 'mice', name: 'Gaming Mice', description: 'Browse the current focused mouse range and verify grip, connection and software details before buying.', indexable: false },
  { slug: 'cooling', name: 'Laptop Cooling', description: 'Compare laptop cooling pads by device fit, airflow controls, noise information and desk position.', indexable: true },
  { slug: 'power', name: 'Power and Chargers', description: 'Browse charging and power accessories, then verify device standards and regional plug requirements.', indexable: true },
  { slug: 'audio', name: 'Gaming Audio', description: 'Compare the current earphone and headphone range by connection, fit and supported devices.', indexable: true },
  { slug: 'lifestyle', name: 'Gaming Lifestyle', description: 'Explore licensed and gaming-inspired accessories while checking availability and product provenance.', indexable: true }
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

export function canShowPrice(product: CommerceProduct, now = new Date()) {
  return product.availability === 'in-stock' && product.price !== null && commerceEvidenceState(product.sourceCheckedAt, now) === 'current';
}

export function canShowMerchantImage(product: CommerceProduct) {
  return product.imageRightsState === 'affiliate-authorised' && Boolean(product.imageSourceUrl);
}

export function productsWithCurrentPrices(products: readonly CommerceProduct[], now = new Date()) {
  return products.map((product) => canShowPrice(product, now)
    ? product
    : { ...product, price: null, compareAtPrice: null });
}

export function getCommerceCategory(slug: string) {
  return commerceCategories.find((category) => category.slug === slug);
}

export function productsForCategory(category: CommerceCategorySlug) {
  return commerceProducts.filter((product) => product.category === category);
}

export function activeProducts(products: readonly CommerceProduct[] = commerceProducts) {
  return products.filter((product) => product.lifecycle === 'active');
}

export function guidesForCategory(category: CommerceCategorySlug) {
  return buyingGuides.filter((guide) => guide.category === category);
}

export function comparisonsForCategory(category: CommerceCategorySlug) {
  return productComparisons.filter((comparison) => comparison.category === category);
}

export function guidePath(guide: BuyingGuide) {
  return `/gaming-gear/${guide.legacyCategory || guide.category}/${guide.slug}`;
}

export function getBuyingGuide(category: string, slug: string) {
  return buyingGuides.find((guide) => (guide.legacyCategory || guide.category) === category && guide.slug === slug);
}

export function getProductComparison(category: string, slug: string) {
  return productComparisons.find((comparison) => comparison.category === category && comparison.slug === slug);
}

export function commerceRoutePaths() {
  return [
    '/gaming-gear',
    '/gaming-gear/all-products',
    ...commerceCategories.map((category) => `/gaming-gear/${category.slug}`),
    ...commerceProducts.map((product) => `/gaming-gear/products/${product.slug}`),
    ...buyingGuides.map(guidePath),
    ...productComparisons.map((comparison) => `/gaming-gear/${comparison.category}/${comparison.slug}`)
  ];
}

export function commerceIndexableRoutePaths() {
  return [
    '/gaming-gear',
    '/gaming-gear/all-products',
    ...commerceCategories.filter((category) => category.indexable).map((category) => `/gaming-gear/${category.slug}`),
    ...commerceProducts.filter((product) => product.indexable).map((product) => `/gaming-gear/products/${product.slug}`),
    ...buyingGuides.map(guidePath),
    ...productComparisons.map((comparison) => `/gaming-gear/${comparison.category}/${comparison.slug}`)
  ];
}

export function commerceRouteLastmod(route: string) {
  const product = commerceProducts.find((item) => route === `/gaming-gear/products/${item.slug}`);
  if (product) return product.lastUpdated;
  const guide = buyingGuides.find((item) => route === guidePath(item));
  if (guide) return guide.sourceCheckedAt;
  const comparison = productComparisons.find((item) => route === `/gaming-gear/${item.category}/${item.slug}`);
  return comparison?.sourceCheckedAt || commerceReviewedAt;
}
