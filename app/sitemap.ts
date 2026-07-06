import type { MetadataRoute } from 'next';
import { games } from '@/lib/games';
import { getGameMonetizeCmsSitemapGames } from '@/src/data/gamemonetizeCms';
import { getPartnerGameProfiles, getPartnerNetworkClusterRoutes } from '@/src/data/partnerGameProfiles';

const baseUrl = 'https://www.gr8gamz.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    '',
    '/games',
    '/top-games',
    '/more-free-games',
    '/gamepix-games',
    '/gamemonetize-games',
    '/community',
    '/passport',
    '/my-arcade',
    '/daily-challenge',
    '/live',
    '/profile',
    '/privacy',
    '/terms',
    '/community-guidelines',
    '/support',
    '/report'
  ];

  const staticRoutes = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date()
  }));

  const gameRoutes = games.map((game) => ({
    url: `${baseUrl}/arcade/${game.slug}`,
    lastModified: new Date()
  }));

  const partnerRoutes = [
    ...getPartnerGameProfiles().map((profile) => profile.path),
    ...getPartnerNetworkClusterRoutes()
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date()
  }));

  const cmsRoutes = getGameMonetizeCmsSitemapGames().map((game) => ({
    url: `${baseUrl}/gamemonetize-games/${game.slug}`,
    lastModified: game.dateAdded ? new Date(game.dateAdded) : new Date()
  }));

  return [...staticRoutes, ...gameRoutes, ...partnerRoutes, ...cmsRoutes];
}
