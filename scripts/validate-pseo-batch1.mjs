import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const DATA_PATH = path.join(ROOT, 'src/data/pseoIntents.generated.json');
const MASTER_SITEMAP_PATH = path.join(ROOT, 'lib/masterSitemap.ts');
const GAMES_PAGE_PATH = path.join(ROOT, 'app/games/page.tsx');
const PUBLIC_SUMMARY_PATH = path.join(ROOT, 'reports/pseo-batch-1-summary.json');
const GITIGNORE_PATH = path.join(ROOT, '.gitignore');
const REQUIRED_FILES = [
  'app/games/[slug]/page.tsx',
  'app/games/[slug]/page/[page]/page.tsx',
  'app/games/collections/page.tsx',
  'app/sitemaps/pseo-batch-1.xml/route.ts',
  'components/PseoIntentDirectory.tsx',
  'lib/pseoIntents.ts',
  'lib/pseoPages.ts',
];

const forbiddenPublicPattern = /\b(?:SEO|keyword|search intent|indexable|canonical keyword|GSC|SERP|GamePix|GameMonetize|supplier|source category|catalogue evidence|partner catalogue|partner profile)\b/i;
const blockedIntentPattern = /\b(?:unblocked|school|chromebook|gambling|betting|casino|hack|cheat|adult|kids?|children|toddler|baby|princess|gamepix|gamemonetize|fortnite|mario|minecraft|pokemon|barbie|batman|naruto|spongebob|spider[\s-]?man|sonic|superman|dragon ball|paw patrol|peppa pig|angry birds|among us)\b/i;

function fail(message) {
  console.error(`PSEO validation failed: ${message}`);
  process.exitCode = 1;
}

