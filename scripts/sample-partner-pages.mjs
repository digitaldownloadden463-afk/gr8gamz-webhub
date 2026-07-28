import fs from 'node:fs';

const baseUrl = process.argv[2] || process.env.SAMPLE_BASE_URL || 'http://127.0.0.1:3000';
const catalogue = JSON.parse(fs.readFileSync('src/data/partnerCatalog.generated.json', 'utf8'));
const failures = [];
const categories = new Map();

for (const game of catalogue.games) {
  const bucket = categories.get(game.category) || [];
  bucket.push(game);
  categories.set(game.category, bucket);
}

const sample = [];
for (const games of categories.values()) {
  if (games.length) sample.push(games[0]);
  if (games.length > 8) sample.push(games[Math.floor(games.length / 2)]);
}
for (let index = 0; sample.length < 50 && index < catalogue.games.length; index += Math.max(1, Math.floor(catalogue.games.length / 50))) {
  const game = catalogue.games[index];
  if (!sample.some((item) => item.slug === game.slug)) sample.push(game);
}

function localUrl(path) {
  return new URL(path, baseUrl).toString();
}

for (const game of sample.slice(0, 50)) {
  const response = await fetch(localUrl(game.path), { redirect: 'manual' });
  const html = await response.text().catch(() => '');
  if (response.status !== 200) failures.push(`${game.path} returned ${response.status}`);
  if (!html.includes(`<h1>${game.title}</h1>`)) failures.push(`${game.path} missing expected h1`);
  if (!html.includes(`rel="canonical" href="https://www.gr8gamz.com${game.path}"`)) failures.push(`${game.path} missing canonical`);
  if (!/<meta name="description" content="[^"]{80,}"/.test(html)) failures.push(`${game.path} missing useful meta description`);
  if (!html.includes(game.category)) failures.push(`${game.path} missing category`);
  if (!html.includes(game.playPath)) failures.push(`${game.path} missing play link`);

  const play = await fetch(localUrl(game.playPath), { redirect: 'manual' });
  if (play.status !== 200) failures.push(`${game.playPath} returned ${play.status}`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Partner sample passed for ${sample.slice(0, 50).length} profile/play route pairs across ${categories.size} categories at ${baseUrl}.`);
