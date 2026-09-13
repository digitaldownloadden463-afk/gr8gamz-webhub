import { chromium } from '@playwright/test';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3018';
const routes = ['/tools', '/tools/keyboard-tester', '/tools/cps-test', '/tools/spacebar-clicker', '/tools/gamepad-tester', '/tools/sensitivity-converter'];
const failures = [];
const browser = await chromium.launch({ headless: true });

try {
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    await context.route(/googletagmanager\.com|google-analytics\.com|googlesyndication\.com|doubleclick\.net/, (route) => route.abort());
    for (const route of routes) {
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => { if (message.type() === 'error' && !/Failed to load resource|ERR_FAILED/i.test(message.text())) errors.push(message.text()); });
      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
      const facts = await page.evaluate(() => ({
        h1: document.querySelector('h1')?.textContent?.trim() || '',
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
        noindex: /noindex/i.test(document.querySelector('meta[name="robots"]')?.getAttribute('content') || ''),
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        schemas: [...document.querySelectorAll('script[type="application/ld+json"]')].every((node) => { try { JSON.parse(node.textContent || ''); return true; } catch { return false; } })
      }));
      if (response?.status() !== 200 || !facts.h1 || facts.canonical !== `https://www.gr8gamz.com${route}` || facts.noindex || facts.overflow || !facts.schemas || errors.length) failures.push(`${viewport.width}px ${route}: ${JSON.stringify({ status: response?.status(), ...facts, errors })}`);
      await page.close();
    }

    const page = await context.newPage();
    await page.goto(`${baseUrl}/tools/keyboard-tester`, { waitUntil: 'domcontentloaded' });
    await page.locator('.keyboard-capture').focus();
    await page.keyboard.press('KeyA');
    if ((await page.locator('.tool-results').textContent())?.includes('KeyA') !== true) failures.push(`${viewport.width}px keyboard interaction failed`);

    await page.goto(`${baseUrl}/tools/cps-test`, { waitUntil: 'domcontentloaded' });
    await page.locator('.click-target').click({ clickCount: 3, delay: 20 });
    if ((await page.locator('.click-target > strong').textContent()) !== '3') failures.push(`${viewport.width}px CPS interaction failed`);

    await page.goto(`${baseUrl}/tools/spacebar-clicker`, { waitUntil: 'domcontentloaded' });
    await page.locator('.spacebar-target').focus();
    await page.keyboard.press('Space');
    await page.keyboard.press('Space');
    if ((await page.locator('.spacebar-target > strong').textContent()) !== '2') failures.push(`${viewport.width}px spacebar interaction failed`);

    await page.goto(`${baseUrl}/tools/gamepad-tester`, { waitUntil: 'domcontentloaded' });
    if (!await page.getByText('No controller detected yet').isVisible()) failures.push(`${viewport.width}px gamepad empty state missing`);

    await page.goto(`${baseUrl}/tools/sensitivity-converter`, { waitUntil: 'domcontentloaded' });
    if (!(await page.locator('.tool-results').textContent())?.includes('1,600')) failures.push(`${viewport.width}px sensitivity result missing`);

    await page.goto(`${baseUrl}/tools/cps-test`, { waitUntil: 'domcontentloaded' });
    const reject = page.getByRole('button', { name: 'Reject All' });
    if (await reject.count()) await reject.click();
    if (await page.locator('.adsbygoogle').count()) failures.push(`${viewport.width}px rejected consent rendered a manual ad`);
    await context.close();
  }
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('GR8 Tools browser smoke passed at 390x844 and 1440x900.');
