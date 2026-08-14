import path from 'node:path';
import { pathToFileURL } from 'node:url';

const baseUrl = (process.env.BASE_URL || 'http://127.0.0.1:3100').replace(/\/$/, '');
const productionOrigin = 'https://www.gr8gamz.com';
const [{ commerceProducts }, { buyingGuides }, { productComparisons }] = await Promise.all([
  import(pathToFileURL(path.join(process.cwd(), 'src/data/commerce/products.ts')).href),
  import(pathToFileURL(path.join(process.cwd(), 'src/data/commerce/guides.ts')).href),
  import(pathToFileURL(path.join(process.cwd(), 'src/data/commerce/comparisons.ts')).href)
]);

const routes = [
  '/gaming-gear',
  ...new Set(commerceProducts.map((product) => `/gaming-gear/${product.category}`)),
  ...commerceProducts.map((product) => `/gaming-gear/products/${product.slug}`),
  ...buyingGuides.map((guide) => `/gaming-gear/${guide.category}/${guide.slug}`),
  ...productComparisons.map((comparison) => `/gaming-gear/${comparison.category}/${comparison.slug}`)
];
const productRoutes = new Set(commerceProducts.map((product) => `/gaming-gear/products/${product.slug}`));
const failures = [];
let jsonLdObjects = 0;
let breadcrumbObjects = 0;
let affiliateLinks = 0;

function attribute(tag, name) {
  const match = tag.match(new RegExp(`\\s${name}=(?:"([^"]*)"|'([^']*)')`, 'i'));
  return match?.[1] ?? match?.[2] ?? '';
}

function containsType(value, type) {
  if (!value || typeof value !== 'object') return false;
  if (value['@type'] === type || (Array.isArray(value['@type']) && value['@type'].includes(type))) return true;
  return Object.values(value).some((nested) => containsType(nested, type));
}

for (const route of routes) {
  const response = await fetch(`${baseUrl}${route}`, { headers: { accept: 'text/html' } });
  if (response.status !== 200) {
    failures.push(`${route} returned HTTP ${response.status}`);
    continue;
  }

  const html = await response.text();
  const expectedCanonical = `${productionOrigin}${route}`;
  const canonicalTags = html.match(/<link\b[^>]*\brel=["'][^"']*canonical[^"']*["'][^>]*>/gi) || [];
  const canonicalHref = canonicalTags.length === 1 ? attribute(canonicalTags[0], 'href') : '';
  if (canonicalHref !== expectedCanonical) failures.push(`${route} canonical mismatch: ${canonicalHref || 'missing'}`);
  if (/<meta\b[^>]*(?:name=["']robots["'][^>]*content=["'][^"']*noindex|content=["'][^"']*noindex[^"']*["'][^>]*name=["']robots["'])/i.test(html)) {
    failures.push(`${route} is unexpectedly noindex`);
  }

  const scripts = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const structuredData = [];
  for (const script of scripts) {
    try {
      structuredData.push(JSON.parse(script[1]));
      jsonLdObjects += 1;
    } catch {
      failures.push(`${route} contains malformed JSON-LD`);
    }
  }

  if (productRoutes.has(route) && structuredData.some((item) => containsType(item, 'Product'))) {
    failures.push(`${route} emits Product markup without a reliable current offer`);
  }

  const breadcrumbs = structuredData.filter((item) => containsType(item, 'BreadcrumbList'));
  if (route !== '/gaming-gear' && breadcrumbs.length !== 1) {
    failures.push(`${route} has ${breadcrumbs.length} BreadcrumbList objects`);
  }
  for (const breadcrumb of breadcrumbs) {
    breadcrumbObjects += 1;
    const elements = breadcrumb.itemListElement;
    const finalItem = Array.isArray(elements) ? elements.at(-1)?.item : '';
    if (finalItem === `${productionOrigin}/`) failures.push(`${route} final breadcrumb incorrectly points to the homepage`);
    if (finalItem !== expectedCanonical) failures.push(`${route} final breadcrumb mismatch: ${finalItem || 'missing'}`);
  }

  const affiliateAnchors = (html.match(/<a\b[^>]*>/gi) || []).filter((tag) => attribute(tag, 'href').startsWith('https://razer.a9yw.net/'));
  if (!affiliateAnchors.length) failures.push(`${route} has no tracked affiliate purchasing link`);
  for (const anchor of affiliateAnchors) {
    affiliateLinks += 1;
    const rel = new Set(attribute(anchor, 'rel').toLowerCase().split(/\s+/).filter(Boolean));
    if (!rel.has('sponsored')) failures.push(`${route} has an affiliate link without rel="sponsored"`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Commerce structured-data validation passed: ${routes.length} rendered routes, ${jsonLdObjects} JSON-LD objects, ${breadcrumbObjects} canonical breadcrumbs, ${affiliateLinks} sponsored affiliate links, and zero incomplete Product objects.`);
