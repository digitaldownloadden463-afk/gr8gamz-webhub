import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import updates from '../src/data/indexnow-updates.json' with { type: 'json' };
import { organicRevenueMobileTargets, organicRevenueSprintProfileSlugs, getOrganicProfileEditorial } from '../lib/organicRevenueSprint.ts';
import { getPartnerGameProfile, getPartnerIndexQuality } from '../src/data/partnerGameProfiles.js';

const root = process.cwd();
const uniqueSlugs = new Set(organicRevenueSprintProfileSlugs);
assert.equal(organicRevenueSprintProfileSlugs.length, 15, 'The first wave must remain limited to 15 profile pages.');
assert.equal(uniqueSlugs.size, organicRevenueSprintProfileSlugs.length, 'Profile sprint slugs must be unique.');
assert.equal(new Set(organicRevenueMobileTargets).size, organicRevenueMobileTargets.length, 'Mobile target links must be unique.');

const descriptions = new Set();
for (const slug of organicRevenueSprintProfileSlugs) {
  const profile = getPartnerGameProfile(slug);
  const quality = getPartnerIndexQuality(slug);
  const editorial = getOrganicProfileEditorial(slug);
  assert(profile, `Missing partner profile: ${slug}`);
  assert.equal(quality.state, 'indexable', `Sprint target is not currently indexable: ${slug}`);
  assert(editorial, `Missing editorial override: ${slug}`);
  assert(editorial.summary.length >= 80, `Summary is too thin: ${slug}`);
  assert(editorial.howToPlay.length >= 70, `How-to-play copy is too thin: ${slug}`);
  assert.equal(editorial.highlights.length, 3, `Expected three factual highlights: ${slug}`);
  assert(!descriptions.has(editorial.summary), `Duplicate sprint summary: ${slug}`);
  descriptions.add(editorial.summary);
  for (const value of [editorial.displayTitle, editorial.summary, editorial.controls, editorial.deviceFit, editorial.howToPlay, editorial.whyPlay, ...editorial.highlights]) {
    assert(!/\b(?:best game|top-rated|most popular|everyone|guaranteed|addictive|provider|supplier|search engine|SEO)\b/i.test(value), `Unsupported or internal claim in ${slug}: ${value}`);
  }
}

const expectedPaths = [
  '/games',
  '/categories/action',
  '/categories/sports',
  '/mobile-games',
  ...organicRevenueSprintProfileSlugs.map((slug) => `/more-free-games/${slug}`)
];
assert.deepEqual(updates.paths, expectedPaths, 'IndexNow changed-URL manifest must match the reviewed sprint set and order.');

const profileSource = fs.readFileSync(path.join(root, 'app/more-free-games/[slug]/page.tsx'), 'utf8');
const gamesSource = fs.readFileSync(path.join(root, 'app/games/page.tsx'), 'utf8');
const mobileSource = fs.readFileSync(path.join(root, 'app/mobile-games/page.tsx'), 'utf8');
const categorySource = fs.readFileSync(path.join(root, 'components/CategoryDirectory.tsx'), 'utf8');
assert(profileSource.includes('getOrganicProfileEditorial'), 'Profile metadata and copy must use the reviewed editorial overrides.');
assert(gamesSource.includes('organicRevenueSprintProfileSlugs.slice(0, 8)'), 'The game directory must retain its bounded eight-guide link set.');
assert(mobileSource.includes('organicRevenueMobileTargets'), 'The mobile hub must retain its evidence-backed guide links.');
assert(categorySource.includes('getOrganicProfilesForCategory'), 'Category hubs must retain contextual profile-guide links.');

const pseoHashes = {
  'src/data/pseoIntents.generated.json': 'bdf0c8082c571983561d7a222f12eb5f2c937355842f027afc91a27b175f3088',
  'reports/pseo-batch-1-summary.json': '203c9dbb0f3f0f70ba462d2aeafa2c50b99da64e6cb3c9fa8778f6a6d20a8dc3'
};
for (const [file, expected] of Object.entries(pseoHashes)) {
  const actual = crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
  assert.equal(actual, expected, `Protected pSEO Batch 1 artifact changed: ${file}`);
}

console.log(`Organic revenue sprint validation passed: ${expectedPaths.length} changed URLs, ${organicRevenueSprintProfileSlugs.length} profile improvements, protected pSEO hashes unchanged.`);
