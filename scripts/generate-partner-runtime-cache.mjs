import fs from 'node:fs';
import path from 'node:path';
import { allPartnerGameProfiles, partnerCatalogueReport } from '../src/data/partnerGameProfiles.js';
import { buildPartnerIndexQuality } from '../lib/partnerIndexQuality.js';
import { matchesHubRule } from '../lib/gameHubRules.ts';
import generatedPartnerCatalogue from '../src/data/partnerCatalog.generated.json' with { type: 'json' };

const publicProfileKeys = [
  'title', 'provider', 'category', 'intent', 'rank', 'slug', 'image', 'artwork', 'path', 'playPath',
  'difficulty', 'bestFor', 'controls', 'description', 'whyPicked', 'howToPlay', 'deviceFit', 'playUrl',
  'width', 'height', 'sourceId', 'sourceAttribution', 'lastChecked', 'qaStatus', 'keywords', 'tags', 'faqs'
];

const profiles = allPartnerGameProfiles.map((profile) => Object.fromEntries(
  publicProfileKeys.flatMap((key) => profile[key] === undefined ? [] : [[key, profile[key]]])
));
const profilePayload = {
  schemaVersion: 1,
  sourceCatalogueGeneratedAt: partnerCatalogueReport.generatedAt,
  catalogueReport: partnerCatalogueReport,
  profiles
};
fs.writeFileSync(path.join(process.cwd(), 'src/data/partnerProfiles.generated.json'), `${JSON.stringify(profilePayload)}\n`);

const quality = buildPartnerIndexQuality(allPartnerGameProfiles);
const qualityProfiles = Object.fromEntries([...quality.entries()].map(([slug, item]) => [slug, [
  item.score,
  item.state,
  item.reasons,
  item.hardFailures,
  item.brandReview || null
]]));
const qualityPayload = {
  schemaVersion: 1,
  sourceCatalogueGeneratedAt: partnerCatalogueReport.generatedAt,
  profileCount: allPartnerGameProfiles.length,
  profiles: qualityProfiles
};
fs.writeFileSync(path.join(process.cwd(), 'src/data/partnerIndexQuality.generated.json'), `${JSON.stringify(qualityPayload)}\n`);

const hubIds = ['car', 'two-player', 'io', 'dress-up', 'shooting', 'word'];
const eligibleSlugs = new Set(allPartnerGameProfiles.map((profile) => profile.slug));
const hubCounts = Object.fromEntries(hubIds.map((id) => [id, 0]));
const classificationRecords = {};
for (const game of generatedPartnerCatalogue.games) {
  if (!eligibleSlugs.has(game.slug)) continue;
  let membershipMask = 0;
  hubIds.forEach((id, index) => {
    if (!matchesHubRule(id, game)) return;
    membershipMask |= 1 << index;
    hubCounts[id] += 1;
  });
  if (membershipMask) classificationRecords[game.slug] = [membershipMask, game.sourceCategory || '', game.tags || []];
}
const classificationPayload = {
  schemaVersion: 1,
  sourceCatalogueGeneratedAt: partnerCatalogueReport.generatedAt,
  eligibleProfileCount: eligibleSlugs.size,
  hubs: hubIds,
  counts: hubCounts,
  records: classificationRecords
};
fs.writeFileSync(path.join(process.cwd(), 'src/data/partnerHubClassification.generated.json'), `${JSON.stringify(classificationPayload)}\n`);

console.log(`Generated compact runtime profiles, quality decisions and hub classification for ${profiles.length} partner games.`);
