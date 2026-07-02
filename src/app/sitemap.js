import { siteConfig } from '../data/site';
import { getAllGames, getAllTags } from '../lib/games';
import { getAllContentCollections, getAllUpdatePosts } from '../lib/content';
import { getPartnerGameProfiles, getPartnerNetworkClusterRoutes } from '../data/partnerGameProfiles';

export default function sitemap() {
  const now = new Date();
  const base = siteConfig.siteUrl.replace(/\/$/, '');
  const staticRoutes = ['/', '/games', '/popular', '/new', '/a-z', '/search', '/mobile-games', '/quick-games', '/free-browser-games', '/free-online-games', '/play-free-games', '/html5-games', '/arcade-games', '/action-games', '/puzzle-games', '/racing-games', '/no-download-games', '/one-tap-games', '/games-for-mobile', '/safe-browser-games', '/best-free-browser-games', '/instant-games-online', '/play-online-games-free', '/browser-games-online', '/original-games', '/more-free-games', '/more-free-games/trending', '/more-free-games/popular', '/more-free-games/new', '/play-next', '/hot-picks', '/updates', '/collections', '/new-this-week', '/latest', '/feeds', '/seo-status', '/advertise', '/contact', '/privacy', '/gaming-deals', '/passport', '/badges', '/daily-challenge', '/community-guidelines', '/live', '/community', '/community-guidelines', '/community/game-requests', '/community/high-scores', '/community/bug-reports', '/community/favourite-games', '/community/deal-ideas', '/partner-disclosure', '/guides', '/affiliate-disclosure', '/partners', '/best-gaming-accessories', '/best-mobile-game-controllers', '/best-budget-gaming-headsets', '/best-gaming-keyboards', '/best-gaming-mice', '/best-gifts-for-gamers', '/best-gaming-gifts-under-25', '/best-gaming-gifts-under-50', '/best-controller-games-online', '/best-accessories-for-browser-games', '/best-razer-gaming-gear', '/best-logitech-gaming-gear'];
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
    ...getPartnerGameProfiles().map((profile) => profile.path),
    ...getPartnerNetworkClusterRoutes()
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
