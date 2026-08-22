import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const [{ commerceProducts }, { buyingGuides }, { productComparisons }] = await Promise.all([
  import(pathToFileURL(path.join(root, 'src/data/commerce/products.ts')).href),
  import(pathToFileURL(path.join(root, 'src/data/commerce/guides.ts')).href),
  import(pathToFileURL(path.join(root, 'src/data/commerce/comparisons.ts')).href)
]);

const tier1 = [
  '/gaming-gear/gaming-headsets/razer-blackshark-v3-pro-vs-kraken-v4-pro',
  '/gaming-gear/gaming-mice/best-wireless-gaming-mouse',
  '/gaming-gear/gaming-mice/razer-viper-v4-pro-vs-deathadder-v4-pro',
  '/gaming-gear/gaming-mice/best-gaming-mouse',
  '/gaming-gear/gaming-mice/best-gaming-mouse-for-fps',
  '/gaming-gear/products/razer-viper-v4-pro',
  '/gaming-gear/products/razer-deathadder-v4-pro',
  '/gaming-gear/products/razer-blackshark-v3-pro',
  '/gaming-gear/products/razer-kraken-v4-pro',
  '/gaming-gear/products/razer-naga-v3-pro',
  '/gaming-gear/gaming-mice/best-mmo-gaming-mouse',
  '/gaming-gear/gaming-headsets/best-gaming-headset',
  '/gaming-gear/gaming-headsets/best-wireless-gaming-headset',
  '/gaming-gear/gaming-laptops/best-razer-gaming-laptop-uk',
  '/gaming-gear/products/razer-blade-14',
  '/gaming-gear/products/razer-blade-16',
  '/gaming-gear/gaming-laptops/razer-blade-14-vs-blade-16',
  '/gaming-gear/gaming-chairs/best-razer-gaming-chair',
  '/gaming-gear/products/razer-iskur-v2-newgen',
  '/gaming-gear/gaming-chairs/razer-iskur-v2-newgen-vs-enki',
  '/gaming-gear/gaming-keyboards/best-razer-gaming-keyboard',
  '/gaming-gear/gaming-keyboards/razer-huntsman-v3-pro-8khz-vs-blackwidow-v4-pro',
  '/gaming-gear/mobile-gaming/best-mobile-gaming-controller',
  '/gaming-gear/mobile-gaming/razer-kishi-v3-vs-kishi-v3-pro',
  '/gaming-gear/products/razer-wolverine-v3-pro'
];

const expectedNewProducts = new Set([
  'razer-viper-v4-pro', 'razer-naga-v3-pro', 'razer-blade-14', 'razer-blade-16',
  'razer-iskur-v2-newgen', 'razer-wolverine-v3-pro'
]);
const errors = [];
const allRoutes = new Set([
  '/gaming-gear',
  ...commerceProducts.map((product) => `/gaming-gear/products/${product.slug}`),
  ...buyingGuides.map((guide) => `/gaming-gear/${guide.category}/${guide.slug}`),
  ...productComparisons.map((comparison) => `/gaming-gear/${comparison.category}/${comparison.slug}`)
]);

if (tier1.length !== 25 || new Set(tier1).size !== 25) errors.push('Tier 1 route list must contain exactly 25 unique operations');
for (const route of tier1) if (!allRoutes.has(route)) errors.push(`Missing Tier 1 route: ${route}`);

const titles = [...buyingGuides, ...productComparisons].map((page) => page.title.toLowerCase());
if (new Set(titles).size !== titles.length) errors.push('Guide/comparison metadata titles are not unique');

for (const product of commerceProducts) {
  if (product.price !== null || product.authorisedPriceSource !== null || product.priceCheckedAt !== null) errors.push(`Unverified price fields present: ${product.slug}`);
  if (!product.officialSourceUrl.startsWith('https://www.razer.com/gb-en/')) errors.push(`Invalid official source: ${product.slug}`);
  if (product.destinationUrl !== product.officialSourceUrl) errors.push(`Affiliate destination/source mismatch: ${product.slug}`);
  for (const relatedSlug of [...product.predecessorSlugs, ...product.successorSlugs]) {
    if (!commerceProducts.some((item) => item.slug === relatedSlug)) errors.push(`Broken lifecycle relation ${product.slug} -> ${relatedSlug}`);
  }
}

for (const slug of expectedNewProducts) if (!commerceProducts.some((product) => product.slug === slug)) errors.push(`Missing Tier 1 product ${slug}`);
for (const forbidden of ['razer-enki', 'razer-fujin', 'razer-blade-18', 'razer-kishi-v3-pro-xl']) {
  if (commerceProducts.some((product) => product.slug === forbidden)) errors.push(`Tier 2 product was published early: ${forbidden}`);
}

const sourceFiles = [
  'app/gaming-gear/[category]/[slug]/page.tsx',
  'app/gaming-gear/products/[slug]/page.tsx',
  'components/commerce/AffiliateLink.tsx',
  'components/commerce/CommercePageView.tsx',
  'app/globals.css'
].map((file) => fs.readFileSync(path.join(root, file), 'utf8')).join('\n');

if (/AggregateRating|['"]Review['"]|we tested|our testing/i.test(sourceFiles)) errors.push('Fabricated review/testing language or schema detected');
if (!sourceFiles.includes('document.documentElement.lang')) errors.push('Commerce analytics locale is not derived from the document locale');
if ((sourceFiles.match(/locale:\s*'en'/g) || []).length) errors.push('Hard-coded English commerce analytics locale remains');
if (!sourceFiles.includes('comparison-table-wrap') || !sourceFiles.includes('scope="col"') || !sourceFiles.includes('scope="row"')) errors.push('Accessible responsive comparison table is missing');
if (!sourceFiles.includes('AffiliateDisclosure')) errors.push('Affiliate disclosure is missing');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Razer Tier 1 validation passed: ${tier1.length} operations, ${commerceProducts.length} published products, ${buyingGuides.length} guides, ${productComparisons.length} comparisons, zero Tier 2 products.`);
