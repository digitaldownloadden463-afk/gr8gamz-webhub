import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const catalogue = JSON.parse(fs.readFileSync(path.join(root, 'src/data/commerce/gadgethyper-products.generated.json'), 'utf8'));
const products = catalogue.products;
const errors = [];
const slugs = new Set();
const categories = new Set(['controllers', 'controller-accessories', 'keyboards', 'mice', 'cooling', 'power', 'audio', 'lifestyle']);
const affiliateConfig = JSON.parse(fs.readFileSync(path.join(root, 'src/data/commerce/gadgethyper-affiliate.json'), 'utf8'));
const affiliateRef = process.env.GADGETHYPER_AFFILIATE_REF?.trim() || affiliateConfig.publicReferralCode;
const releaseGate = process.env.GADGETHYPER_RELEASE_GATE === 'true';
const currentProducts = products.filter((product) => product.lifecycle !== 'retired');
const affiliateSamples = [];
for (let index = 0; affiliateSamples.length < Math.min(25, currentProducts.length); index += 1) {
  let added = false;
  for (const category of categories) {
    const product = currentProducts.filter((item) => item.category === category)[index];
    if (product && affiliateSamples.length < 25) { affiliateSamples.push(product); added = true; }
  }
  if (!added) break;
}

if (!Number.isInteger(catalogue.currentProductCount) || catalogue.currentProductCount < 1) errors.push('Current product count is missing');
if (products.filter((product) => product.lifecycle !== 'retired').length !== catalogue.currentProductCount) errors.push('Current product count does not match non-retired records');
if (!/^[A-Za-z0-9_-]{2,64}$/.test(affiliateRef) || /placeholder|example|your/i.test(affiliateRef)) errors.push('Approved public GoAffPro referral code is missing or invalid');
for (const product of products) {
  if (slugs.has(product.slug)) errors.push(`Duplicate product slug: ${product.slug}`);
  slugs.add(product.slug);
  if (product.schemaVersion !== 3 || product.merchant !== 'gadgethyper') errors.push(`Invalid identity: ${product.slug}`);
  if (!categories.has(product.category)) errors.push(`Invalid category: ${product.slug}`);
  let destination;
  try { destination = new URL(product.destinationUrl); } catch { errors.push(`Invalid destination: ${product.slug}`); continue; }
  if (destination.protocol !== 'https:' || !['gadgethyper.com', 'www.gadgethyper.com'].includes(destination.hostname) || !destination.pathname.startsWith('/products/')) errors.push(`Unapproved destination: ${product.slug}`);
  if (!product.sourceCheckedAt || product.sourceEvidenceState !== 'official-merchant-catalogue') errors.push(`Missing provenance: ${product.slug}`);
  if (!['active', 'sold-out', 'retired', 'review-required'].includes(product.lifecycle)) errors.push(`Invalid lifecycle: ${product.slug}`);
  if (product.availability !== 'in-stock' && product.price !== null) errors.push(`Unavailable product exposes current price: ${product.slug}`);
  if (product.compareAtPrice !== null && (product.price === null || product.compareAtPrice <= product.price)) errors.push(`Invalid compare price: ${product.slug}`);
  if (!product.shortDescription || !product.buyingSummary || !product.limitations?.length) errors.push(`Incomplete editorial content: ${product.slug}`);
  if (product.imageRightsState !== 'affiliate-authorised' && product.indexable) errors.push(`Product indexed before image-rights approval: ${product.slug}`);
  if (product.imageRightsState === 'affiliate-authorised' && (!product.imageRightsEvidence || !product.imageRightsCheckedAt)) errors.push(`Missing image-rights evidence: ${product.slug}`);
  if (product.indexable && (!product.imageSourceUrl || product.keyFeatures.length < 3 || product.lifecycle === 'retired')) errors.push(`Product does not satisfy index quality gate: ${product.slug}`);
  if (/rating|reviewCount|aggregateRating/i.test(JSON.stringify(product))) errors.push(`Unsupported rating data: ${product.slug}`);
}

