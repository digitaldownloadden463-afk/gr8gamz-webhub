import { siteConfig } from '../data/site';
import { getAllGames } from './games';
import { getPartnerGameProfiles, getPartnerNetworkClusterRoutes } from '../data/partnerGameProfiles';
import {
  ACTIVE_STATIC_ROUTES,
  buildActiveIndexableRoutes,
  buildOriginalGameRoutes,
  buildPartnerClusterRoutes,
  buildPartnerProfileRoutes
} from './activeRoutes';

export const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '470561d472ec49aca5a704b6d8a3eac0';

export function siteBase() {
  return siteConfig.siteUrl.replace(/\/$/, '');
}

export function absolutePath(path = '/') {
  const normalised = path.startsWith('/') ? path : `/${path}`;
  return `${siteBase()}${normalised}`;
}

export function getCoreRoutes() {
  return [...ACTIVE_STATIC_ROUTES];
}

export function getGameRoutes() {
  return buildOriginalGameRoutes(getAllGames());
}

export function getGameGuideRoutes() {
  return [];
}

export function getDiscoveryRoutes() {
  return buildPartnerClusterRoutes(getPartnerNetworkClusterRoutes());
}

export function getPartnerGameProfileRoutes() {
  return buildPartnerProfileRoutes(getPartnerGameProfiles());
}

export function getPartnerNetworkRoutes() {
  return getDiscoveryRoutes();
}

export function getContentRoutes() {
  return getPartnerGameProfileRoutes();
}

export function getAllIndexableRoutes() {
  return buildActiveIndexableRoutes({
    games: getAllGames(),
    profiles: getPartnerGameProfiles(),
    clusterRoutes: getPartnerNetworkClusterRoutes()
  });
}

export function getIndexNowUrlList() {
  return getAllIndexableRoutes().map((route) => absolutePath(route));
}

export function getFreshChangedPages(limit = 40) {
  const core = getCoreRoutes().map((path, index) => ({
    path,
    title: path === '/' ? 'Homepage' : path.slice(1).replaceAll('-', ' '),
    type: 'Core',
    changed: '2026-07-11',
    priority: index === 0 ? 1 : 0.9,
    reason: 'Active GR8 GAMZ route'
  }));

  const partnerProfiles = getPartnerGameProfiles().slice(0, 24).map((profile) => ({
    path: profile.path,
    title: profile.title,
    type: 'Partner profile',
    changed: '2026-06-30',
    priority: 0.89,
    reason: 'GR8-branded partner game profile'
  }));

  const clusters = getPartnerNetworkClusterRoutes().map((path) => ({
    path,
    title: path.split('/').at(-1).replaceAll('-', ' '),
    type: 'Partner category',
    changed: '2026-07-11',
    priority: 0.88,
    reason: 'Active partner-game discovery route'
  }));

  const games = getAllGames().slice(0, 15).map((game) => ({
    path: `/arcade/${game.id}`,
    title: game.name,
    type: 'Game',
    changed: game.dateAdded || '2026-06-28',
    priority: 0.88,
    reason: 'Playable game page'
  }));

  return [...core, ...partnerProfiles, ...clusters, ...games]
    .sort((a, b) => new Date(b.changed) - new Date(a.changed) || b.priority - a.priority)
    .slice(0, limit);
}

export function xmlEscape(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function renderUrlSet(routes, { changeFrequency = 'daily', priority = 0.8 } = {}) {
  const now = new Date().toISOString();
  const items = Array.from(new Set(routes)).map((route) => {
    const path = route.startsWith('http') ? new URL(route).pathname : route;
    const url = route.startsWith('http') ? route : absolutePath(route);
    const p = path === '/' ? 1 : path.includes('/arcade/') ? 0.9 : path.includes('/updates/') ? 0.85 : priority;
    const freq = path.includes('/arcade/') ? 'weekly' : changeFrequency;

    return `  <url>\n    <loc>${xmlEscape(url)}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${p.toFixed(1)}</priority>\n  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>`;
}


export function renderImageSitemap(profiles = []) {
  const now = new Date().toISOString();
  const items = profiles.map((profile) => `  <url>
    <loc>${xmlEscape(absolutePath(profile.path))}</loc>
    <image:image>
      <image:loc>${xmlEscape(absolutePath(profile.image))}</image:loc>
      <image:title>${xmlEscape(`${profile.title} GR8 GAMZ game artwork`)}</image:title>
      <image:caption>${xmlEscape(`Branded GR8 GAMZ profile artwork for ${profile.title}, a free ${profile.category} browser game.`)}</image:caption>
    </image:image>
    <lastmod>${now}</lastmod>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${items}\n</urlset>`;
}

export function renderRssFeed(posts) {
  const now = new Date().toUTCString();
  const items = posts.map((post) => `    <item>
      <title>${xmlEscape(post.title)}</title>
      <link>${xmlEscape(absolutePath(`/updates/${post.slug}`))}</link>
      <guid>${xmlEscape(absolutePath(`/updates/${post.slug}`))}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${xmlEscape(post.description)}</description>
    </item>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${xmlEscape(siteConfig.name)} Updates</title>
    <link>${xmlEscape(absolutePath('/updates'))}</link>
    <description>${xmlEscape('Fresh GR8 GAMZ updates, game guides, collections and platform notes.')}</description>
    <language>en-gb</language>
    <lastBuildDate>${now}</lastBuildDate>
${items}
  </channel>
</rss>`;
}
