import type { MetadataRoute } from 'next';
import { getAllGames } from '@/lib/games';
import { siteUrl } from '@/lib/features';
import { getFeaturedPartnerGameProfiles } from '@/src/data/partnerGameProfiles';

const staticLastModified = new Date('2026-07-27T00:00:00.000Z');

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['/', '/games', '/top-games', '/more-free-games', '/privacy', '/terms', '/cookie-policy', '/partner-disclosure', '/affiliate-disclosure'];
  const originals = getAllGames().map((game) => ({
    url: `${siteUrl}/arcade/${game.slug || game.id}`,
    lastModified: game.dateAdded ? new Date(game.dateAdded) : staticLastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.8
  }));
  const partnerProfiles = getFeaturedPartnerGameProfiles(24).map((profile) => ({
    url: `${siteUrl}${profile.path}`,
    lastModified: staticLastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.6
  }));

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route === '/' ? '' : route}`,
      lastModified: staticLastModified,
      changeFrequency: route === '/' ? ('weekly' as const) : ('monthly' as const),
      priority: route === '/' ? 1 : 0.7
    })),
    ...originals,
    ...partnerProfiles
  ];
}
