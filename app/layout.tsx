import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import TopNav from '@/components/TopNav';
import Footer from '@/components/Footer';
import ConsentBanner from '@/components/ConsentBanner';
import PwaRegister from '@/components/PwaRegister';
import VercelObservability from '@/components/VercelObservability';
import MonetagPopunder from '@/components/MonetagPopunder';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { canonical, siteUrl } from '@/lib/features';
import { headers } from 'next/headers';
import { defaultLocale, isLocale, localeInfo, type Locale } from '@/lib/i18n';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'GR8 GAMZ | Free Browser Games',
    template: '%s | GR8 GAMZ'
  },
  description: 'Play GR8 Originals and GR8 Select browser games on GR8 GAMZ. No downloads, clear privacy controls.',
  applicationName: 'GR8 GAMZ',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/icon.png', type: 'image/png', sizes: '512x512' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }]
  },
  openGraph: {
    type: 'website',
    url: canonical('/'),
    siteName: 'GR8 GAMZ',
    title: 'GR8 GAMZ | Free Browser Games',
    description: 'GR8 Originals and GR8 Select browser games with honest privacy controls.',
    images: [{ url: '/og/gr8gamz-og.png', width: 1200, height: 630, alt: 'GR8 GAMZ arcade' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GR8 GAMZ | Free Browser Games',
    description: 'Play free GR8 Originals and GR8 Select browser games.',
    images: ['/og/gr8gamz-og.png']
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } : undefined
  }
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const requestedLocale = headerList.get('x-gr8-locale') || defaultLocale;
  const locale: Locale = isLocale(requestedLocale) ? requestedLocale : defaultLocale;
  const info = localeInfo(locale);
  return (
    <html lang={locale} dir={info.dir}>
      <body>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <TopNav />
        <div id="main-content">{children}</div>
        <Footer />
        <ConsentBanner />
        <MonetagPopunder />
        <Suspense fallback={null}><GoogleAnalytics /></Suspense>
        <PwaRegister />
        <VercelObservability />
      </body>
    </html>
  );
}
