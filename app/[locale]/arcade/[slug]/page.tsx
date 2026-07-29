import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LocalizedGameProfile } from '@/components/LocalizedPages';
import { getGlobalLaunchGame, getGlobalLaunchGames } from '@/lib/globalLaunch';
import { localizedAlternates, localizedCanonical, nonEnglishLocales, tr, type Locale } from '@/lib/i18n';

type PageProps = { params: Promise<{ locale: Locale; slug: string }> };

export function generateStaticParams() {
  const originals = getGlobalLaunchGames().filter((game) => game.source === 'gr8-originals');
  return nonEnglishLocales.flatMap((locale) => originals.map((game) => ({ locale, slug: game.slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const game = getGlobalLaunchGame(slug, 'gr8-originals');
  if (!game) return {};
  const text = tr(locale);
  const description = text.profile.intro.replace('{title}', game.title).replace('{category}', game.category);
  return {
    title: game.title,
    description,
    alternates: { canonical: localizedCanonical(locale, game.url), languages: localizedAlternates(game.url) },
    openGraph: { title: game.title, description, url: localizedCanonical(locale, game.url), images: [game.artwork], locale },
    twitter: { card: 'summary_large_image', title: game.title, description, images: [game.artwork] }
  };
}

export default async function Page({ params }: PageProps) {
  const { locale, slug } = await params;
  const game = getGlobalLaunchGame(slug, 'gr8-originals');
  if (!game) notFound();
  return <LocalizedGameProfile locale={locale} game={game} />;
}
