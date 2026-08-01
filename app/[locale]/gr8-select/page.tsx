import type { Metadata } from 'next';
import { LocalizedCollectionPage } from '@/components/LocalizedPages';
import { localizedAlternates, localizedCanonical, tr, type Locale } from '@/lib/i18n';

type PageProps = { params: Promise<{ locale: Locale }> };

export const dynamic = 'force-static';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const text = tr(locale);
  return {
    title: text.hubs.selectTitle,
    description: text.hubs.selectIntro,
    alternates: { canonical: localizedCanonical(locale, '/gr8-select'), languages: localizedAlternates('/gr8-select') }
  };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return <LocalizedCollectionPage locale={locale} />;
}
