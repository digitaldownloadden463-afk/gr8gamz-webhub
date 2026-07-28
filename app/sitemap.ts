import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/features';

const staticLastModified = new Date('2026-07-27T00:00:00.000Z');

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['/', '/about', '/contact', '/privacy', '/terms', '/cookie-policy', '/partner-disclosure', '/affiliate-disclosure', '/accessibility', '/child-safety', '/copyright', '/report-a-game', '/editorial-policy'];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route === '/' ? '' : route}`,
      lastModified: staticLastModified,
      changeFrequency: route === '/' ? ('weekly' as const) : ('monthly' as const),
      priority: route === '/' ? 1 : 0.7
    }))
  ];
}
