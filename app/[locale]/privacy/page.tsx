import type { Metadata } from 'next';
import { localizedCanonical, tr, type Locale } from '@/lib/i18n';

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const text = tr(locale);
  return { title: text.legal.privacyTitle, description: text.legal.notice, robots: { index: false, follow: true }, alternates: { canonical: localizedCanonical(locale, '/privacy') } };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const text = tr(locale);
  return <main><section className="page-title"><span className="eyebrow">GR8 GAMZ</span><h1>{text.legal.privacyTitle}</h1><p>{text.legal.notice}</p></section><section className="content-panel"><p>{text.home.intro}</p><p>{text.profile.external}</p></section></main>;
}
