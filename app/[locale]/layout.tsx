import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n';

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return ['es', 'pt-BR', 'fr', 'de', 'it', 'pl', 'tr', 'id', 'ja', 'ko', 'hi', 'ar'].map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === 'en') notFound();
  return children;
}

export type LocalePageParams = Promise<{ locale: Locale }>;
