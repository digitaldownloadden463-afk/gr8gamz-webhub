import fs from 'node:fs';

const files = [
  'app/gaming-gear/page.tsx',
  'app/gaming-gear/[category]/page.tsx',
  'app/gaming-gear/[category]/[slug]/page.tsx',
  'app/gaming-gear/products/[slug]/page.tsx',
  'components/commerce/CommerceBreadcrumbs.tsx'
];
const source = files.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
const errors = [];
for (const type of ['BreadcrumbList', 'ItemList', 'CollectionPage', 'Product']) if (!source.includes(type)) errors.push(`Missing ${type} structured-data implementation`);
if (/AggregateRating|Review|ratingValue|reviewCount/.test(source)) errors.push('Unsupported review or rating structured data found');
if (/priceCurrency|availability.*schema\.org|offers:/.test(source)) errors.push('Volatile offer data is emitted in Product structured data');
if (!source.includes("alternates: { canonical:")) errors.push('Commerce canonical metadata is missing');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('Commerce structured-data validation passed: truthful breadcrumb, collection, item-list and offer-free Product models are present.');
