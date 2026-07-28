import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/features';
import { getIndexableRegistryGames, getRegistryCategories, getRegistryControlHubs } from '@/lib/gameRegistry';

const staticLastModified = new Date('2026-07-27T00:00:00.000Z');

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['/', '/games', '/gr8-originals', '/gr8-select', '/gr8-trending', '/gr8-daily', '/new-games', '/popular-games', '/quick-games', '/mobile-games', '/more-free-games', '/about', '/contact', '/privacy', '/terms', '/cookie-policy', '/partner-disclosure', '/affiliate-disclosure', '/accessibility', '/child-safety', '/copyright', '/report-a-game', '/editorial-policy'];
  const games = getIndexableRegistryGames().map((game) => ({
    url: `${siteUrl}${game.url}`,
    lastModified: game.lastModified ? new Date(game.lastModified) : staticLastModified,
    changeFrequency: 'monthly' as const,
    priority: game.source === 'gr8-originals' ? 0.8 : 0.6
  }));
  const categories = getRegistryCategories().map((category) => ({
    url: `${siteUrl}/categories/${category.slug}`,
    lastModified: staticLastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.65
  }));
  const controls = getRegistryControlHubs().map((hub) => ({
    url: `${siteUrl}/controls/${hub.slug}`,
    lastModified: staticLastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.6
  }));

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route === '/' ? '' : route}`,
      lastModified: staticLastModified,
      changeFrequency: route === '/' ? ('weekly' as const) : ('monthly' as const),
      priority: route === '/' ? 1 : 0.7
    })),
    ...games,
    ...categories,
    ...controls
  ];
}
