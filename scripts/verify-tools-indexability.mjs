const baseUrl = (process.env.BASE_URL || 'http://127.0.0.1:3018').replace(/\/$/, '');
const productionOrigin = 'https://www.gr8gamz.com';
const routes = [
  ['/tools', 'Free Gaming Tools'],
  ['/tools/keyboard-tester', 'Keyboard Tester'],
  ['/tools/cps-test', 'CPS Test - Click Speed Test'],
  ['/tools/spacebar-clicker', 'Spacebar Clicker'],
  ['/tools/gamepad-tester', 'Gamepad Tester'],
  ['/tools/sensitivity-converter', 'Gaming Sensitivity Converter']
];
const failures = [];

function canonicalFromHtml(html) {
  return html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']|<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.slice(1).find(Boolean) || '';
}

for (const [route, expectedH1] of routes) {
  const response = await fetch(`${baseUrl}${route}`, { redirect: 'manual' });
  const html = await response.text();
  if (response.status !== 200) failures.push(`${route}: HTTP ${response.status}`);
  if (canonicalFromHtml(html) !== `${productionOrigin}${route}`) failures.push(`${route}: canonical mismatch`);
  if (!new RegExp(`<h1[^>]*>\\s*${expectedH1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i').test(html)) failures.push(`${route}: expected H1 missing`);
  if (/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)) failures.push(`${route}: accidental noindex`);
  if (!html.includes('application/ld+json') || !html.includes('BreadcrumbList')) failures.push(`${route}: structured data missing`);
  if (route !== '/tools' && !html.includes('WebApplication')) failures.push(`${route}: WebApplication schema missing`);
  if (route === '/tools' && !html.includes('CollectionPage')) failures.push(`${route}: CollectionPage schema missing`);
  if (!html.includes('GR8 GAMZ')) failures.push(`${route}: server search content missing`);
}

const sitemapResponse = await fetch(`${baseUrl}/sitemaps/core.xml`);
const sitemap = await sitemapResponse.text();
if (!sitemapResponse.ok) failures.push(`/sitemaps/core.xml: HTTP ${sitemapResponse.status}`);
for (const [route] of routes) {
  const matches = sitemap.match(new RegExp(`<loc>${productionOrigin}${route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</loc>`, 'g')) || [];
  if (matches.length !== 1) failures.push(`${route}: appears ${matches.length} times in core sitemap`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`GR8 Tools indexability verified for ${routes.length} routes at ${baseUrl}.`);
