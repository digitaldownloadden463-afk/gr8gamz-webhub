import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PartnerGameCard from '@/components/PartnerGameCard';
import type { PartnerGameProfile } from '@/components/PartnerGameCard';
import { canonical } from '@/lib/features';
import { getPartnerGameProfile, getPartnerGameProfiles, getRelatedPartnerGameProfiles } from '@/src/data/partnerGameProfiles';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPartnerGameProfiles().map((profile: { slug: string }) => ({ slug: profile.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const profile = getPartnerGameProfile(slug);
  if (!profile) return {};
  return {
    title: profile.title,
    description: profile.description,
    alternates: { canonical: canonical(`/more-free-games/${profile.slug}`) },
    openGraph: {
      title: profile.title,
      description: profile.description,
      images: [{ url: profile.image, width: 480, height: 270, alt: `${profile.title} artwork` }]
    }
  };
}

export default async function PartnerProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const profile = getPartnerGameProfile(slug);
  if (!profile) notFound();

  const related = getRelatedPartnerGameProfiles(profile, 6);
  const playPath = profile.playPath || `${profile.path}/play`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: profile.title,
    description: profile.description,
    url: canonical(profile.path),
    gamePlatform: 'Web browser',
    provider: profile.provider === 'gamemonetize' ? 'GameMonetize' : 'GamePix'
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="partner-profile-hero">
        <div className="partner-profile-copy">
          <span className="eyebrow">{profile.provider === 'gamemonetize' ? 'GameMonetize partner' : 'GamePix partner'}</span>
          <h1>{profile.title}</h1>
          <p>{profile.description}</p>
          <dl className="fact-list">
            <div><dt>Category</dt><dd>{profile.category}</dd></div>
            <div><dt>Best for</dt><dd>{profile.bestFor}</dd></div>
            <div><dt>Controls</dt><dd>{profile.controls}</dd></div>
          </dl>
          <div className="cta-row">
            <Link href={playPath} className="cta">Play</Link>
            <Link href="/partner-disclosure" className="secondary-cta">Provider disclosure</Link>
          </div>
        </div>
        <Image src={profile.image} alt={`${profile.title} artwork`} width={900} height={506} priority sizes="(max-width: 900px) 92vw, 640px" />
      </section>
      <section className="content-panel">
        <h2>Tips before you play</h2>
        <p>{profile.howToPlay || profile.description}</p>
        <p className="fine-print">The partner iframe loads only on the Play page after you choose to load this provider.</p>
      </section>
      <section className="section-heading">
        <span className="eyebrow">Play next</span>
        <h2>Related games.</h2>
      </section>
      <section className="partner-grid">
        {related.map((item: PartnerGameProfile) => <PartnerGameCard key={item.slug} profile={item} />)}
      </section>
    </main>
  );
}
