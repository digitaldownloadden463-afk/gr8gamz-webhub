import type { Metadata } from 'next';
import MyArcadeClient from '@/components/MyArcadeClient';
import { getAllGames } from '@/lib/games';
import { localizedAlternates, localizedCanonical, localeInfo, tr, type Locale } from '@/lib/i18n';

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const text = tr(locale);
  return {
    title: text.nav.arcade,
    description: text.home.privacy,
    alternates: { canonical: localizedCanonical(locale, '/my-arcade'), languages: localizedAlternates('/my-arcade') }
  };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const text = tr(locale);
  const info = localeInfo(locale);
  return <main lang={locale} dir={info.dir}><section className="page-title"><span className="eyebrow">{text.nav.arcade}</span><h1>{text.nav.arcade}</h1><p>{text.home.privacy}</p></section><MyArcadeClient games={getAllGames()} /></main>;
}
