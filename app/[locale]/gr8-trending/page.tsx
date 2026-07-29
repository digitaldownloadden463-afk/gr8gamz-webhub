import { LocalizedCollectionPage } from '@/components/LocalizedPages';
import { type Locale } from '@/lib/i18n';

type PageProps = { params: Promise<{ locale: Locale }> };

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return <LocalizedCollectionPage locale={locale} />;
}
