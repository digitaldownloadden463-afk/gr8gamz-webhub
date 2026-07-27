import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/features';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/backend/',
        '/account/',
        '/auth/',
        '/passport/',
        '/profile/',
        '/community/',
        '/report/',
        '/privacy-choices',
        '/more-free-games/*/play'
      ]
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl
  };
}
