import './globals.css';
import Script from 'next/script';
import Header from '../components/Header';
import Footer from '../components/Footer';
import JsonLd from '../components/JsonLd';
import { siteConfig } from '../data/site';
import { buildPageMetadata, organizationJsonLd, websiteJsonLd } from '../lib/seo';

export const metadataBase = new URL(siteConfig.siteUrl);

export const metadata = {
  ...buildPageMetadata({
    title: 'Free Online Games Worldwide | Browser Games & Mobile Games',
    description: siteConfig.description,
    path: '/'
  }),
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
      { url: '/favicon.ico' }
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/favicon.ico']
  },
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
