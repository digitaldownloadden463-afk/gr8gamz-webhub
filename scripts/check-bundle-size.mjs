import fs from 'node:fs';
import path from 'node:path';

const manifestPath = path.join(process.cwd(), '.next', 'build-manifest.json');
if (!fs.existsSync(manifestPath)) {
  console.log('Bundle check skipped: run a production build first.');
  process.exit(0);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const staticDir = path.join(process.cwd(), '.next', 'static');
const shared = new Set([...(manifest.rootMainFiles || []), ...(manifest.pages?.['/_app'] || [])]);
let total = 0;
for (const file of shared) {
  const full = path.join(staticDir, file.replace(/^\/?_next\/static\//, ''));
  if (fs.existsSync(full) && full.endsWith('.js')) total += fs.statSync(full).size;
}

const limit = 250 * 1024;
if (total > limit) {
  console.error(`Shared JS is ${(total / 1024).toFixed(1)}KB, above the ${limit / 1024}KB guardrail.`);
  process.exit(1);
}

console.log(`Shared JS guard passed: ${(total / 1024).toFixed(1)}KB.`);
