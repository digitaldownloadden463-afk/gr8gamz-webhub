import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LocalizedCollectionPage } from '@/components/LocalizedPages';
import { getGlobalLaunchGames } from '@/lib/globalLaunch';
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
  if (!category) return {};
  const number = Number.parseInt(page, 10);
  const text = tr(locale);
  return {
    title: `${categoryName(locale, category.name)} ${text.common.page} ${number}`,
    description: text.hubs.gamesIntro,
    alternates: { canonical: localizedCanonical(locale, `/categories/${slug}/page/${number}`), languages: localizedAlternates(`/categories/${slug}/page/${number}`) }
  };
}

export default async function Page({ params }: PageProps) {
  const { locale, slug, page } = await params;
  const number = Number.parseInt(page, 10);
  if (!Number.isFinite(number) || number < 2) notFound();
  return <LocalizedCollectionPage locale={locale} categorySlug={slug} page={number} />;
}
