import { siteConfig } from '../data/site';
import { getAllGames, getAllTags } from '../lib/games';

export default function sitemap() {
  const now = new Date();
  const base = siteConfig.siteUrl.replace(/\/$/, '');
  const staticRoutes = ['/', '/games', '/popular', '/new', '/a-z', '/search', '/advertise', '/privacy'];
  const routes = [
    ...staticRoutes,
    ...siteConfig.categories.map((category) => `/categories/${category.id}`),
    ...siteConfig.platforms.map((platform) => `/platforms/${platform.id}`),
    ...(siteConfig.controlTypes || []).map((control) => `/controls/${control.id}`),
    ...(siteConfig.difficulties || []).map((difficulty) => `/difficulty/${difficulty.id}`),
    ...getAllTags().map((tag) => `/tags/${tag}`),
    ...getAllGames().map((game) => `/arcade/${game.id}`)
  ];

  const localizedRoutes = siteConfig.locales
    .filter((locale) => locale !== siteConfig.defaultLocale)
    .flatMap((locale) => [
      `/${locale}`,
      ...siteConfig.categories.map((category) => `/${locale}/categories/${category.id}`),
      ...getAllGames().map((game) => `/${locale}/arcade/${game.id}`)
    ]);

  return [...routes, ...localizedRoutes].map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: route.includes('/arcade/') ? 'weekly' : 'daily',
    priority: route === '/' ? 1 : route.includes('/arcade/') ? 0.9 : route.includes('/tags/') ? 0.7 : 0.8
  }));
}