const text = ['src/data/commerce/guides.ts', 'src/data/commerce/comparisons.ts'].map((file) => fs.readFileSync(path.join(root, file), 'utf8')).join('\n');
for (const match of text.matchAll(/(?:productSlug:\s*|productSlugs:\s*\[\s*)'([^']+)'/g)) if (!slugs.has(match[1])) errors.push(`Editorial page references unknown product: ${match[1]}`);
if (/we tested|our testing|aggregateRating|reviewCount/i.test(text)) errors.push('Unsupported testing or rating claim in editorial data');

for (const product of affiliateSamples) {
  const destination = new URL(product.destinationUrl);
  destination.searchParams.set('ref', affiliateRef);
  if (destination.hostname !== 'gadgethyper.com' || destination.pathname !== new URL(product.destinationUrl).pathname || destination.searchParams.get('ref') !== affiliateRef) errors.push(`Affiliate deep-link validation failed: ${product.slug}`);
}

const component = fs.readFileSync(path.join(root, 'components/commerce/AffiliateLink.tsx'), 'utf8');
if (!component.includes('rel="sponsored noopener noreferrer"')) errors.push('Affiliate links do not carry the complete sponsored rel value');
if (!component.includes("trackEvent('affiliate_click'")) errors.push('Affiliate click attribution is missing');

let liveDestinationCount = null;
let liveRateLimitedCount = null;
let liveAffiliateDestinationCount = null;
if (process.argv.includes('--live')) {
  let cursor = 0;
  liveDestinationCount = 0;
  liveRateLimitedCount = 0;
  async function worker() {
    while (cursor < products.length) {
      const product = products[cursor++];
      try {
        const response = await fetch(product.destinationUrl, { redirect: 'follow', headers: { 'user-agent': 'GR8GAMZ-Catalogue-Validator/1.0' } });
        if (response.status === 429) liveRateLimitedCount += 1;
        else if (!response.ok) errors.push(`Live destination returned HTTP ${response.status}: ${product.slug}`);
        else liveDestinationCount += 1;
        await response.body?.cancel();
      } catch (error) {
        errors.push(`Live destination failed: ${product.slug} (${error instanceof Error ? error.message : 'unknown error'})`);
      }
    }
  }
  await Promise.all(Array.from({ length: 4 }, () => worker()));
  liveAffiliateDestinationCount = 0;
  for (const product of affiliateSamples) {
    const affiliateUrl = new URL(product.destinationUrl);
    affiliateUrl.searchParams.set('ref', affiliateRef);
    try {
      const response = await fetch(affiliateUrl, { redirect: 'follow', headers: { 'user-agent': 'GR8GAMZ-Affiliate-Validator/1.0' } });
      if (response.status === 429) liveRateLimitedCount += 1;
      else if (!response.ok) errors.push(`Live affiliate destination returned HTTP ${response.status}: ${product.slug}`);
      else liveAffiliateDestinationCount += 1;
      await response.body?.cancel();
    } catch (error) {
      errors.push(`Live affiliate destination failed: ${product.slug} (${error instanceof Error ? error.message : 'unknown error'})`);
    }
  }
}

const releaseBlockers = [
  ...(!affiliateRef ? ['approved GoAffPro affiliate referral code is not configured'] : []),
  ...(products.some((product) => product.imageRightsState !== 'affiliate-authorised') ? ['product-image promotional rights are not recorded as authorised'] : [])
];
if (releaseGate && releaseBlockers.length) errors.push(...releaseBlockers.map((blocker) => `Production release blocker: ${blocker}`));

const report = {
  generatedAt: new Date().toISOString(),
  merchant: 'gadgethyper',
  products: products.length,
  active: products.filter((product) => product.lifecycle === 'active').length,
  soldOut: products.filter((product) => product.lifecycle === 'sold-out').length,
  retired: products.filter((product) => product.lifecycle === 'retired').length,
  indexableProducts: products.filter((product) => product.indexable).length,
  imageEnabledProducts: products.filter((product) => product.imageRightsState === 'affiliate-authorised' && product.imageSourceUrl).length,
  affiliateEnabledProducts: currentProducts.length,
  imageRightsReviewRequired: products.filter((product) => product.imageRightsState === 'review-required').length,
  affiliateTrackingConfigured: Boolean(affiliateRef),
  affiliateDeepLinksValidated: Math.min(25, products.filter((product) => product.lifecycle !== 'retired').length),
  liveDestinationCount,
  liveRateLimitedCount,
  liveAffiliateDestinationCount,
  affiliateSampleCategories: [...new Set(affiliateSamples.map((product) => product.category))],
  releaseBlockers,
  categoryCounts: Object.fromEntries([...categories].map((category) => [category, products.filter((product) => product.category === category).length])),
  errors
};
fs.writeFileSync(path.join(root, 'reports/commerce-report.json'), `${JSON.stringify(report, null, 2)}\n`);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`GadgetHyper validation passed: ${products.length} products (${report.active} active, ${report.soldOut} sold out, ${report.retired} retired); affiliate and image-rights production gates passed.`);
