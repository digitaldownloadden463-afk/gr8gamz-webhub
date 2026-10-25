import fs from 'node:fs';
import path from 'node:path';
import { allPartnerGameProfiles, partnerCatalogueReport } from '../src/data/partnerGameProfiles.js';
import { buildPartnerIndexQuality } from '../lib/partnerIndexQuality.js';

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

console.log(`Generated compact runtime profiles and quality decisions for ${profiles.length} partner games.`);
