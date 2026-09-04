import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LocalizedCollectionPage } from '@/components/LocalizedPages';
import { getGlobalLaunchGames } from '@/lib/globalLaunch';
import { localizedAlternates, localizedCanonical, tr, type Locale, nonEnglishLocales } from '@/lib/i18n';

type PageProps = { params: Promise<{ locale: Locale; page: string }> };
const pageSize = 48;

export function generateStaticParams() {
  const totalPages = Math.ceil(getGlobalLaunchGames().length / pageSize);
  return nonEnglishLocales.flatMap((locale) => Array.from({ length: totalPages - 1 }, (_, index) => ({ locale, page: String(index + 2) })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, page } = await params;
  const number = Number.parseInt(page, 10);
  const text = tr(locale);
  return {
    title: `${text.hubs.selectTitle} ${text.common.page} ${number}`,
    description: text.hubs.selectIntro,
    robots: { index: false, follow: true },
    alternates: { canonical: localizedCanonical(locale, `/gr8-select/page/${number}`), languages: localizedAlternates(`/gr8-select/page/${number}`) }
  };
}

export default async function Page({ params }: PageProps) {
  const { locale, page } = await params;
  const number = Number.parseInt(page, 10);
  if (!Number.isFinite(number) || number < 2) notFound();
  return <LocalizedCollectionPage locale={locale} page={number} />;
}
