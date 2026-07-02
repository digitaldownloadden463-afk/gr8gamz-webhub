import fs from 'node:fs';

const requiredFiles = [
  'src/data/site.js',
  'src/data/globalSeo.js',
  'src/components/seo/GlobalKeywordPanel.js',
  'src/app/games/page.js',
  'src/app/mobile-games/page.js',
  'src/app/quick-games/page.js',
  'src/app/latest/page.js',
  'src/app/feeds/page.js',
  'src/app/browser-games-online/page.js',
  'src/app/play-online-games-free/page.js',
  'src/app/instant-games-online/page.js'
];

const requiredTerms = [
  'free online games',
  'browser games',
  'mobile games',
  'no-download',
  'worldwide',
  'quick games',
  'html5 games'
];

const missing = [];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) missing.push(`${file} missing`);
}

const combined = requiredFiles
  .filter((file) => fs.existsSync(file))
  .map((file) => fs.readFileSync(file, 'utf8').toLowerCase())
  .join('\n');

for (const term of requiredTerms) {
  if (!combined.includes(term)) {
    missing.push(`Global keyword coverage missing: ${term}`);
  }
}

if (missing.length) {
  console.error('V28 global SEO audit failed:');
  for (const item of missing) console.error(`- ${item}`);
  process.exit(1);
}

console.log('V28 global SEO audit passed.');
console.log('Global keyword, CTR priority page and route coverage checked.');
