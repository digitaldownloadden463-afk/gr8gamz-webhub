import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const [{ commerceProducts }, { buyingGuides }, { productComparisons }, { keywordOpportunities }] = await Promise.all([
  import(pathToFileURL(path.join(root, 'src/data/commerce/products.ts')).href),
  import(pathToFileURL(path.join(root, 'src/data/commerce/guides.ts')).href),
  import(pathToFileURL(path.join(root, 'src/data/commerce/comparisons.ts')).href),
  import(pathToFileURL(path.join(root, 'src/data/commerce/keyword-opportunities.ts')).href)
]);

const errors = [];
const productSlugs = new Set();
const routePaths = new Set(['/gaming-gear']);
const graph = new Map([['/gaming-gear', new Set()]]);
const addEdge = (from, to) => {
  if (!graph.has(from)) graph.set(from, new Set());
  graph.get(from).add(to);
};

for (const product of commerceProducts) {
  if (productSlugs.has(product.slug)) errors.push(`Duplicate product slug: ${product.slug}`);
  productSlugs.add(product.slug);
  routePaths.add(`/gaming-gear/products/${product.slug}`);
  graph.set(`/gaming-gear/products/${product.slug}`, new Set());
  if (!product.id || !product.merchantProductId || product.merchant !== 'razer') errors.push(`Invalid identity: ${product.slug}`);
  if (!/^https:\/\/www\.razer\.com\/gb-en\//.test(product.destinationUrl)) errors.push(`Unapproved destination: ${product.slug}`);
  if (!/^https:\/\/assets3\.razerzone\.com\//.test(product.image)) errors.push(`Unapproved image: ${product.slug}`);
  if (product.price !== null) errors.push(`Static price is not permitted without a feed: ${product.slug}`);
  if (!product.keyFeatures?.length || !product.shortDescription || !product.bestFor) errors.push(`Incomplete content: ${product.slug}`);
}

for (const page of [...buyingGuides, ...productComparisons]) {
  const route = `/gaming-gear/${page.category}/${page.slug}`;
  if (routePaths.has(route)) errors.push(`Duplicate commercial route: ${route}`);
  routePaths.add(route);
  graph.set(route, new Set());
  for (const slug of page.productSlugs) if (!productSlugs.has(slug)) errors.push(`Unknown product ${slug} in ${route}`);
}

const categoryRoutes = new Set(commerceProducts.map((product) => `/gaming-gear/${product.category}`));
for (const categoryRoute of categoryRoutes) {
  routePaths.add(categoryRoute);
  graph.set(categoryRoute, new Set());
  addEdge('/gaming-gear', categoryRoute);
}
for (const product of commerceProducts) addEdge(`/gaming-gear/${product.category}`, `/gaming-gear/products/${product.slug}`);
for (const guide of buyingGuides) {
  const route = `/gaming-gear/${guide.category}/${guide.slug}`;
  addEdge(`/gaming-gear/${guide.category}`, route);
  for (const productSlug of guide.productSlugs) addEdge(route, `/gaming-gear/products/${productSlug}`);
}
for (const comparison of productComparisons) {
  const route = `/gaming-gear/${comparison.category}/${comparison.slug}`;
  addEdge(`/gaming-gear/${comparison.category}`, route);
  for (const productSlug of comparison.productSlugs) addEdge(route, `/gaming-gear/products/${productSlug}`);
}

const visited = new Set(['/gaming-gear']);
const queue = [{ route: '/gaming-gear', depth: 0 }];
let maxDepth = 0;
while (queue.length) {
  const current = queue.shift();
  maxDepth = Math.max(maxDepth, current.depth);
  for (const target of graph.get(current.route) || []) {
    if (!routePaths.has(target)) errors.push(`Broken commerce target: ${target}`);
    if (!visited.has(target)) {
      visited.add(target);
      queue.push({ route: target, depth: current.depth + 1 });
    }
  }
}
const orphanRoutes = [...routePaths].filter((route) => !visited.has(route));
for (const route of orphanRoutes) errors.push(`Orphan commerce route: ${route}`);

if (process.env.COMMERCE_NETWORK_CHECK === 'true') {
  for (let index = 0; index < commerceProducts.length; index += 3) {
    const batch = commerceProducts.slice(index, index + 3);
    const results = await Promise.all(batch.map(async (product) => {
      try {
        const response = await fetch(product.destinationUrl, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(15_000) });
        return { product, response };
      } catch (error) {
        return { product, error };
      }
    }));
    for (const result of results) {
      if (result.error || !result.response?.ok) errors.push(`Broken merchant destination: ${result.product.slug}`);
      else if (new URL(result.response.url).hostname !== 'www.razer.com') errors.push(`Unexpected merchant redirect: ${result.product.slug}`);
    }
  }
}

const sourceText = [
  'app/gaming-gear/page.tsx',
  'app/gaming-gear/[category]/page.tsx',
  'app/gaming-gear/[category]/[slug]/page.tsx',
  'app/gaming-gear/products/[slug]/page.tsx'
].map((file) => fs.readFileSync(path.join(root, file), 'utf8')).join('\n');

if (!sourceText.includes('AffiliateDisclosure')) errors.push('Commercial pages are missing affiliate disclosures');
if (/AggregateRating|Review"|we tested|our testing/i.test(sourceText)) errors.push('Unsupported review or testing claim found');

const selectedKeywords = keywordOpportunities.filter((item) => item.selected);
const report = {
  generatedAt: new Date().toISOString(),
  merchant: 'razer',
  products: commerceProducts.length,
  categories: [...new Set(commerceProducts.map((product) => product.category))].length,
  buyingGuides: buyingGuides.length,
  comparisons: productComparisons.length,
  indexableRoutes: routePaths.size,
  internalEdges: [...graph.values()].reduce((sum, edges) => sum + edges.size, 0),
  orphanRoutes: orphanRoutes.length,
  maximumDepth: maxDepth,
  affiliateLinksValidated: commerceProducts.length,
  brokenLinks: errors.filter((error) => /destination|Unknown product/.test(error)).length,
  selectedKeywords: selectedKeywords.length,
  rejectedKeywords: keywordOpportunities.length - selectedKeywords.length,
  pricesStored: commerceProducts.filter((product) => product.price !== null).length,
  errors
};

fs.mkdirSync(path.join(root, 'reports'), { recursive: true });
fs.writeFileSync(path.join(root, 'reports/commerce-report.json'), `${JSON.stringify(report, null, 2)}\n`);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Commerce validation passed: ${report.products} products, ${report.buyingGuides} guides, ${report.comparisons} comparisons, ${report.indexableRoutes} routes.`);
