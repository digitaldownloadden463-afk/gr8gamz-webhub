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
        '/privacy-choices'
      ]
    },
    sitemap: [`${siteUrl}/sitemap-index.xml`, `${siteUrl}/sitemap.xml`, `${siteUrl}/sitemap-images.xml`],
    host: siteUrl
  };
}
