import type { Metadata } from 'next';
import { LocalizedHomePage } from '@/components/LocalizedPages';
import { localizedAlternates, localizedCanonical, tr, type Locale } from '@/lib/i18n';

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const text = tr(locale);
  return {
    title: text.home.title,
    description: text.home.intro,
    alternates: { canonical: localizedCanonical(locale, '/'), languages: localizedAlternates('/') },
    openGraph: { title: text.home.title, description: text.home.intro, url: localizedCanonical(locale, '/'), locale },
    twitter: { card: 'summary_large_image', title: text.home.title, description: text.home.intro }
  };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return <LocalizedHomePage locale={locale} />;
}
