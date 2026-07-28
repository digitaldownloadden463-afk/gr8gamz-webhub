const baseUrl = process.argv[2] || process.env.CRAWL_BASE_URL || 'http://127.0.0.1:3000';
const failures = [];

function sameOriginUrl(pathOrUrl) {
  return new URL(pathOrUrl, baseUrl);
}

async function text(url) {
  const response = await fetch(url, { redirect: 'manual' });
  return { response, body: await response.text().catch(() => '') };
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

const sitemap = await text(sameOriginUrl('/sitemap.xml'));
if (sitemap.response.status !== 200) failures.push(`/sitemap.xml returned ${sitemap.response.status}`);
const sitemapRoutes = [...sitemap.body.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
if (!sitemapRoutes.length) failures.push('Sitemap did not contain URLs.');

const checkedLinks = new Set();
const inbound = new Map(sitemapRoutes.map((route) => [route, 0]));

for (const route of sitemapRoutes) {
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
    if (checkedLinks.has(link) || link.startsWith('/challenge/')) continue;
    checkedLinks.add(link);
    const linkResponse = await fetch(sameOriginUrl(link), { redirect: 'manual' });
    if (linkResponse.status >= 400) failures.push(`${route} links to broken ${link} (${linkResponse.status})`);
    if ([301, 302, 307, 308].includes(linkResponse.status) && sitemapRoutes.includes(link)) {
      failures.push(`${route} links to redirecting sitemap URL ${link}`);
    }
  }
}

for (const [route, count] of inbound) {
  if (route !== '/' && count === 0) failures.push(`${route} has no inbound links from crawled sitemap pages`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Route crawl passed for ${sitemapRoutes.length} sitemap URLs and ${checkedLinks.size} internal links at ${baseUrl}.`);
