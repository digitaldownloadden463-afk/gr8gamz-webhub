import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const llms = fs.readFileSync(path.join(root, 'public/llms.txt'), 'utf8');
const routes = [...llms.matchAll(/^- (\/[^\s]+) /gm)].map((match) => match[1]);
const dynamicPrefixes = ['/arcade/{slug}', '/more-free-games/{slug}', '/more-free-games/{slug}/play', '/categories/{slug}', '/controls/{slug}'];
const allowedMachineRoutes = ['/sitemap.xml', '/sitemap-index.xml', '/sitemap-images.xml', '/robots.txt', '/feed.xml', '/feed.json', '/game-catalog.json', '/api/partner-catalog'];

function routeExists(route) {
  if (allowedMachineRoutes.includes(route)) return true;
  if (dynamicPrefixes.includes(route)) return true;
  const pagePath = route === '/' ? 'app/page.tsx' : `app${route}/page.tsx`;
  const pageJsPath = route === '/' ? 'app/page.js' : `app${route}/page.js`;
  return fs.existsSync(path.join(root, pagePath)) || fs.existsSync(path.join(root, pageJsPath));
}

for (const route of routes) {
  if (!routeExists(route)) failures.push(`llms.txt references missing route: ${route}`);
}

const publicText = [
  fs.readFileSync(path.join(root, 'public/llms.txt'), 'utf8'),
  fs.readFileSync(path.join(root, 'public/manifest.webmanifest'), 'utf8')
].join('\n');
if (/V19|V20|V30|CMS restored|feed warming|Google-ready|content engine|crawl layer|player journey/i.test(publicText)) {
  failures.push('Public discovery files contain internal launch wording.');
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Discovery validation passed for ${routes.length} llms.txt routes.`);
