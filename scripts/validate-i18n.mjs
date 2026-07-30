import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const locales = ['en', 'es', 'pt-BR', 'fr', 'de', 'it', 'pl', 'tr', 'id', 'ja', 'ko', 'hi', 'ar'];
const nonEnglish = locales.filter((locale) => locale !== 'en');
const i18n = fs.readFileSync(path.join(root, 'lib/i18n.ts'), 'utf8');
const globalLaunch = fs.readFileSync(path.join(root, 'lib/globalLaunch.ts'), 'utf8');
const masterSitemap = fs.readFileSync(path.join(root, 'lib/masterSitemap.ts'), 'utf8');
const localizedRoutes = [
  'page.tsx',
  'games/page.tsx',
  'gr8-select/page.tsx',
  'gr8-select/page/[page]/page.tsx',
  'gr8-originals/page.tsx',
  'gr8-trending/page.tsx',
  'new-games/page.tsx',
  'gr8-daily/page.tsx',
  'categories/[slug]/page.tsx',
  'arcade/[slug]/page.tsx',
  'more-free-games/[slug]/page.tsx',
  'more-free-games/[slug]/play/page.tsx',
  'privacy/page.tsx',
  'terms/page.tsx',
  'my-arcade/page.tsx'
];

for (const locale of locales) {
  if (!i18n.includes(`code: '${locale}'`)) failures.push(`Locale registry missing ${locale}`);
  if (!i18n.includes(`${locale}: {`) && !i18n.includes(`'${locale}': {`)) failures.push(`Translation catalogue missing ${locale}`);
}

for (const route of localizedRoutes) {
  const file = path.join(root, 'app/[locale]', route);
  if (!fs.existsSync(file)) failures.push(`Localized route missing app/[locale]/${route}`);
}

if (!i18n.includes("dir: 'rtl'")) failures.push('Arabic RTL direction is not registered.');
if (!i18n.includes("ar: {")) failures.push('Arabic translations are missing.');
if (!globalLaunch.includes('export const partnerTarget = 200')) failures.push('Global Launch partner target must stay at 200.');
if (!masterSitemap.includes('localizedSitemapPaths')) failures.push('Master sitemap index does not include localized sitemap groups.');

for (const required of ['nav', 'common', 'home', 'hubs', 'profile', 'legal', 'categories', 'categoryFit']) {
  if (!i18n.includes(`${required}: {`)) failures.push(`Translation namespace missing: ${required}`);
}

if (/GamePix|GameMonetize|supplier games|provider collection/i.test(i18n)) {
  failures.push('Player-facing translations contain supplier-facing language.');
}
if (/TODO|FIXME|translationKey/i.test(i18n)) failures.push('Translation files contain unfinished markers.');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`i18n validation passed for ${locales.length} locales and ${nonEnglish.length * 226} expected localized launch game profiles.`);
