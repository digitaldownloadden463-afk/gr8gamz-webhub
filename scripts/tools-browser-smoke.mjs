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

    let page = await context.newPage();
    await page.goto(`${baseUrl}/tools/keyboard-tester`, { waitUntil: 'domcontentloaded' });
    await page.locator('.keyboard-capture').focus();
    await page.keyboard.press('KeyA');
    if ((await page.locator('.tool-results').textContent())?.includes('KeyA') !== true) failures.push(`${viewport.width}px keyboard interaction failed`);

    await page.goto(`${baseUrl}/tools/cps-test`, { waitUntil: 'domcontentloaded' });
    await page.locator('.click-target').click();
    await page.locator('.click-target').click();
    await page.locator('.click-target').click();
    try { await page.waitForFunction(() => document.querySelector('.click-target > strong')?.textContent === '3', null, { timeout: 2_000 }); } catch { failures.push(`${viewport.width}px CPS interaction failed`); }

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

    if (viewport.width === 390) {
      await page.close();
      page = await context.newPage();
      await page.goto(`${baseUrl}/tools/cps-test#challenge=cps&score=0.1&duration=5&sid=a1b2c3d4&parent=oldparent`, { waitUntil: 'domcontentloaded' });
      try { await page.getByText('Beat 0.1 CPS in 5 seconds.').waitFor(); } catch { failures.push('CPS challenge landing failed'); }
      if (!await page.locator('button[aria-pressed="true"]').getByText('5s').isVisible()) failures.push('CPS challenge duration was not selected');
      if (await page.locator('link[rel="canonical"]').getAttribute('href') !== 'https://www.gr8gamz.com/tools/cps-test') failures.push('CPS challenge changed the canonical');
      await page.locator('.click-target').click({ clickCount: 2, delay: 30 });
      await page.getByText(/You beat the challenge by/).waitFor({ timeout: 20_000 });

      await page.evaluate(() => {
        window.__sharedChallenge = null;
        Object.defineProperty(navigator, 'share', { configurable: true, value: async (payload) => { window.__sharedChallenge = payload; } });
      });
      await page.getByRole('button', { name: 'Challenge a friend' }).click();
      await page.getByText('Challenge shared').waitFor();
      const sharedUrl = await page.evaluate(() => window.__sharedChallenge?.url || '');
      if (!/^http:\/\/127\.0\.0\.1:3018\/tools\/cps-test#challenge=cps&score=0\.4&duration=5&sid=[a-f0-9]{16}&parent=a1b2c3d4$/.test(sharedUrl)) failures.push(`CPS native share URL invalid: ${sharedUrl}`);

      await page.evaluate(() => {
        window.__clipboardCalls = 0;
        Object.defineProperty(navigator, 'share', { configurable: true, value: async () => { throw new DOMException('Cancelled', 'AbortError'); } });
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { window.__clipboardCalls += 1; } } });
      });
      await page.getByRole('button', { name: 'Challenge a friend' }).click();
      await page.waitForTimeout(50);
      if (await page.evaluate(() => window.__clipboardCalls) !== 0) failures.push('Cancelled native share copied unexpectedly');

      await page.evaluate(() => {
        Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
        window.__copiedChallenge = '';
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (value) => { window.__copiedChallenge = value; } } });
      });
      await page.getByRole('button', { name: 'Challenge a friend' }).click();
      await page.getByText('Challenge link copied').waitFor();
      const copiedChallenge = await page.evaluate(() => window.__copiedChallenge);
      if (!/parent=a1b2c3d4/.test(copiedChallenge) || /oldparent/.test(copiedChallenge)) failures.push('CPS copied challenge accumulated lineage');

      await page.getByRole('button', { name: 'Retry' }).click();
      if (!await page.getByText('Challenge received').isVisible()) failures.push('CPS same-duration retry cleared challenge');
      await page.getByRole('button', { name: '10s' }).click();
      if (await page.getByText('Challenge received').count() || await page.evaluate(() => location.hash !== '')) failures.push('CPS duration change did not clear challenge');

      await page.goto(`${baseUrl}/tools/cps-test#challenge=cps&score=100&duration=5&sid=11223344`, { waitUntil: 'domcontentloaded' });
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.getByText('Challenge received').waitFor();
      await page.locator('.click-target').click();
      await page.getByText(/CPS short - try again/).waitFor({ timeout: 20_000 });

      await page.reload({ waitUntil: 'domcontentloaded' });
      try { await page.getByText('Challenge received').waitFor(); } catch { failures.push('CPS challenge reload failed'); }
      await page.goto(`${baseUrl}/tools/cps-test#challenge=cps&score=NaN&duration=10&sid=bad!`, { waitUntil: 'domcontentloaded' });
      await page.reload({ waitUntil: 'domcontentloaded' });
      if (await page.getByText('Challenge received').count()) failures.push('Malformed CPS challenge was accepted');

      await page.goto(`${baseUrl}/tools/spacebar-clicker#challenge=spacebar&score=0.1&duration=5&sid=deadbeef`, { waitUntil: 'domcontentloaded' });
      try { await page.getByText('Beat 0.1 presses/sec in 5 seconds.').waitFor(); } catch { failures.push('Spacebar challenge landing failed'); }
      await page.locator('.spacebar-target').focus();
      await page.keyboard.press('Space');
      await page.keyboard.press('Space');
      await page.getByText(/You beat the challenge by/).waitFor({ timeout: 20_000 });
      await page.evaluate(() => {
        window.__copiedChallenge = '';
        Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (value) => { window.__copiedChallenge = value; } } });
      });
      await page.getByRole('button', { name: 'Challenge a friend' }).click();
      await page.getByText('Challenge link copied').waitFor();
      const copiedSpacebar = await page.evaluate(() => window.__copiedChallenge);
      if (!/challenge=spacebar&score=0\.4&duration=5&sid=[a-f0-9]{16}&parent=deadbeef/.test(copiedSpacebar)) failures.push(`Spacebar share loop invalid: ${copiedSpacebar}`);
    }
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
