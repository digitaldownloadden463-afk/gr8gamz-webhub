import type { Metadata } from 'next';
import { LocalizedCollectionPage } from '@/components/LocalizedPages';
import { localizedAlternates, localizedCanonical, tr, type Locale } from '@/lib/i18n';

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const text = tr(locale);
  return {
    title: text.nav.new,
    description: text.hubs.launchIntro,
    alternates: { canonical: localizedCanonical(locale, '/new-games'), languages: localizedAlternates('/new-games') }
  };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return <LocalizedCollectionPage locale={locale} />;
}
