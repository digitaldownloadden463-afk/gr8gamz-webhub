import { siteConfig } from '../data/site';

export default function robots() {
  const base = siteConfig.siteUrl.replace(/\/$/, '');
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/search?*']
      },
      {
        userAgent: 'Googlebot',
        allow: '/'
      },
      {
        userAgent: 'Bingbot',
        allow: '/'
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/'
      },
      {
        userAgent: 'OAI-AdsBot',
        allow: '/'
      },
      {
        userAgent: 'GPTBot',
        allow: '/'
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/'
      }
    ],
    sitemap: [`${base}/sitemap.xml`, `${base}/sitemap-index.xml`, `${base}/sitemap-games.xml`, `${base}/sitemap-content.xml`, `${base}/sitemap-discovery.xml`, `${base}/sitemap-partner-games.xml`, `${base}/sitemap-images.xml`],
    host: base
  };
}
