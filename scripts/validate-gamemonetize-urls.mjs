import fs from 'node:fs/promises';

const manifest = JSON.parse(await fs.readFile('src/data/providers/gamemonetize/manifest.json', 'utf8'));
const records = (await Promise.all(manifest.chunks.map(async (chunk) => JSON.parse(await fs.readFile(`src/data/providers/gamemonetize/${chunk.file}`, 'utf8')))))
  .flat().filter((game) => game.status !== 'unavailable');
const concurrency = Math.max(2, Math.min(24, Number.parseInt(process.env.GR8_URL_CHECK_CONCURRENCY || '12', 10)));
const timeoutMs = 12000;
const results = { checked: records.length, valid: 0, invalid: 0, artworkFailures: 0, embedFailures: 0, failures: [] };
let cursor = 0;

async function request(url, expected) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    let response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: controller.signal });
    if (response.status === 405 || response.status === 403) {
      response = await fetch(url, { headers: { range: 'bytes=0-1023' }, redirect: 'follow', signal: controller.signal });
    }
    const contentType = response.headers.get('content-type') || '';
    const contentLength = Number.parseInt(response.headers.get('content-length') || '1', 10);
    return response.ok && contentLength !== 0 && expected.test(contentType);
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

async function worker() {
  while (cursor < records.length) {
    const index = cursor;
    cursor += 1;
    const game = records[index];
    const [artworkValid, embedValid] = await Promise.all([
      request(game.artwork, /^image\/(?:jpeg|png|webp)/i),
      request(game.playUrl, /^(?:text\/html|application\/xhtml\+xml)/i)
    ]);
    if (artworkValid && embedValid) results.valid += 1;
    else {
      results.invalid += 1;
      if (!artworkValid) results.artworkFailures += 1;
      if (!embedValid) results.embedFailures += 1;
      if (results.failures.length < 250) results.failures.push({ supplierId: game.sourceId, slug: game.slug, artworkValid, embedValid });
    }
  }
}

await Promise.all(Array.from({ length: concurrency }, worker));
results.checkedAt = new Date().toISOString();
await fs.writeFile('reports/gamemonetize-url-validation.json', `${JSON.stringify(results, null, 2)}\n`);

if (results.invalid) {
  console.error(`GameMonetize URL validation failed: ${results.invalid}/${results.checked} records failed (${results.artworkFailures} artwork, ${results.embedFailures} embed).`);
  process.exit(1);
}
console.log(`GameMonetize URL validation passed: ${results.checked} records returned valid artwork and embed response types.`);
