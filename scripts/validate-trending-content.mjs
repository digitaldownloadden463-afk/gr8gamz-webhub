import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const articlePath = path.join(root, 'app/gr8-daily/gta-6-pc-free-browser-games/page.tsx');
const article = fs.readFileSync(articlePath, 'utf8');
const gamesPage = fs.readFileSync(path.join(root, 'app/games/page.tsx'), 'utf8');
const sitemap = fs.readFileSync(path.join(root, 'lib/sitemapXml.ts'), 'utf8');
const nextConfig = fs.readFileSync(path.join(root, 'next.config.js'), 'utf8');
const profiles = JSON.parse(fs.readFileSync(path.join(root, 'src/data/partnerProfiles.generated.json'), 'utf8'));
const profileSlugs = new Set(profiles.profiles.map((profile) => profile.slug));
const failures = [];

const requiredHubs = ['ragdoll-games', 'merge-games', 'asmr-games', 'parking-games', 'brainrot-games', 'obby-games'];
for (const hub of requiredHubs) {
  if (!gamesPage.includes(`href="/${hub}"`)) failures.push(`Games directory does not link to /${hub}`);
}
if (!gamesPage.includes('href="/games/block-puzzle-games"')) failures.push('Games directory does not strengthen the block-puzzle collection');

const gameLinks = [...article.matchAll(/href: '\/more-free-games\/([^']+)'/g)].map((match) => match[1]);
if (gameLinks.length !== 12) failures.push(`GTA guide must contain exactly 12 reviewed game links; found ${gameLinks.length}`);
for (const slug of gameLinks) {
  if (!profileSlugs.has(slug)) failures.push(`GTA guide links to a missing or ineligible game profile: ${slug}`);
}

for (const requiredText of [
  "robots: { index: true, follow: true }",
  'No Windows PC release date has been announced.',
  'Rockstar&apos;s official GTA VI page',
  'GR8 GAMZ is not affiliated with, endorsed by or sponsored by Rockstar Games or Take-Two Interactive.',
  'Original GR8 GAMZ editorial illustration.',
  "'@type': 'NewsArticle'"
]) {
  if (!article.includes(requiredText)) failures.push(`GTA guide is missing required review text: ${requiredText}`);
}

for (const prohibitedText of ['Download GTA 6 free', 'Play GTA 6 free', 'GTA 6 browser edition']) {
  if (article.toLowerCase().includes(prohibitedText.toLowerCase())) failures.push(`GTA guide contains a misleading claim: ${prohibitedText}`);
}

if (!sitemap.includes("'/gr8-daily/gta-6-pc-free-browser-games'")) failures.push('GTA guide is missing from the XML sitemap source');
if (!nextConfig.includes("{ pathname: '/editorial/**' }")) failures.push('Editorial artwork is not allowed through the production image optimiser');
const heroPath = path.join(root, 'public/editorial/gta-6-pc-browser-games-hero.png');
if (!fs.existsSync(heroPath) || fs.statSync(heroPath).size < 100_000) failures.push('Original GTA-adjacent editorial hero is missing or unexpectedly small');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Trending content validation passed: ${requiredHubs.length} hubs, ${gameLinks.length} reviewed GTA-adjacent games and an original editorial hero.`);
