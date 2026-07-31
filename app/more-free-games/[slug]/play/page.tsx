import Link from 'next/link';
import { notFound } from 'next/navigation';
import PartnerPlayClient from '@/components/PartnerPlayClient';
import { canonical } from '@/lib/features';
import { resolvePartnerGame } from '@/lib/partnerFeedResolver';
import { getPartnerGameProfile, getRelatedPartnerGameProfiles } from '@/src/data/partnerGameProfiles';
import PartnerGameCard from '@/components/PartnerGameCard';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const profile = getPartnerGameProfile(slug);
  if (!profile) return {};
  return {
    title: `Play ${profile.title}`,
    description: `Load ${profile.title} after a clear player choice.`,
    robots: { index: false, follow: true },
    alternates: { canonical: canonical(profile.path) }
  };
}

export default async function PartnerPlayPage({ params }: PageProps) {
  const { slug } = await params;
  const profile = getPartnerGameProfile(slug);
  if (!profile) notFound();

  let resolved = { found: Boolean(profile.playUrl), provider: profile.provider || 'gamepix', title: profile.title, category: profile.category, url: profile.playUrl || '', width: profile.width || 960, height: profile.height || 540 };
  try {
    if (!profile.playUrl) {
      const result = await resolvePartnerGame(profile);
      resolved = result.resolved;
    }
  } catch {
    resolved = { ...resolved };
  }
  const related = getRelatedPartnerGameProfiles(profile, 4);

  return (
    <main className="partner-play-page">
      <Link href={profile.path} className="text-link">Back to profile</Link>
      <section className="page-title">
        <span className="eyebrow">GR8 Select</span>
        <h1>Play {profile.title}</h1>
        <p>The game loads only after you choose to open it.</p>
      </section>
      <PartnerPlayClient
        title={profile.title}
        profilePath={profile.path}
        image={profile.image}
        playUrl={resolved.found ? resolved.url : ''}
        width={resolved.width}
        height={resolved.height}
      />
      <section className="section-heading">
        <span className="eyebrow">More choices</span>
        <h2>Try another curated game.</h2>
      </section>
      <section className="partner-grid">
        {related.map((item) => <PartnerGameCard key={item.slug} profile={item} />)}
      </section>
    </main>
  );
}
