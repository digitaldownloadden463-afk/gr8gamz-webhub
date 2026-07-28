const baseUrl = process.argv[2] || process.env.CRAWL_BASE_URL || 'http://127.0.0.1:3000';
const failures = [];
const concurrency = Number.parseInt(process.env.GR8_CRAWL_CONCURRENCY || '12', 10);

function sameOriginUrl(pathOrUrl) {
  return new URL(pathOrUrl, baseUrl);
}

async function text(url) {
  const response = await fetch(url, { redirect: 'manual' });
  return { response, body: await response.text().catch(() => '') };
}

function xmlLocs(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
}

function internalLinks(html) {
  const links = new Set();
  for (const match of html.matchAll(/\shref=["']([^"']+)["']/gi)) {
    const href = match[1];
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
    const url = sameOriginUrl(href);
    if (url.origin === sameOriginUrl('/').origin) {
      url.hash = '';
      links.add(url.pathname + url.search);
    }
  }
  return [...links];
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

async function sitemapRoutes() {
  const index = await text(sameOriginUrl('/sitemap-index.xml'));
  if (index.response.status !== 200) failures.push(`/sitemap-index.xml returned ${index.response.status}`);
  const sitemapUrls = xmlLocs(index.body);
  if (!sitemapUrls.length) failures.push('Sitemap index did not contain sitemap URLs.');

  const routeCounts = new Map();
  await mapLimit(sitemapUrls, 4, async (sitemapUrl) => {
    const url = sameOriginUrl(new URL(sitemapUrl).pathname);
    const { response, body } = await text(url);
    if (response.status !== 200) failures.push(`${url.pathname} returned ${response.status}`);
    if (body.includes('<sitemapindex')) return;
    if (body.includes('xmlns:image=')) return;
    for (const loc of xmlLocs(body)) {
      const route = new URL(loc).pathname;
      routeCounts.set(route, (routeCounts.get(route) || 0) + 1);
    }
  });

  for (const [route, count] of routeCounts) {
    if (count > 1) failures.push(`${route} appears ${count} times in sitemap system`);
  }

  return [...routeCounts.keys()];
}

const routes = await sitemapRoutes();
if (!routes.length) failures.push('Sitemap system did not contain indexable URLs.');

const checkedLinks = new Set();
const inbound = new Map(routes.map((route) => [route, 0]));

await mapLimit(routes, concurrency, async (route) => {
  const url = sameOriginUrl(route);
  const { response, body } = await text(url);
  if (response.status !== 200) failures.push(`${route} returned ${response.status}`);
  if (response.headers.get('x-robots-tag')?.includes('noindex')) failures.push(`${route} has noindex header`);
  const canonical = body.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  if (canonical && new URL(canonical).pathname !== route) failures.push(`${route} canonical points to ${canonical}`);
  const title = body.match(/<title>(.*?)<\/title>/i)?.[1]?.trim();
  if (!title) failures.push(`${route} missing title`);
  const description = body.match(/<meta name="description" content="([^"]+)"/i)?.[1];
  if (!description) failures.push(`${route} missing meta description`);
  for (const link of internalLinks(body)) {
    if (inbound.has(link)) inbound.set(link, (inbound.get(link) || 0) + 1);
    checkedLinks.add(link);
  }
});

await mapLimit([...checkedLinks].filter((link) => !link.startsWith('/challenge/')), concurrency, async (link) => {
  const linkResponse = await fetch(sameOriginUrl(link), { redirect: 'manual' });
  if (linkResponse.status >= 400) failures.push(`Broken internal link ${link} (${linkResponse.status})`);
  if ([301, 302, 307, 308].includes(linkResponse.status) && routes.includes(link)) {
    failures.push(`Redirecting sitemap URL ${link}`);
  }
});

for (const [route, count] of inbound) {
  if (route !== '/' && count === 0) failures.push(`${route} has no inbound links from crawled sitemap pages`);
}

if (failures.length) {
  console.error(failures.slice(0, 100).join('\n'));
  if (failures.length > 100) console.error(`...and ${failures.length - 100} more failures.`);
  process.exit(1);
}

console.log(`Route crawl passed for ${routes.length} sitemap URLs and ${checkedLinks.size} internal links at ${baseUrl}.`);
