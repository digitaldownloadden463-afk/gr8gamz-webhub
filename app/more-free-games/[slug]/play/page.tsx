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
    description: `Load ${profile.title} from its partner provider after a clear player choice.`,
    robots: { index: false, follow: true },
    alternates: { canonical: canonical(profile.path) }
  };
}

export default async function PartnerPlayPage({ params }: PageProps) {
  const { slug } = await params;
  const profile = getPartnerGameProfile(slug);
  if (!profile) notFound();

  let resolved = { found: false, provider: profile.provider || 'gamepix', title: profile.title, category: profile.category, url: '', width: 960, height: 540 };
  try {
    const result = await resolvePartnerGame(profile);
    resolved = result.resolved;
  } catch {
    resolved = { ...resolved };
  }
  const related = getRelatedPartnerGameProfiles(profile, 4);

  return (
    <main>
      <Link href={profile.path} className="text-link">Back to profile</Link>
      <section className="page-title">
        <span className="eyebrow">{profile.provider === 'gamemonetize' ? 'GameMonetize partner' : 'GamePix partner'}</span>
        <h1>Play {profile.title}</h1>
        <p>The partner game loads only after you choose to load the provider iframe.</p>
      </section>
      <PartnerPlayClient
        title={profile.title}
        provider={profile.provider === 'gamemonetize' ? 'GameMonetize' : 'GamePix'}
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
