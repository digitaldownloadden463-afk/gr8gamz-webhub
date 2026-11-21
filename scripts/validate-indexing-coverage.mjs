import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getPartnerGameProfiles, getPartnerIndexQuality } from '../src/data/partnerGameProfiles.js';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const mustContain = (path, value) => assert.ok(read(path).includes(value), `${path} must contain ${value}`);
const mustNotContain = (path, value) => assert.ok(!read(path).includes(value), `${path} must not contain ${value}`);

const profiles = getPartnerGameProfiles();
const qualityStates = { indexable: 0, 'needs-review': 0, quarantined: 0 };
for (const profile of profiles) {
  const state = getPartnerIndexQuality(profile.slug).state;
  assert.ok(state in qualityStates, `Unexpected index-quality state ${state} for ${profile.slug}`);
  qualityStates[state] += 1;
}

const nonIndexableProfiles = qualityStates['needs-review'] + qualityStates.quarantined;
assert.equal(
  qualityStates.indexable + nonIndexableProfiles,
  profiles.length,
  'Every playable partner profile must have one index-quality state'
);
assert.ok(qualityStates.indexable > 0, 'The quality gate must retain indexable partner profiles');
assert.ok(nonIndexableProfiles > 0, 'The quality gate must retain intentional review/quarantine exclusions');

mustContain('lib/sitemapXml.ts', 'getIndexableRegistryGames');
mustContain('lib/sitemapXml.ts', "game.source === 'gr8-select'");
mustContain('app/more-free-games/[slug]/page.tsx', "robots: { index: quality.state === 'indexable', follow: true }");
mustContain('app/more-free-games/[slug]/play/page.tsx', 'robots: { index: false, follow: true }');

const reciprocalEnglishRoutes = [
  'app/games/page.tsx',
  'app/gr8-originals/page.tsx',
  'app/gr8-select/page.tsx',
  'app/new-games/page.tsx',
  'app/arcade/[slug]/page.tsx',
  'app/more-free-games/[slug]/page.tsx',
  'lib/categoryPages.ts'
];
for (const path of reciprocalEnglishRoutes) mustContain(path, 'localizedAlternates');

const intentionallyNoindexLocalizedRoutes = [
  'app/[locale]/categories/[slug]/page/[page]/page.tsx',
  'app/[locale]/gr8-select/page/[page]/page.tsx',
  'app/[locale]/gr8-daily/page.tsx',
  'app/[locale]/gr8-trending/page.tsx',
  'app/[locale]/my-arcade/page.tsx'
];
for (const path of intentionallyNoindexLocalizedRoutes) {
  mustContain(path, 'robots: { index: false, follow: true }');
  mustNotContain(path, 'languages: localizedAlternates');
}

mustNotContain('lib/localizedSitemaps.ts', "pathForLocale(locale, '/my-arcade')");
mustContain('app/robots.ts', "'/api/'");
mustContain('app/robots.ts', 'sitemap: `${siteUrl}/sitemap.xml`');
mustContain('proxy.ts', 'legacyCommerceRedirects.get(pathname)');
mustNotContain('proxy.ts', 'NextResponse.redirect(new URL(`/games`');

const reconciliation = {
  playablePartnerProfiles: profiles.length,
  qualityStates,
  expectedPartnerProfileNoindex: nonIndexableProfiles,
  safeguards: {
    onlyQualityApprovedPartnerProfilesInSitemaps: true,
    profileAndPlayCanonicalRolesPreserved: true,
    hreflangReciprocityForIndexableLaunchRoutes: true,
    noHreflangOnIntentionalNoindexLocalizedRoutes: true,
    localizedMyArcadeExcludedFromSitemaps: true,
    robotsBlocksRemainNarrow: true,
    redirectsRemainExplicit: true
  }
};

console.log(JSON.stringify(reconciliation, null, 2));
console.log('Indexing coverage safeguards passed.');
