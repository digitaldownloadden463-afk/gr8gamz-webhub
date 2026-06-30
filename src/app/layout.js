import './globals.css';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import JsonLd from '../components/JsonLd';
import { siteConfig } from '../data/site';
import { buildPageMetadata, organizationJsonLd, websiteJsonLd } from '../lib/seo';

export const metadataBase = new URL(siteConfig.siteUrl);

export const metadata = {
  ...buildPageMetadata({
    title: 'Free Browser Games, XP Streaks and Daily Challenges',
    description: siteConfig.description,
    path: '/'
  }),
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || undefined
    }
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#050507'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT ? (
          <Script
            id="google-adsense"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        ) : null}
        <Analytics />
        <JsonLd data={websiteJsonLd()} />
        <JsonLd data={organizationJsonLd()} />
        <div className="site-shell">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
