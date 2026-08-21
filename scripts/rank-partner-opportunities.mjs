import fs from 'node:fs';
import path from 'node:path';
import { loadPartnerGames, parseCsv, rankPartnerOpportunities } from './lib/partner-opportunity-engine.mjs';

const args = new Map();
for (let index = 2; index < process.argv.length; index += 2) args.set(process.argv[index], process.argv[index + 1]);
const input = args.get('--input');
if (!input) {
  console.error('Usage: pnpm run opportunities:partners -- --input <search-console.csv> [--output <report.json>]');
  process.exit(1);
}
const output = args.get('--output') || path.join('reports', 'partner-opportunities.json');
const rows = parseCsv(fs.readFileSync(input, 'utf8'));
const games = loadPartnerGames(path.join(process.cwd(), 'src/data/partnerCatalog.generated.json'));
const report = rankPartnerOpportunities(rows, games, 20);
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Ranked ${report.sourceRows} rows: ${report.matchedRows} matched partner profiles. Report: ${output}`);
