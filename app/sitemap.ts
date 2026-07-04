import type { MetadataRoute } from 'next';
import { games } from '@/lib/games';

const baseUrl = 'https://www.gr8gamz.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    '',
    '/games',
    '/top-games',
    '/community',
    '/passport',
    '/my-arcade',
    '/daily-challenge',
    '/live',
    '/profile',
    '/privacy',
    '/terms',
    '/community-guidelines'
  ];

  const staticRoutes = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date()
  }));

  const gameRoutes = games.map((game) => ({
    url: `${baseUrl}/arcade/${game.slug}`,
    lastModified: new Date()
  }));

  return [...staticRoutes, ...gameRoutes];
}
