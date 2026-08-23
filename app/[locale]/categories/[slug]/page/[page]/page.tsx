import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LocalizedCollectionPage } from '@/components/LocalizedPages';
import { getGlobalLaunchGames } from '@/lib/globalLaunch';
import { parseCategoryPageNumber } from '@/lib/categoryPages';
import { getRegistryCategories, slugifyRegistryValue } from '@/lib/gameRegistry';
import { categoryName, localizedAlternates, localizedCanonical, nonEnglishLocales, tr, type Locale } from '@/lib/i18n';

type PageProps = { params: Promise<{ locale: Locale; slug: string; page: string }> };
const pageSize = 48;

export function generateStaticParams() {
  const slugs = [...new Set(getGlobalLaunchGames().map((game) => slugifyRegistryValue(game.category)))];
  return nonEnglishLocales.flatMap((locale) => slugs.flatMap((slug) => {
    const count = getGlobalLaunchGames().filter((game) => slugifyRegistryValue(game.category) === slug).length;
    const totalPages = Math.ceil(count / pageSize);
    return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({ locale, slug, page: String(index + 2) }));
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug, page } = await params;
  const category = getRegistryCategories(1).find((item) => item.slug === slug);
  const number = parseCategoryPageNumber(page);
  const count = getGlobalLaunchGames().filter((game) => slugifyRegistryValue(game.category) === slug).length;
  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  if (!category || number === null || number < 2 || number > totalPages) return {};
  const text = tr(locale);
  return {
    title: `${categoryName(locale, category.name)} ${text.common.page} ${number} / ${totalPages}`,
    description: `${text.hubs.gamesIntro} ${text.common.page} ${number} / ${totalPages}.`,
    robots: { index: true, follow: true },
    alternates: { canonical: localizedCanonical(locale, `/categories/${slug}/page/${number}`), languages: localizedAlternates(`/categories/${slug}/page/${number}`) }
  };
}

export default async function Page({ params }: PageProps) {
  const { locale, slug, page } = await params;
  const number = parseCategoryPageNumber(page);
  const count = getGlobalLaunchGames().filter((game) => slugifyRegistryValue(game.category) === slug).length;
  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  if (number === null || number < 2 || number > totalPages) notFound();
  return <LocalizedCollectionPage locale={locale} categorySlug={slug} page={number} />;
}
