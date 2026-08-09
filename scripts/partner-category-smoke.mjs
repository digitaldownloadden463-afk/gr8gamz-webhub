import fs from 'node:fs';
import path from 'node:path';

let chromium;
try {
  ({ chromium } = await import('@playwright/test'));
} catch {
  console.log('Partner category smoke skipped: @playwright/test is not installed in this environment.');
  process.exit(0);
}

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000';
const catalogue = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/partnerCatalog.generated.json'), 'utf8'));
const published = (catalogue.games || []).filter((game) => game.status === 'verified-indexable' && game.indexable);
const categories = ['All GR8 Select', 'Action', 'Adventure', 'Arcade', 'Multiplayer', 'Puzzle', 'Racing', 'Sports', 'Strategy'];
const expectedCounts = new Map(categories.map((category) => [category, category === 'All GR8 Select' ? published.length : published.filter((game) => game.category === category).length]));
const failures = [];

function fail(message) {
  failures.push(message);
}

async function fetchJson(pathname) {
  const response = await fetch(`${baseUrl}${pathname}`);
  const body = await response.json();
  return { response, body };
}

for (const category of categories) {
  const query = encodeURIComponent(category);
  const first = await fetchJson(`/api/partner-catalog?category=${query}&page=1&pageSize=48`);
  const second = await fetchJson(`/api/partner-catalog?category=${query}&page=2&pageSize=48`);
  const expected = expectedCounts.get(category);
  if (first.response.status !== 200 || second.response.status !== 200) fail(`${category}: API did not return 200 for pages 1 and 2`);
  if (first.body.category !== category || second.body.category !== category) fail(`${category}: response category did not remain selected`);
  if (first.body.totalEstimate !== expected || second.body.totalEstimate !== expected) fail(`${category}: totalEstimate was ${first.body.totalEstimate}/${second.body.totalEstimate}, expected ${expected}`);
  if (first.body.items.length !== Math.min(48, expected)) fail(`${category}: page 1 returned ${first.body.items.length} items`);
  if (category !== 'All GR8 Select' && [...first.body.items, ...second.body.items].some((game) => game.category !== category)) fail(`${category}: response contained another category`);
  const slugs = [...first.body.items, ...second.body.items].map((game) => game.slug);
  if (new Set(slugs).size !== slugs.length) fail(`${category}: duplicate slugs occurred across pages 1 and 2`);
  const returnedCounts = new Map((first.body.categoryCounts || []).map((item) => [item.category, item.count]));
  for (const [name, count] of expectedCounts) {
    if (returnedCounts.get(name) !== count) fail(`${category}: category count for ${name} was ${returnedCounts.get(name)}, expected ${count}`);
  }
}

const invalid = await fetchJson('/api/partner-catalog?category=%3Cscript%3E&page=1&pageSize=48');
if (invalid.response.status !== 400) fail(`Invalid category returned ${invalid.response.status}, expected 400`);

for (const title of ['Offroad Jeep Simulation', 'Obby Cart Rush', 'HEROES BEWARE']) {
  const game = published.find((item) => item.source === 'gamemonetize' && item.title === title);
  if (!game) {
    fail(`Missing GameMonetize search fixture: ${title}`);
    continue;
  }
  const response = await fetch(`${baseUrl}/games?q=${encodeURIComponent(title)}`);
  const html = await response.text();
  if (response.status !== 200 || !html.includes(title) || !html.includes(`href="${game.path}"`)) fail(`Search did not expose GameMonetize title: ${title}`);
}

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();
const consoleErrors = [];
page.on('console', (message) => {
  if (message.type() === 'error' && !/Failed to load resource|net::ERR_/i.test(message.text())) consoleErrors.push(message.text());
});
page.on('pageerror', (error) => consoleErrors.push(error.message));
await page.goto(`${baseUrl}/more-free-games`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
await page.locator('.live-game-card').first().waitFor({ state: 'visible', timeout: 30_000 });

await page.getByRole('button', { name: /^Racing \(/ }).click();
await page.locator('[data-catalogue-category="Racing"]').waitFor({ state: 'attached', timeout: 15_000 });
await page.waitForFunction(() => document.querySelectorAll('.live-game-card').length === 48);
let visibleCategories = await page.locator('.live-game-card').evaluateAll((cards) => cards.map((card) => card.getAttribute('data-category')));
if (visibleCategories.some((category) => category !== 'Racing')) fail('Client Racing switch rendered another category');

await page.getByRole('button', { name: /^Action \(/ }).click();
await page.getByRole('button', { name: /^Puzzle \(/ }).click();
await page.locator('[data-catalogue-category="Puzzle"]').waitFor({ state: 'attached', timeout: 15_000 });
await page.waitForFunction(() => document.querySelectorAll('.live-game-card').length === 48);
visibleCategories = await page.locator('.live-game-card').evaluateAll((cards) => cards.map((card) => card.getAttribute('data-category')));
if (visibleCategories.some((category) => category !== 'Puzzle')) fail('Rapid category switch allowed a stale response');

await page.getByTestId('partner-catalogue-sentinel').scrollIntoViewIfNeeded();
await page.waitForFunction(() => document.querySelectorAll('.live-game-card').length > 48, null, { timeout: 20_000 });
const loadedCards = await page.locator('.live-game-card').evaluateAll((cards) => cards.map((card) => ({ category: card.getAttribute('data-category'), slug: card.getAttribute('data-slug') })));
if (loadedCards.some((game) => game.category !== 'Puzzle')) fail('Infinite scroll left the selected Puzzle category');
if (new Set(loadedCards.map((game) => game.slug)).size !== loadedCards.length) fail('Infinite scroll rendered duplicate slugs');

await page.getByRole('button', { name: /^Strategy \(/ }).click();
await page.locator('[data-catalogue-category="Strategy"]').waitFor({ state: 'attached', timeout: 15_000 });
await page.waitForFunction(() => document.querySelectorAll('.live-game-card').length === 48);
visibleCategories = await page.locator('.live-game-card').evaluateAll((cards) => cards.map((card) => card.getAttribute('data-category')));
if (visibleCategories.some((category) => category !== 'Strategy')) fail('Strategy switch did not reset to page 1');
if (consoleErrors.length) fail(`Browser console errors: ${consoleErrors.join(' | ')}`);

await context.close();
await browser.close();

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Partner category smoke passed: ${published.length} games, ${categories.length} filters, category pagination, stale switching, infinite scroll and GameMonetize search verified.`);
