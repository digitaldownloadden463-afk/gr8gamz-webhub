import { siteConfig } from '../data/site';
import { getAllGames, getAllTags } from '../lib/games';
import { getAllContentCollections, getAllUpdatePosts } from '../lib/content';
import { getPartnerGameProfiles } from '../data/partnerGameProfiles';

export default function sitemap() {
  const now = new Date();
  const base = siteConfig.siteUrl.replace(/\/$/, '');
  const staticRoutes = ['/', '/games', '/popular', '/new', '/a-z', '/search', '/mobile-games', '/quick-games', '/free-browser-games', '/free-online-games', '/play-free-games', '/html5-games', '/arcade-games', '/action-games', '/puzzle-games', '/racing-games', '/no-download-games', '/one-tap-games', '/games-for-mobile', '/safe-browser-games', '/best-free-browser-games', '/original-games', '/more-free-games', '/hot-picks', '/updates', '/collections', '/new-this-week', '/latest', '/feeds', '/seo-status', '/advertise', '/privacy', '/gaming-deals', '/partner-disclosure', '/guides'];
  const routes = [
    ...staticRoutes,
    ...siteConfig.categories.map((category) => `/categories/${category.id}`),
    ...siteConfig.platforms.map((platform) => `/platforms/${platform.id}`),
    ...(siteConfig.seoHubs || []).map((hub) => hub.path),
    ...getAllUpdatePosts().map((post) => `/updates/${post.slug}`),
    ...getAllContentCollections().map((collection) => `/collections/${collection.slug}`),
    ...(siteConfig.controlTypes || []).map((control) => `/controls/${control.id}`),
    ...(siteConfig.difficulties || []).map((difficulty) => `/difficulty/${difficulty.id}`),
    ...getAllTags().map((tag) => `/tags/${tag}`),
    ...getAllGames().map((game) => `/arcade/${game.id}`),
    ...getAllGames().map((game) => `/guides/${game.id}`),
    ...getPartnerGameProfiles().map((profile) => profile.path)
  ];

  const localizedRoutes = siteConfig.locales
    .filter((locale) => locale !== siteConfig.defaultLocale)
    .flatMap((locale) => [
      `/${locale}`,
      ...siteConfig.categories.map((category) => `/${locale}/categories/${category.id}`),
      ...getAllGames().map((game) => `/${locale}/arcade/${game.id}`)
    ]);

  return Array.from(new Set([...routes, ...localizedRoutes])).map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: route.includes('/arcade/') ? 'weekly' : 'daily',
    priority: route === '/' ? 1 : route.includes('/arcade/') ? 0.9 : route.includes('/tags/') ? 0.7 : 0.8
  }));
}
