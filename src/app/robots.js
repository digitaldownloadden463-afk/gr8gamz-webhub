import { siteConfig } from '../data/site';

export default function robots() {
  const base = siteConfig.siteUrl.replace(/\/$/, '');
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/search?*']
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
    sitemap: `${base}/sitemap.xml`,
    host: base
  };
}
