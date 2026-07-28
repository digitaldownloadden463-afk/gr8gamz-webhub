import fs from 'node:fs/promises';

const catalogue = JSON.parse(await fs.readFile('src/data/partnerCatalog.generated.json', 'utf8'));
const concurrency = Number.parseInt(process.env.GR8_ARTWORK_CONCURRENCY || '8', 10);
const attempts = Number.parseInt(process.env.GR8_ARTWORK_ATTEMPTS || '3', 10);
const timeoutMs = Number.parseInt(process.env.GR8_ARTWORK_TIMEOUT_MS || '20000', 10);
const failures = [];
const seen = new Map();
const urls = [];

for (const game of catalogue.games) {
  if (!game.indexable || game.status !== 'verified-indexable') continue;
  const current = seen.get(game.artwork) || [];
  current.push(game.slug);
  seen.set(game.artwork, current);
  if (current.length === 1) urls.push({ url: game.artwork, slug: game.slug, title: game.title });
}

async function mapLimit(items, limit, worker) {
  const results = [];
  let index = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const current = index;
      index += 1;
      results[current] = await worker(items[current], current);
    }
  });
  await Promise.all(workers);
  return results;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkOnce(item, attempt) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(item.url, { signal: controller.signal, headers: { accept: 'image/avif,image/webp,image/png,image/jpeg,image/*;q=0.8' } });
    const contentType = response.headers.get('content-type') || '';
    const bytes = new Uint8Array(await response.arrayBuffer());
    const valid = response.ok && contentType.startsWith('image/') && bytes.byteLength > 0;
    return {
      ...item,
      status: response.status,
      contentType,
      bytes: bytes.byteLength,
      valid,
      attempt,
      reason: valid ? 'valid' : (!response.ok ? 'invalid-response' : (!contentType.startsWith('image/') ? 'unsupported-content-type' : 'zero-byte-response'))
    };
  } catch (error) {
    return { ...item, status: 0, contentType: '', bytes: 0, valid: false, attempt, reason: error.name === 'AbortError' ? 'timeout' : 'fetch-error' };
  } finally {
    clearTimeout(timer);
  }
}

async function check(item) {
  let lastResult = null;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    lastResult = await checkOnce(item, attempt);
    if (lastResult.valid) return lastResult;
    if (attempt < attempts && (lastResult.reason === 'timeout' || lastResult.reason === 'fetch-error')) {
      await wait(500 * attempt);
    }
  }
  return lastResult;
}

const results = await mapLimit(urls, concurrency, check);
const invalid = results.filter((result) => !result.valid);
const duplicateImageUrls = [...seen.values()].filter((slugs) => slugs.length > 1).length;

if (invalid.length) {
  failures.push(...invalid.slice(0, 25).map((item) => `${item.slug}: ${item.url} ${item.reason} ${item.status} ${item.contentType}`));
}

const report = {
  checkedAt: new Date().toISOString(),
  totalIndexablePartnerGames: catalogue.games.length,
  totalImageUrlsChecked: urls.length,
  validImageResponses: results.length - invalid.length,
  invalidResponses: invalid.filter((item) => item.reason === 'invalid-response').length,
  unsupportedContentTypes: invalid.filter((item) => item.reason === 'unsupported-content-type').length,
  zeroByteResponses: invalid.filter((item) => item.reason === 'zero-byte-response').length,
  fetchErrors: invalid.filter((item) => item.reason === 'fetch-error' || item.reason === 'timeout').length,
  duplicateImageUrls,
  gamesUsingBrandedFallback: invalid.length,
  gamesQuarantinedForArtwork: invalid.length,
  invalid: invalid.slice(0, 100)
};

await fs.mkdir('reports', { recursive: true });
await fs.writeFile('reports/artwork-validation-report.json', `${JSON.stringify(report, null, 2)}\n`);

if (failures.length) {
  console.error(failures.join('\n'));
  console.error(`Artwork validation failed: ${invalid.length} invalid images.`);
  process.exit(1);
}

console.log(`Artwork URL validation passed: ${report.totalImageUrlsChecked} checked, ${report.validImageResponses} valid, ${duplicateImageUrls} duplicate image URLs.`);
