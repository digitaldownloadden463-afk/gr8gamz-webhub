import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const excluded = new Set([
  'lib/commerce/legacyCommerce.ts',
  'scripts/validate-no-razer-affiliate.mjs',
  'package.json'
]);
const excludedPrefixes = ['.git/', '.next/', 'node_modules/', 'reports/private/', '.gr8-private/', 'src/data/partnerCatalog.generated.json', 'src/data/providers/', 'public/games/'];
const extensions = new Set(['.ts', '.tsx', '.js', '.mjs', '.json', '.md', '.css', '.txt', '.xml']);
const forbidden = [
  /razer/i,
  /a9yw/i,
  /assets[23]\.razerzone\.com/i,
  /Razer Affiliate Program/i,
  /7589251/,
  /\/642901\/10229/
];
const failures = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    const relative = path.relative(root, absolute).replaceAll(path.sep, '/');
    if (excludedPrefixes.some((prefix) => relative === prefix.slice(0, -1) || relative.startsWith(prefix))) continue;
    if (entry.isDirectory()) walk(absolute);
    else if (!excluded.has(relative) && extensions.has(path.extname(entry.name))) {
      const content = fs.readFileSync(absolute, 'utf8');
      if (forbidden.some((pattern) => pattern.test(content))) failures.push(relative);
    }
  }
}

walk(root);
if (failures.length) { console.error(`Former merchant affiliate traces remain:\n${failures.join('\n')}`); process.exit(1); }
console.log('Former merchant affiliate validation passed: active public code, content, assets and tracking are clear; legacy migration mapping is isolated.');
