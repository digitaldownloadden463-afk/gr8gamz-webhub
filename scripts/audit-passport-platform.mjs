import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'src/app/passport/page.js',
  'src/app/passport/signup/page.js',
  'src/app/my-arcade/page.js',
  'src/app/badges/page.js',
  'src/app/daily-challenge/page.js',
  'src/app/community/page.js',
  'src/app/community-guidelines/page.js',
  'src/app/api/passport/status/route.js',
  'src/components/passport/PassportHeroCard.js',
  'src/components/passport/MyArcadeDashboard.js',
  'src/lib/passportClient.js',
  'src/data/passport.js',
  'database/gr8-passport-schema.sql'
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) {
  console.error('V31 Passport audit failed. Missing files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const header = fs.readFileSync(path.join(root, 'src/components/Header.js'), 'utf8');
const crawl = fs.readFileSync(path.join(root, 'src/lib/crawl.js'), 'utf8');
const privacy = fs.readFileSync(path.join(root, 'src/app/privacy/page.js'), 'utf8');
const passportClient = fs.readFileSync(path.join(root, 'src/lib/passportClient.js'), 'utf8');

const checks = [
  ['Header links GR8 Passport component', header.includes('PassportNavBadge')],
  ['Sitemap includes /passport', crawl.includes("'/passport'")],
  ['Sitemap includes /community', crawl.includes("'/community'")],
  ['Privacy mentions GR8 Passport', privacy.includes('GR8 Passport')],
  ['Passport does not import third-party auth', !passportClient.includes('@clerk') && !passportClient.includes('supabase') && !passportClient.includes('firebase')],
  ['Passport has local storage keys', passportClient.includes('gr8gamz_passport') && passportClient.includes('gr8gamz_favourites')]
];

const failed = checks.filter(([, ok]) => !ok);
if (failed.length) {
  console.error('V31 Passport audit failed:');
  for (const [name] of failed) console.error(`- ${name}`);
  process.exit(1);
}

console.log('V31 Passport audit passed. In-house player platform foundation files are present.');
