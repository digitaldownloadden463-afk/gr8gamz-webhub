import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import TopNav from '@/components/TopNav';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gr8gamz.com';
const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'GR8 GAMZ | Free Online Games Worldwide',
    template: '%s'
  },
  description:
    'Play free browser games worldwide on GR8 GAMZ, including original arcade games, GamePix partner games and GameMonetize HTML5 games.',
  applicationName: 'GR8 GAMZ',
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
      { url: '/favicon.ico' }
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }]
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'GR8 GAMZ',
    title: 'GR8 GAMZ | Free Online Games Worldwide',
    description:
      'Play original arcade games and partner-powered GamePix and GameMonetize browser games on GR8 GAMZ.',
    images: [{ url: '/og/gr8gamz-og.png', width: 1200, height: 630, alt: 'GR8 GAMZ arcade' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GR8 GAMZ | Free Online Games Worldwide',
    description: 'Play original and partner-powered free browser games on GR8 GAMZ.',
    images: ['/og/gr8gamz-og.png']
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: bingVerification ? { 'msvalidate.01': bingVerification } : undefined
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        <TopNav />
        {children}
      </body>
    </html>
  );
}
