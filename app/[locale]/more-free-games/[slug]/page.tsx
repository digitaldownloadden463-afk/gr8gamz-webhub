import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LocalizedGameProfile } from '@/components/LocalizedPages';
import { getGlobalLaunchGame, getGlobalLaunchGames } from '@/lib/globalLaunch';
import { getIndexableRegistryGames } from '@/lib/gameRegistry';
import { canonical } from '@/lib/features';
import { localizedAlternates, localizedCanonical, nonEnglishLocales, tr, type Locale } from '@/lib/i18n';

type PageProps = { params: Promise<{ locale: Locale; slug: string }> };

export function generateStaticParams() {
  const partners = getGlobalLaunchGames().filter((game) => game.source === 'gr8-select');
  return nonEnglishLocales.flatMap((locale) => partners.map((game) => ({ locale, slug: game.slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const game = getGlobalLaunchGame(slug, 'gr8-select') || getIndexableRegistryGames().find((item) => item.slug === slug && item.source === 'gr8-select');
  if (!game) return {};
  const text = tr(locale);
  const inLaunch = Boolean(getGlobalLaunchGame(slug, 'gr8-select'));
  const description = text.profile.intro.replace('{title}', game.title).replace('{category}', game.category);
  return {
    title: game.title,
    description,
    robots: inLaunch ? undefined : { index: false, follow: true },
    alternates: {
      canonical: inLaunch ? localizedCanonical(locale, game.url) : canonical(game.url),
      languages: inLaunch ? localizedAlternates(game.url) : undefined
    },
    openGraph: { title: game.title, description, url: inLaunch ? localizedCanonical(locale, game.url) : canonical(game.url), images: [game.artwork], locale },
    twitter: { card: 'summary_large_image', title: game.title, description, images: [game.artwork] }
  };
}

export default async function Page({ params }: PageProps) {
  const { locale, slug } = await params;
  const game = getGlobalLaunchGame(slug, 'gr8-select') || getIndexableRegistryGames().find((item) => item.slug === slug && item.source === 'gr8-select');
  if (!game) notFound();
  return <LocalizedGameProfile locale={locale} game={game} />;
}
