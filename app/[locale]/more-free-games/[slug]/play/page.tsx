import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LocalizedPartnerPlayPage } from '@/components/LocalizedPages';
import { getPartnerGameProfile } from '@/src/data/partnerGameProfiles';
import { canonical } from '@/lib/features';
import { tr, type Locale } from '@/lib/i18n';

type PageProps = { params: Promise<{ locale: Locale; slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const profile = getPartnerGameProfile(slug);
  if (!profile) return {};
  const text = tr(locale);
  return {
    title: `${text.common.play} ${profile.title}`,
    description: text.profile.external,
    robots: { index: false, follow: true },
    alternates: { canonical: canonical(profile.path) }
  };
}

export default async function Page({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!getPartnerGameProfile(slug)) notFound();
  return <LocalizedPartnerPlayPage locale={locale} slug={slug} />;
}
