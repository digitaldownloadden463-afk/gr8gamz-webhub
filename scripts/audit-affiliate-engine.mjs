import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const requiredFiles = [
  'src/data/affiliateGuides.js',
  'src/components/affiliate/AffiliateDisclosureBlock.js',
  'src/components/affiliate/AffiliateButton.js',
  'src/components/affiliate/BuyerGuideTemplate.js',
  'src/app/gaming-deals/page.js',
  'src/app/affiliate-disclosure/page.js',
  'src/app/partners/page.js'
];

const requiredRoutes = [
  'best-gaming-accessories',
  'best-mobile-game-controllers',
  'best-budget-gaming-headsets',
  'best-gaming-keyboards',
  'best-gaming-mice',
  'best-gifts-for-gamers',
  'best-gaming-gifts-under-25',
  'best-gaming-gifts-under-50',
  'best-controller-games-online',
  'best-accessories-for-browser-games',
  'best-razer-gaming-gear',
  'best-logitech-gaming-gear'
];

const failures = [];

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) failures.push(`Missing file: ${file}`);
}

for (const route of requiredRoutes) {
  const file = path.join(root, 'src/app', route, 'page.js');
  if (!fs.existsSync(file)) failures.push(`Missing guide page: /${route}`);
}

const deals = fs.readFileSync(path.join(root, 'src/app/gaming-deals/page.js'), 'utf8');
if (/Future affiliate guide/i.test(deals)) failures.push('Gaming Deals still contains old placeholder wording.');
if (!/AffiliateDisclosureBlock/.test(deals)) failures.push('Gaming Deals is missing affiliate disclosure block.');

const button = fs.readFileSync(path.join(root, 'src/components/affiliate/AffiliateButton.js'), 'utf8');
if (!/sponsored nofollow noopener/.test(button)) failures.push('AffiliateButton does not include sponsored/nofollow/noopener rel attributes.');
if (!/affiliate_click/.test(button)) failures.push('AffiliateButton does not emit affiliate_click tracking event.');

const sitemap = fs.readFileSync(path.join(root, 'src/app/sitemap.js'), 'utf8');
for (const route of requiredRoutes) {
  if (!sitemap.includes(`/${route}`)) failures.push(`Sitemap missing /${route}`);
}

if (failures.length) {
  console.error('Affiliate engine audit failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Affiliate engine audit passed: ${requiredRoutes.length} buyer-guide routes checked.`);
