import { siteConfig } from '../data/site';
import { getAllGames, getAllTags } from './games';
import { getAllContentCollections, getAllUpdatePosts } from './content';
import { getPartnerGameProfiles, getPartnerNetworkClusterRoutes } from '../data/partnerGameProfiles';

export const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '470561d472ec49aca5a704b6d8a3eac0';

export function siteBase() {
  return siteConfig.siteUrl.replace(/\/$/, '');
}

export function absolutePath(path = '/') {
  const normalised = path.startsWith('/') ? path : `/${path}`;
  return `${siteBase()}${normalised}`;
}

export function getCoreRoutes() {
  return [
    '/',
    '/games',
    '/popular',
    '/new',
    '/a-z',
    '/search',
    '/mobile-games',
    '/quick-games',
    '/free-browser-games',
    '/free-online-games',
    '/play-free-games',
    '/html5-games',
    '/arcade-games',
    '/action-games',
    '/puzzle-games',
    '/racing-games',
    '/no-download-games',
    '/one-tap-games',
    '/games-for-mobile',
    '/safe-browser-games',
    '/best-free-browser-games',
    '/instant-games-online',
    '/play-online-games-free',
    '/browser-games-online',
    '/original-games',
    '/more-free-games',
    '/more-free-games/trending',
    '/more-free-games/popular',
    '/more-free-games/new',
    '/play-next',
    '/hot-picks',
    '/updates',
    '/collections',
    '/new-this-week',
    '/latest',
    '/feeds',
    '/seo-status',
    '/advertise',
    '/contact',
    '/privacy',
    '/gaming-deals',
    '/guides',
    '/partner-disclosure'
  ];
}

export function getGameRoutes() {
  return getAllGames().map((game) => `/arcade/${game.id}`);
}

export function getGameGuideRoutes() {
  return getAllGames().map((game) => `/guides/${game.id}`);
}

export function getDiscoveryRoutes() {
  return [
    ...siteConfig.categories.map((category) => `/categories/${category.id}`),
    ...siteConfig.platforms.map((platform) => `/platforms/${platform.id}`),
    ...(siteConfig.seoHubs || []).map((hub) => hub.path),
    ...(siteConfig.controlTypes || []).map((control) => `/controls/${control.id}`),
    ...(siteConfig.difficulties || []).map((difficulty) => `/difficulty/${difficulty.id}`),
    ...getAllTags().map((tag) => `/tags/${tag}`)
  ];
}

export function getPartnerGameProfileRoutes() {
  return getPartnerGameProfiles().map((profile) => profile.path);
}

export function getPartnerNetworkRoutes() {
  return [
    '/more-free-games/trending',
    '/more-free-games/popular',
    '/more-free-games/new',
    '/play-next',
    ...getPartnerNetworkClusterRoutes()
  ];
}

export function getContentRoutes() {
  return [
    ...getAllUpdatePosts().map((post) => `/updates/${post.slug}`),
    ...getAllContentCollections().map((collection) => `/collections/${collection.slug}`),
    ...getPartnerGameProfileRoutes(),
    ...getPartnerNetworkRoutes()
  ];
}

export function getAllIndexableRoutes() {
  return Array.from(new Set([
    ...getCoreRoutes(),
    ...getDiscoveryRoutes(),
    ...getContentRoutes(),
    ...getGameRoutes(),
    ...getGameGuideRoutes()
  ]));
}

export function getIndexNowUrlList() {
  return getAllIndexableRoutes().map((route) => absolutePath(route));
}

