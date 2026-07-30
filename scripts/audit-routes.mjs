import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const appDir = path.join(root, 'app');
const forbiddenRoutes = ['app/admin', 'app/backend', 'app/auth', 'app/passport', 'app/community', 'src/app'];

const failures = [];

for (const route of forbiddenRoutes) {
  if (fs.existsSync(path.join(root, route))) {
    failures.push(`Forbidden route tree still exists: ${route}`);
  }
}

const apiDir = path.join(root, 'app/api');
if (fs.existsSync(apiDir)) {
  const apiFiles = fs.readdirSync(apiDir, { recursive: true }).map((file) => String(file));
  const allowedApiFiles = new Set(['partner-catalog', 'partner-catalog/route.js', 'challenge', 'challenge/route.ts']);
  for (const file of apiFiles) {
    if (!allowedApiFiles.has(file)) {
      failures.push(`Unexpected public API route remains: app/api/${file}`);
    }
  }
}

const source = fs.existsSync(appDir)
  ? fs.readdirSync(appDir, { recursive: true }).filter((file) => /page\.(tsx|ts|js|jsx)$/.test(String(file)))
  : [];

for (const file of source) {
  const full = path.join(appDir, String(file));
  const text = fs.readFileSync(full, 'utf8');
  if (/Revenue game network|CMS restored|feed warming up|Google-ready|content engine|crawl layer|player journey|Passport profile|Live hub/.test(text)) {
    failures.push(`Internal or misleading copy remains in ${path.relative(root, full)}`);
  }
  if (/fake|leaderboard|chatroom/i.test(text) && !/does not|no public chat|no fake|without/.test(text)) {
    failures.push(`Potential fake/social claim remains in ${path.relative(root, full)}`);
  }
}

const nextConfigPath = path.join(root, 'next.config.js');
const nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
for (const legacy of ['/original-games', '/free-online-games']) {
  if (!nextConfig.includes(`source: '${legacy}'`)) {
    failures.push(`Missing permanent redirect for ${legacy}`);
  }
}
if (!fs.existsSync(path.join(root, 'app/quick-games/page.tsx'))) {
  failures.push('Missing active /quick-games hub');
}

const sitemapSource = [
  'lib/masterSitemap.ts',
  'lib/sitemapXml.ts',
  'app/sitemap.xml/route.ts',
  'app/sitemap-index.xml/route.ts'
].map((file) => fs.readFileSync(path.join(root, file), 'utf8')).join('\n');
const noindexFragments = ['/my-arcade', '/privacy-choices', '/play'];
for (const fragment of noindexFragments) {
  if (sitemapSource.includes(fragment)) {
    failures.push(`Sitemap includes noindex/private URL fragment: ${fragment}`);
  }
}

const duplicatePageDirs = source.reduce((map, file) => {
  const dir = path.dirname(String(file));
  map.set(dir, (map.get(dir) || 0) + 1);
  return map;
}, new Map());
for (const [dir, count] of duplicatePageDirs) {
  if (count > 1) failures.push(`Duplicate page ownership in app/${dir}`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Route audit passed for ${source.length} page files.`);
