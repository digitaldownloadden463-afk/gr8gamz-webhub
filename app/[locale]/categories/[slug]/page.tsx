import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LocalizedCollectionPage } from '@/components/LocalizedPages';
import { getGlobalLaunchGames } from '@/lib/globalLaunch';
import { getRegistryCategories, slugifyRegistryValue } from '@/lib/gameRegistry';
import { categoryName, localizedAlternates, localizedCanonical, nonEnglishLocales, tr, type Locale } from '@/lib/i18n';

type PageProps = { params: Promise<{ locale: Locale; slug: string }> };

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  const slugs = [...new Set(getGlobalLaunchGames().map((game) => slugifyRegistryValue(game.category)))];
  return nonEnglishLocales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const category = getRegistryCategories(1).find((item) => item.slug === slug);
  if (!category) return {};
  const text = tr(locale);
  const name = categoryName(locale, category.name);
  return {
    title: `${name} ${text.hubs.categoryTitle}`,
    description: text.hubs.gamesIntro,
    alternates: { canonical: localizedCanonical(locale, `/categories/${slug}`), languages: localizedAlternates(`/categories/${slug}`) }
  };
}

export default async function Page({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!getGlobalLaunchGames().some((game) => slugifyRegistryValue(game.category) === slug)) notFound();
  return <LocalizedCollectionPage locale={locale} categorySlug={slug} />;
}