function normalize(value = '') {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function semanticIntentKey(value = '') {
  return normalize(value)
    .replace(/\b(?:shooting|shooter|shoot)\b/g, 'shoot')
    .replace(/\b(?:jumping|jump)\b/g, 'jump')
    .replace(/\b(?:tanks|tank)\b/g, 'tank')
    .replace(/\b(?:cars|car)\b/g, 'car')
    .replace(/\b(?:bikes|bike)\b/g, 'bike')
    .replace(/\b(?:soccer|football)\b/g, 'football')
    .replace(/\b(?:billiards|pool)\b/g, 'pool')
    .replace(/\b(?:two player|2 player)\b/g, '2player')
    .replace(/\bgames?\b/g, '')
    .split(' ')
    .filter(Boolean)
    .sort()
    .join(' ');
}

function tokenOverlap(left, right) {
  const ignored = new Set(['free', 'online', 'browser', 'game', 'games', 'play', 'for', 'the', 'and']);
  const a = new Set(normalize(left).split(' ').filter((token) => token && !ignored.has(token)));
  const b = new Set(normalize(right).split(' ').filter((token) => token && !ignored.has(token)));
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  for (const token of a) if (b.has(token)) intersection += 1;
  return intersection / Math.max(1, Math.min(a.size, b.size));
}

function jaccard(left, right) {
  if (!left.size || !right.size) return 0;
  let intersection = 0;
  const smaller = left.size <= right.size ? left : right;
  const larger = smaller === left ? right : left;
  for (const item of smaller) if (larger.has(item)) intersection += 1;
  return intersection / (left.size + right.size - intersection);
}

function shingles(value, size = 5) {
  const words = normalize(value).split(' ').filter(Boolean);
  const out = new Set();
  for (let index = 0; index <= words.length - size; index += 1) out.add(words.slice(index, index + size).join(' '));
  return out;
}

for (const file of REQUIRED_FILES) {
  if (!fs.existsSync(path.join(ROOT, file))) fail(`missing ${file}`);
}
if (!fs.existsSync(DATA_PATH)) fail('missing generated pSEO data');
if (!fs.existsSync(PUBLIC_SUMMARY_PATH)) fail('missing public Batch 1 summary');

const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
const publicSummary = JSON.parse(fs.readFileSync(PUBLIC_SUMMARY_PATH, 'utf8'));
const intents = Array.isArray(data.intents) ? data.intents : [];
if (!intents.length) fail('generated pSEO intent list is empty; run pnpm run generate:pseo-batch1');
if (intents.length > data.targetSize) fail(`accepted ${intents.length} intents but target is ${data.targetSize}`);
if (data.qualitySummary?.accepted !== intents.length) fail('quality summary accepted count does not match generated intents');
if (data.qualitySummary?.rejected !== data.candidateCount - intents.length) fail('candidate/rejection accounting does not balance');
const rejectionTotal = Object.values(data.qualitySummary?.rejectedReasons || {}).reduce((sum, count) => sum + Number(count || 0), 0);
if (rejectionTotal !== data.qualitySummary?.rejected) fail(`rejection reason total ${rejectionTotal} does not match rejected count ${data.qualitySummary?.rejected}`);
if (publicSummary.accepted !== intents.length || publicSummary.candidates !== data.candidateCount) fail('public summary counts do not match generated data');
if (JSON.stringify(publicSummary).match(/\b(?:queries|clicks|impressions|ctrPercent|position|opportunityScore)\b/)) fail('private Search Console metrics leaked into public summary');

const gitignore = fs.readFileSync(GITIGNORE_PATH, 'utf8');
if (!gitignore.includes('.gr8-private/') || !gitignore.includes('reports/private/')) fail('private evidence directories are not Git-ignored');

const profileModule = await import(pathToFileURL(path.join(ROOT, 'src/data/partnerGameProfiles.js')).href);
const indexableGameIds = new Set(
  profileModule.getPartnerGameProfiles()
    .filter((profile) => profileModule.getPartnerIndexQuality(profile.slug).state === 'indexable')
    .map((profile) => `select:${profile.provider}:${profile.slug}`)
);
const originalsRaw = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/games.json'), 'utf8'));
for (const game of Array.isArray(originalsRaw) ? originalsRaw : originalsRaw.games || []) indexableGameIds.add(`original:${game.slug || game.id}`);

const uniqueFields = [
  ['slug', new Set()],
  ['primaryKeyword', new Set()],
  ['title', new Set()],
  ['h1', new Set()],
  ['description', new Set()],
  ['inventoryFingerprint', new Set()],
];
const semanticIntentKeys = new Set();

for (const intent of intents) {
  if (!intent.qualityApproved) fail(`${intent.slug}: not quality approved`);
  if (!Number.isInteger(intent.inventoryCount) || intent.inventoryCount < data.minimumInventory) fail(`${intent.slug}: thin inventory ${intent.inventoryCount}`);
  if (!Array.isArray(intent.gameIds) || new Set(intent.gameIds).size !== intent.inventoryCount) fail(`${intent.slug}: game ID count does not match inventoryCount`);
  if (intent.gameIds.some((id) => !indexableGameIds.has(id))) fail(`${intent.slug}: contains a non-indexable or unknown game ID`);
  if (!Array.isArray(intent.relatedSlugs) || intent.relatedSlugs.some((slug) => slug === intent.slug)) fail(`${intent.slug}: invalid related collection links`);
  if (intent.title.length < 25 || intent.title.length > 70) fail(`${intent.slug}: title length ${intent.title.length}`);
  if (intent.description.length < 80 || intent.description.length > 175) fail(`${intent.slug}: description length ${intent.description.length}`);
  if (intent.h1.length < 20 || intent.h1.length > 110) fail(`${intent.slug}: H1 length ${intent.h1.length}`);
  const publicCopy = [intent.title, intent.description, intent.h1, intent.introduction, intent.selectionNote, intent.deviceGuidance, intent.controlsGuidance, intent.sessionGuidance].join(' ');
  if (forbiddenPublicPattern.test(publicCopy)) fail(`${intent.slug}: internal/SEO language leaked into player-facing copy`);
  if (blockedIntentPattern.test(`${intent.primaryKeyword} ${intent.slug} ${publicCopy}`)) fail(`${intent.slug}: blocked modifier or unsafe term survived generation`);
  const semanticKey = semanticIntentKey(intent.primaryKeyword);
  if (semanticIntentKeys.has(semanticKey)) fail(`${intent.slug}: semantic intent duplicates another generated collection`);
  semanticIntentKeys.add(semanticKey);
  if (!Number.isInteger(intent.priority) || intent.priority < 1) fail(`${intent.slug}: invalid priority`);
  if (!['direct-gsc', 'serp-reviewed-cluster', 'proven-gr8-cluster', 'deep-catalogue-intersection'].includes(intent.evidenceClass)) fail(`${intent.slug}: missing acceptable evidence class`);

  for (const [field, seen] of uniqueFields) {
    const value = normalize(intent[field]);
    if (seen.has(value)) fail(`${intent.slug}: duplicate ${field}`);
    seen.add(value);
  }

}

const knownSlugs = new Set(intents.map((intent) => intent.slug));
for (const intent of intents) {
  for (const related of intent.relatedSlugs) if (!knownSlugs.has(related)) fail(`${intent.slug}: missing related slug ${related}`);
}

for (let i = 0; i < intents.length; i += 1) {
  const left = intents[i];
  const leftSet = new Set(left.gameIds);
  const leftCopy = shingles([left.introduction, left.selectionNote, left.deviceGuidance, left.controlsGuidance, left.sessionGuidance].join(' '));
  for (let j = i + 1; j < intents.length; j += 1) {
    const right = intents[j];
    const ratio = Math.min(left.inventoryCount, right.inventoryCount) / Math.max(left.inventoryCount, right.inventoryCount);
    if (ratio >= 0.72 && tokenOverlap(left.primaryKeyword, right.primaryKeyword) >= 0.5 && jaccard(leftSet, new Set(right.gameIds)) >= 0.82) {
      fail(`${left.slug} and ${right.slug}: site-wide near-duplicate inventory survived the quality gate`);
    }
    const copySimilarity = jaccard(leftCopy, shingles([right.introduction, right.selectionNote, right.deviceGuidance, right.controlsGuidance, right.sessionGuidance].join(' ')));
    if (copySimilarity >= 0.84) fail(`${left.slug} and ${right.slug}: editorial copy is too similar (${copySimilarity.toFixed(2)})`);
  }
}

const masterSitemap = fs.readFileSync(MASTER_SITEMAP_PATH, 'utf8');
if (!masterSitemap.includes('/sitemaps/pseo-batch-1.xml')) fail('master sitemap does not include pSEO Batch 1');
const gamesPage = fs.readFileSync(GAMES_PAGE_PATH, 'utf8');
if (!gamesPage.includes('/games/collections')) fail('/games does not link to the pSEO collection directory');
const pageModel = fs.readFileSync(path.join(ROOT, 'lib/pseoPages.ts'), 'utf8');
const collectionDirectory = fs.readFileSync(path.join(ROOT, 'app/games/collections/page.tsx'), 'utf8');
const sitemapRoute = fs.readFileSync(path.join(ROOT, 'app/sitemaps/pseo-batch-1.xml/route.ts'), 'utf8');
const pseoComponent = fs.readFileSync(path.join(ROOT, 'components/PseoIntentDirectory.tsx'), 'utf8');
if (!pageModel.includes("robots: { index: true, follow: true }") || !pageModel.includes("robots: { index: false, follow: true }")) fail('first-page or pagination robots policy is missing');
if (!pageModel.includes("canonical(pseoIntentPath(intent.slug, page))")) fail('pagination does not self-canonicalise');
for (const schemaType of ['BreadcrumbList', 'CollectionPage', 'ItemList']) if (!pageModel.includes(`'@type': '${schemaType}'`)) fail(`missing ${schemaType} structured data`);
if (/AggregateRating|['"]Review['"]/.test(pageModel + pseoComponent)) fail('fabricated review/rating schema exists in pSEO output');
if (!collectionDirectory.includes('robots: { index: false, follow: true }')) fail('/games/collections must remain noindex,follow');
if (!collectionDirectory.includes('getActivePseoIntents')) fail('/games/collections is not generated from all approved intents');
if (!sitemapRoute.includes('getActivePseoIntents') || /page\W*\+|page\/\$\{/.test(sitemapRoute)) fail('pSEO sitemap is not restricted to approved first-page URLs');
if (!pseoComponent.includes('CompactPagination') || !pseoComponent.includes('previousHref') || !pseoComponent.includes('nextHref')) fail('pSEO pagination is not sequential and crawlable');
if (!pseoComponent.includes('discovery-upper-content') || !pseoComponent.includes('discovery-mid-content') || !pseoComponent.includes('discovery-lower-content')) fail('controlled AdSense placement structure is incomplete');

const publicDataText = fs.readFileSync(DATA_PATH, 'utf8');
if (/"(?:queries|clicks|impressions|ctrPercent|position|opportunityScore)"\s*:/.test(publicDataText)) fail('private Search Console evidence leaked into generated public page data');

if (!process.exitCode) {
  const counts = intents.map((intent) => intent.inventoryCount).sort((left, right) => left - right);
  console.log(`PSEO Batch 1 validation passed: ${intents.length} quality-approved pages, minimum inventory ${counts[0]}.`);
  console.log(`Candidate proposals: ${data.candidateCount}. Exact inventory fingerprints: ${new Set(intents.map((intent) => intent.inventoryFingerprint)).size}.`);
  if (intents.length < data.targetSize) console.log(`Quality-first note: ${intents.length}/${data.targetSize} pages qualified; the generator did not force thin pages to hit the target.`);
}
