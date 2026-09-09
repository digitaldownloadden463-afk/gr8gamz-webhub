import fs from 'node:fs/promises';
import path from 'node:path';

const sourceUrl = 'https://gadgethyper.com/collections/all/products.json?limit=250';
const outputPath = path.resolve('src/data/commerce/gadgethyper-products.generated.json');
const privateReportPath = path.resolve('reports/private/gadgethyper-catalogue-refresh.json');
const write = process.argv.includes('--write');
const sourceArg = process.argv.indexOf('--source');
const checkedAtArg = process.argv.indexOf('--checked-at');
const checkedAt = checkedAtArg >= 0 ? process.argv[checkedAtArg + 1] : new Date().toISOString().slice(0, 10);
const rightsEvidenceArg = process.argv.indexOf('--image-rights-evidence');
const imageRightsEvidence = rightsEvidenceArg >= 0 ? process.argv[rightsEvidenceArg + 1]?.trim() : '';
const imageRightsState = imageRightsEvidence ? 'affiliate-authorised' : 'review-required';

function decode(value = '') {
  return value
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&ndash;|&#8211;/g, '-')
    .replace(/&mdash;|&#8212;/g, '-')
    .replace(/&times;/g, 'x')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;|\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function listItems(html = '') {
  return [...html.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((match) => decode(match[1]))
    .filter((item) => item.length >= 8 && item.length <= 220)
    .filter((item) => !/100% authentic|sourced directly/i.test(item));
}

function categoryFor(product) {
  const value = `${product.product_type} ${product.title}`.toLowerCase();
  if (/controller bag|controller dock|charger dock|wireless dongle|d-pad|joystick|back paddle|phone holder|grip tape|screen protector|usb cable|replacement|accessory|skin cover|motion control module|magic key|magic cap/.test(value)) return 'controller-accessories';
  if (/controller|gamepad/.test(value)) return 'controllers';
  if (/keyboard|keycap/.test(value)) return 'keyboards';
  if (/mouse/.test(value)) return 'mice';
  if (/cooling|cooler/.test(value)) return 'cooling';
  if (/earphone|earbud|headphone|headset|audio/.test(value)) return 'audio';
  if (/charger|power bank|charging cable|socket/.test(value)) return 'power';
  if (/desk|monitor|light|display/.test(value)) return 'desktop-gear';
  return 'lifestyle';
}

const categoryNames = {
  controllers: 'controller',
  'controller-accessories': 'controller accessory',
  keyboards: 'gaming keyboard',
  mice: 'gaming mouse',
  cooling: 'gaming cooling product',
  power: 'power accessory',
  audio: 'gaming audio product',
  'desktop-gear': 'desktop gaming accessory',
  lifestyle: 'gaming lifestyle product'
};

function availability(product) {
  return product.variants.some((variant) => variant.available) ? 'in-stock' : 'sold-out';
}

function currentPrice(product) {
  const available = product.variants.filter((variant) => variant.available && Number.isFinite(Number(variant.price)));
  if (!available.length) return { price: null, compareAtPrice: null };
  const variant = available.sort((a, b) => Number(a.price) - Number(b.price))[0];
  const price = Number(variant.price);
  const compareAt = Number(variant.compare_at_price);
  return { price, compareAtPrice: Number.isFinite(compareAt) && compareAt > price ? compareAt : null };
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function normalizeProduct(product) {
  const category = categoryFor(product);
  const features = unique(listItems(product.body_html)).slice(0, 8);
  const compatibility = features.filter((item) => /compatible|windows|pc\b|android|ios|switch|xbox|playstation|mobile|phone/i.test(item)).slice(0, 4);
  const availabilityState = availability(product);
  const prices = currentPrice(product);
  const categoryName = categoryNames[category];
  const shortDescription = `${product.title} is a ${product.vendor} ${categoryName} listed in GadgetHyper's current catalogue. Compare the verified variants, compatibility notes and retailer-supplied specifications before leaving GR8 GAMZ.`;
  return {
    schemaVersion: 3,
    id: `gadgethyper-${product.id}`,
    merchant: 'gadgethyper',
    merchantProductId: String(product.id),
    brand: product.vendor || 'GadgetHyper',
    name: decode(product.title),
    slug: product.handle,
    category,
    productType: product.product_type || categoryName,
    lifecycle: availabilityState === 'in-stock' ? 'active' : 'sold-out',
    destinationUrl: `https://gadgethyper.com/products/${product.handle}`,
    officialSourceUrl: `https://gadgethyper.com/products/${product.handle}`,
    sourceCheckedAt: checkedAt,
    lastUpdated: checkedAt,
    sourceEvidenceState: 'official-merchant-catalogue',
    imageSourceUrl: product.images?.[0]?.src || null,
    imageRightsState,
    imageRightsEvidence: imageRightsEvidence || null,
    imageRightsCheckedAt: imageRightsEvidence ? checkedAt : null,
    variants: product.variants.map((variant) => ({
      id: String(variant.id),
      name: decode(variant.title),
      available: Boolean(variant.available),
      price: Number.isFinite(Number(variant.price)) ? Number(variant.price) : null,
      compareAtPrice: Number.isFinite(Number(variant.compare_at_price)) ? Number(variant.compare_at_price) : null
    })),
    price: prices.price,
    compareAtPrice: prices.compareAtPrice,
    currency: 'USD',
    availability: availabilityState,
    shortDescription,
    buyingSummary: `Consider this ${product.vendor} option if its published feature set and supported devices match your setup. GR8 GAMZ is not the seller; final product, delivery and warranty details are provided by GadgetHyper.`,
    keyFeatures: features,
    compatibility,
    bestFor: compatibility.length ? `players whose setup matches ${compatibility[0].replace(/[.]$/, '').toLowerCase()}` : `players comparing current ${categoryName} options`,
    limitations: [
      'GR8 GAMZ has not performed a hands-on test of this product.',
      availabilityState === 'sold-out' ? 'No variant was shown as available when the catalogue was checked.' : 'Compatibility can vary by platform, game and connection mode.',
      'Price, availability, delivery and warranty terms can change at the retailer.'
    ],
    indexable: imageRightsState === 'affiliate-authorised' && Boolean(product.images?.[0]?.src) && features.length >= 3
  };
}

async function loadSource() {
  const response = await fetch(sourceUrl, { headers: { 'user-agent': 'GR8GAMZ-Catalogue-Refresh/1.0' } });
  if (!response.ok) throw new Error(`GadgetHyper catalogue returned HTTP ${response.status}`);
  return response.json();
}

function parseJson(value) { return JSON.parse(value); }

async function main() {
  let previous = { products: [] };
  try { previous = JSON.parse(await fs.readFile(outputPath, 'utf8')); } catch {}
  const raw = sourceArg >= 0
    ? parseJson(await fs.readFile(path.resolve(process.argv[sourceArg + 1]), 'utf8'))
    : await loadSource();
  if (!Array.isArray(raw.products) || raw.products.length === 0) throw new Error('GadgetHyper catalogue contains no products');
  const currentProducts = raw.products.map(normalizeProduct);
  const currentIds = new Set(currentProducts.map((product) => product.merchantProductId));
  const retiredProducts = (previous.products || [])
    .filter((product) => !currentIds.has(product.merchantProductId))
    .map((product) => ({
      ...product,
      lifecycle: 'retired',
      availability: 'unknown',
      price: null,
      compareAtPrice: null,
      indexable: false,
      lastUpdated: checkedAt
    }));
  const products = [...currentProducts, ...retiredProducts].sort((a, b) => a.name.localeCompare(b.name));
  const slugs = new Set(products.map((product) => product.slug));
  if (slugs.size !== products.length) throw new Error('Duplicate GadgetHyper product slugs detected');
  const payload = { schemaVersion: 1, merchant: 'GadgetHyper', sourceUrl, sourceCheckedAt: checkedAt, currentProductCount: currentProducts.length, imageRightsState, imageRightsEvidence: imageRightsEvidence || null, products };
  const previousById = new Map((previous.products || []).map((product) => [product.merchantProductId, product]));
  const currentById = new Map(currentProducts.map((product) => [product.merchantProductId, product]));
  const changed = (field) => currentProducts.filter((product) => previousById.has(product.merchantProductId) && JSON.stringify(previousById.get(product.merchantProductId)?.[field]) !== JSON.stringify(product[field])).map((product) => product.slug);
  const privateReport = {
    generatedAt: new Date().toISOString(),
    source: sourceArg >= 0 ? 'authoritative-snapshot' : sourceUrl,
    previousProducts: previous.products?.length || 0,
    currentProducts: currentProducts.length,
    newProducts: currentProducts.filter((product) => !previousById.has(product.merchantProductId)).map((product) => product.slug),
    removedProducts: (previous.products || []).filter((product) => !currentById.has(product.merchantProductId)).map((product) => product.slug),
    priceChanges: changed('price'),
    salePriceChanges: changed('compareAtPrice'),
    availabilityChanges: changed('availability'),
    urlChanges: changed('destinationUrl'),
    imageChanges: changed('imageSourceUrl'),
    categoryChanges: changed('category')
  };
  const report = {
    products: products.length,
    active: products.filter((product) => product.lifecycle === 'active').length,
    soldOut: products.filter((product) => product.lifecycle === 'sold-out').length,
    retired: products.filter((product) => product.lifecycle === 'retired').length,
    indexable: products.filter((product) => product.indexable).length,
    imageRightsReviewRequired: products.filter((product) => product.imageRightsState === 'review-required').length,
    categories: Object.fromEntries(Object.keys(categoryNames).map((category) => [category, products.filter((product) => product.category === category).length]))
  };
  if (write) {
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
    await fs.mkdir(path.dirname(privateReportPath), { recursive: true });
    await fs.writeFile(privateReportPath, `${JSON.stringify(privateReport, null, 2)}\n`);
  }
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
