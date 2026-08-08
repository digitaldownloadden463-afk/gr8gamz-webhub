import fs from 'node:fs/promises';

let chromium;
try {
  ({ chromium } = await import('@playwright/test'));
} catch {
  console.error('@playwright/test is required for the GameMonetize browser sample.');
  process.exit(1);
}

const manifest = JSON.parse(await fs.readFile('src/data/providers/gamemonetize/manifest.json', 'utf8'));
const sampleSize = Math.max(12, Math.min(100, Number.parseInt(process.env.GR8_GAMEMONETIZE_BROWSER_SAMPLE || '40', 10)));
const candidates = (await Promise.all(manifest.chunks.map(async (chunk) => JSON.parse(await fs.readFile(`src/data/providers/gamemonetize/${chunk.file}`, 'utf8')))))
  .flat().filter((game) => ['pending-revenue-attribution', 'verified-indexable'].includes(game.status) && !game.validationErrors?.length);
const categories = [...new Set(candidates.map((game) => game.category))].sort();
const selected = [];

for (const category of categories) {
  const group = candidates.filter((game) => game.category === category);
  for (const index of [0, Math.floor(group.length / 2), group.length - 1]) {
    const game = group[index];
    if (game && !selected.some((item) => item.sourceId === game.sourceId)) selected.push(game);
  }
}
for (let index = 0; selected.length < sampleSize && index < candidates.length; index += Math.max(1, Math.floor(candidates.length / sampleSize))) {
  const game = candidates[index];
  if (game && !selected.some((item) => item.sourceId === game.sourceId)) selected.push(game);
}
selected.length = Math.min(sampleSize, selected.length);

const browser = await chromium.launch();
const results = [];
const blockedText = /This content is blocked|Contact the site owner|Refused to connect|ERR_BLOCKED|Access denied|Page not found|Unsupported protocol/i;

for (let index = 0; index < selected.length; index += 1) {
  const game = selected[index];
  const portrait = game.height > game.width;
  const context = await browser.newContext({ viewport: portrait ? { width: 390, height: 844 } : { width: 1365, height: 768 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  try {
    const response = await page.goto(game.playUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(2500);
    const text = await page.locator('body').innerText({ timeout: 3000 }).catch(() => '');
    const dimensions = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }));
    const passed = Boolean(response?.ok()) && !blockedText.test(`${text} ${errors.join(' ')}`) && dimensions.width > 0 && dimensions.height > 0;
    results.push({ supplierId: game.sourceId, slug: game.slug, category: game.category, viewport: portrait ? 'mobile' : 'desktop', passed, status: response?.status() || 0, errors: errors.slice(0, 3) });
  } catch (error) {
    results.push({ supplierId: game.sourceId, slug: game.slug, category: game.category, viewport: portrait ? 'mobile' : 'desktop', passed: false, status: 0, errors: [error instanceof Error ? error.message : String(error)] });
  } finally {
    await context.close();
  }
}

await browser.close();
const report = {
  checkedAt: new Date().toISOString(),
  sampleSize: results.length,
  passed: results.filter((item) => item.passed).length,
  failed: results.filter((item) => !item.passed).length,
  note: 'The sample loads official provider game documents without clicking or accepting third-party advertising.',
  results
};
await fs.writeFile('reports/gamemonetize-browser-sample.json', `${JSON.stringify(report, null, 2)}\n`);
if (report.failed) {
  console.error(`GameMonetize browser sample failed: ${report.failed}/${report.sampleSize}.`);
  process.exit(1);
}
console.log(`GameMonetize browser sample passed: ${report.passed}/${report.sampleSize} across ${categories.length} categories.`);
