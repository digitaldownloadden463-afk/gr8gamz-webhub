import assert from 'node:assert/strict';
import generatedPartnerCatalogue from '../src/data/partnerCatalog.generated.json' with { type: 'json' };
import generatedQuality from '../src/data/partnerIndexQuality.generated.json' with { type: 'json' };
import generatedProfiles from '../src/data/partnerProfiles.generated.json' with { type: 'json' };

assert.equal(generatedQuality.schemaVersion, 1, 'Partner index-quality cache schema is unsupported.');
assert.equal(generatedQuality.sourceCatalogueGeneratedAt, generatedPartnerCatalogue.generatedAt, 'Partner index-quality cache is stale for the current catalogue.');
assert.equal(generatedProfiles.schemaVersion, 1, 'Partner runtime-profile cache schema is unsupported.');
assert.equal(generatedProfiles.sourceCatalogueGeneratedAt, generatedPartnerCatalogue.generatedAt, 'Partner runtime-profile cache is stale for the current catalogue.');
assert.equal(generatedProfiles.profiles.length, generatedPartnerCatalogue.games.length, 'Partner runtime-profile cache count does not match the catalogue.');
assert.equal(generatedQuality.profileCount, generatedPartnerCatalogue.games.length, 'Partner index-quality cache profile count does not match the catalogue.');
assert.equal(Object.keys(generatedQuality.profiles).length, generatedPartnerCatalogue.games.length, 'Partner index-quality cache is missing profile decisions.');

for (const sample of generatedPartnerCatalogue.games.slice(0, 100)) {
  const quality = generatedQuality.profiles[sample.slug];
  const profile = generatedProfiles.profiles.find((item) => item.slug === sample.slug);
  assert(profile && profile.title && profile.path && profile.playPath, `Missing compact runtime profile for ${sample.slug}.`);
  assert(Array.isArray(quality) && quality.length === 5, `Missing or malformed quality tuple for ${sample.slug}.`);
  assert(Number.isInteger(quality[0]) && quality[0] >= 0 && quality[0] <= 100, `Invalid quality score for ${sample.slug}.`);
  assert(['indexable', 'needs-review', 'quarantined'].includes(quality[1]), `Invalid quality state for ${sample.slug}.`);
}

console.log(`Partner index-quality cache validation passed: ${generatedQuality.profileCount} deterministic decisions match the catalogue.`);