export function getFreshChangedPages(limit = 40) {
  const updates = getAllUpdatePosts().map((post) => ({
    path: `/updates/${post.slug}`,
    title: post.title,
    type: 'Update',
    changed: post.updatedAt || post.date,
    priority: 0.92,
    reason: 'Fresh content article'
  }));

  const collections = getAllContentCollections().map((collection) => ({
    path: `/collections/${collection.slug}`,
    title: collection.title,
    type: 'Collection',
    changed: '2026-06-28',
    priority: 0.86,
    reason: 'Curated game collection'
  }));

  const core = [
    { path: '/', title: 'Homepage', type: 'Core', changed: '2026-06-30', priority: 1, reason: 'Primary platform entry point' },
    { path: '/games', title: 'All games', type: 'Core', changed: '2026-06-30', priority: 0.98, reason: 'Main game catalogue' },
    { path: '/original-games', title: 'GR8 Originals', type: 'SEO hub', changed: '2026-06-30', priority: 0.96, reason: 'Brand-owned game hub' },
    { path: '/more-free-games', title: 'More Free Games', type: 'Network hub', changed: '2026-06-30', priority: 0.97, reason: 'Main branded partner-game hub' },
    { path: '/play-next', title: 'Play Next', type: 'Retention hub', changed: '2026-06-30', priority: 0.95, reason: 'One-more-game retention page' },
    { path: '/more-free-games/trending', title: 'Trending Free Games', type: 'Network hub', changed: '2026-06-30', priority: 0.94, reason: 'Partner game discovery route' },
    { path: '/more-free-games/popular', title: 'Popular Free Games', type: 'Network hub', changed: '2026-06-30', priority: 0.94, reason: 'Partner game discovery route' },
    { path: '/more-free-games/new', title: 'New Free Games', type: 'Network hub', changed: '2026-06-30', priority: 0.94, reason: 'Fresh partner game discovery route' },
    { path: '/hot-picks', title: 'Hot Picks', type: 'Fresh hub', changed: '2026-06-30', priority: 0.94, reason: 'Featured game discovery hub' },
    { path: '/privacy', title: 'Privacy, Cookies and Advertising', type: 'Trust', changed: '2026-06-30', priority: 0.88, reason: 'Launch trust and compliance page' },
    { path: '/gaming-deals', title: 'Gaming Deals and Buyer Guides', type: 'Monetisation', changed: '2026-06-30', priority: 0.88, reason: 'Affiliate disclosure and buyer-guide hub' },
    { path: '/contact', title: 'Contact GR8 GAMZ', type: 'Trust', changed: '2026-06-30', priority: 0.78, reason: 'Contact and support route' },
    { path: '/free-online-games', title: 'Free online games', type: 'SEO hub', changed: '2026-06-30', priority: 0.93, reason: 'Important search landing page' },
    { path: '/new-this-week', title: 'New this week', type: 'Fresh hub', changed: '2026-06-28', priority: 0.95, reason: 'Fresh crawl hub' },
    { path: '/mobile-games', title: 'Mobile games', type: 'SEO hub', changed: '2026-06-28', priority: 0.9, reason: 'Important search landing page' },
    { path: '/quick-games', title: 'Quick games', type: 'SEO hub', changed: '2026-06-28', priority: 0.9, reason: 'Important search landing page' },
    { path: '/free-browser-games', title: 'Free browser games', type: 'SEO hub', changed: '2026-06-28', priority: 0.9, reason: 'Important search landing page' }
  ];

  const partnerProfiles = getPartnerGameProfiles().slice(0, 24).map((profile) => ({
    path: profile.path,
    title: profile.title,
    type: 'Partner profile',
    changed: '2026-06-30',
    priority: 0.89,
    reason: 'GR8-branded partner game profile'
  }));

  const guides = getAllGames().slice(0, 12).map((game) => ({
    path: `/guides/${game.id}`,
    title: `${game.name} Guide`,
    type: 'Game guide',
    changed: game.dateAdded || '2026-06-30',
    priority: 0.88,
    reason: 'Original game guide page'
  }));

  const games = getAllGames().slice(0, 15).map((game) => ({
    path: `/arcade/${game.id}`,
    title: game.name,
    type: 'Game',
    changed: game.dateAdded || '2026-06-28',
    priority: 0.88,
    reason: 'Playable game page'
  }));

  return [...core, ...partnerProfiles, ...guides, ...updates, ...collections, ...games]
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
