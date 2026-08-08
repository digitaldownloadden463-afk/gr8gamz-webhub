import fs from 'node:fs';
import { isApprovedGameMonetizeArtwork, isApprovedGameMonetizeEmbed } from './providers/gamemonetize-adapter.mjs';

const catalogue = JSON.parse(fs.readFileSync('src/data/partnerCatalog.generated.json', 'utf8'));
const report = JSON.parse(fs.readFileSync('reports/gamemonetize-ingestion-report.json', 'utf8'));
const nextConfig = fs.readFileSync('next.config.js', 'utf8');
const playClient = fs.readFileSync('components/PartnerPlayClient.tsx', 'utf8');
const errors = [];
const manifest = JSON.parse(fs.readFileSync('src/data/providers/gamemonetize/manifest.json', 'utf8'));
const records = manifest.chunks.flatMap((chunk) => JSON.parse(fs.readFileSync(`src/data/providers/gamemonetize/${chunk.file}`, 'utf8')));
const sourceIds = new Set();
const published = records.filter((game) => game.status === 'verified-indexable');

if (!records.length) errors.push('No current GameMonetize records are present.');
if (records.length !== report.feedRecordsReceived) errors.push('GameMonetize feed/report totals do not reconcile.');
if (catalogue.supplierTotals?.gamemonetize !== report.feedRecordsReceived) errors.push('Supplier total does not match the current feed count.');
if (catalogue.providerActivation?.gamemonetize?.feedAccountSpecific !== false) errors.push('Publisher feed attribution is incorrectly marked account-specific.');
if (catalogue.providerActivation?.gamemonetize?.wwwCoverageVerified !== false) errors.push('www coverage must remain unverified until GameMonetize confirms it.');
if (!/frame-src[^;]*https:\/\/html5\.gamemonetize\.co/.test(nextConfig)) errors.push('CSP is missing the exact GameMonetize frame origin.');
if (!/img-src[^;]*https:\/\/img\.gamemonetize\.com/.test(nextConfig)) errors.push('CSP is missing the exact GameMonetize artwork origin.');
const cspLines = nextConfig.split('\n').map((line) => line.trim());
if (cspLines.some((line) => /frame-src.*\*\.gamemonetize|(?:script-src|connect-src).*gamemonetize/i.test(line))) errors.push('CSP grants broader GameMonetize access than the integration needs.');
if (!/provider === 'gamemonetize' && consentChoice !== 'accepted'/.test(playClient)) errors.push('GameMonetize iframe creation is not gated on accepted consent.');
if (/window\.open\s*\(/.test(playClient)) errors.push('Partner play client must not manually open advertising windows.');

for (const game of records) {
  if (!game.sourceId) errors.push(`${game.slug || 'unknown'}: missing supplier ID.`);
  if (game.status !== 'gamemonetize-duplicate') {
    if (sourceIds.has(game.sourceId)) errors.push(`${game.slug || game.sourceId}: duplicate supplier ID outside quarantine.`);
    sourceIds.add(game.sourceId);
  }
  if (!/^invalid-/.test(game.status) && (!game.title || !game.description || !game.category)) errors.push(`${game.sourceId}: missing required metadata.`);
  if (!isApprovedGameMonetizeEmbed(game.playUrl)) errors.push(`${game.sourceId}: invalid embed URL.`);
  if (!isApprovedGameMonetizeArtwork(game.artwork)) errors.push(`${game.sourceId}: invalid artwork URL.`);
}

if (published.length && !catalogue.providerActivation?.gamemonetize?.revenueAttributionVerified) {
  errors.push(`${published.length} GameMonetize games are public without verified revenue attribution.`);
}

if (errors.length) {
  console.error(errors.slice(0, 100).join('\n'));
  if (errors.length > 100) console.error(`...and ${errors.length - 100} more errors.`);
  process.exit(1);
}

console.log(`GameMonetize validation passed: ${report.feedRecordsReceived} current feed records across ${report.pagesProcessed} pages; ${published.length} published; ${records.length - published.length} safely held from publication.`);
