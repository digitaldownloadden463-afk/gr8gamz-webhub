import fs from 'node:fs';

const catalogue = JSON.parse(fs.readFileSync('src/data/partnerCatalog.generated.json', 'utf8'));
const minimum = Number.parseInt(process.env.GR8_MIN_INDEXABLE_PARTNERS || '2000', 10);
const errors = [];
const slugs = new Set();
const fingerprints = new Set();

if (!Array.isArray(catalogue.games)) errors.push('Generated catalogue games array is missing.');
if ((catalogue.totals?.verifiedIndexable || 0) < minimum) errors.push(`Only ${catalogue.totals?.verifiedIndexable || 0} verified-indexable partner profiles; expected ${minimum}.`);

for (const game of catalogue.games || []) {
  if (game.status !== 'verified-indexable' || !game.indexable) errors.push(`${game.slug}: not marked verified-indexable.`);
  if (!game.slug || slugs.has(game.slug)) errors.push(`${game.slug}: duplicate or missing slug.`);
  slugs.add(game.slug);
  if (!game.fingerprint || fingerprints.has(game.fingerprint)) errors.push(`${game.slug}: duplicate or missing fingerprint.`);
  fingerprints.add(game.fingerprint);
  if (!game.path?.startsWith('/more-free-games/')) errors.push(`${game.slug}: invalid profile path.`);
  if (!game.playPath?.endsWith('/play')) errors.push(`${game.slug}: invalid play path.`);
  if (!game.artwork?.startsWith('https://')) errors.push(`${game.slug}: primary artwork is not a crawlable HTTPS URL.`);
  if (!game.playUrl?.startsWith('https://')) errors.push(`${game.slug}: play URL is not HTTPS.`);
  if (!game.description || game.description.length < 80) errors.push(`${game.slug}: description is too thin.`);
  if (!game.qaCheckedAt) errors.push(`${game.slug}: missing QA timestamp.`);
}

if (errors.length) {
  console.error(errors.slice(0, 50).join('\n'));
  if (errors.length > 50) console.error(`...and ${errors.length - 50} more errors.`);
  process.exit(1);
}

console.log(`Partner catalogue validation passed: ${catalogue.games.length} verified-indexable profiles, ${catalogue.totals?.duplicates || 0} duplicates removed, ${catalogue.totals?.quarantined || 0} quarantined.`);
