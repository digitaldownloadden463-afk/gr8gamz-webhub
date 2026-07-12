import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import PartnerGameCard from '@/components/PartnerGameCard';
import type { PartnerGameProfile } from '@/components/PartnerGameCard';
import {
  getPartnerGameProfile,
  getPartnerGameProfiles,
  getRelatedPartnerGameProfiles
} from '@/src/data/partnerGameProfiles';

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPartnerGameProfiles().map((profile: { slug: string }) => ({ slug: profile.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const profile = getPartnerGameProfile(slug);
  if (!profile) notFound();
  const title = `${profile.title} | GR8 Game Network`;
  return {
    title,
    description: profile.description,
    alternates: { canonical: profile.path },
    openGraph: {
      title,
      description: profile.description,
      url: profile.path,
      images: [{ url: profile.image, alt: `${profile.title} artwork` }]
    }
  };
}

export default async function PartnerProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const profile = getPartnerGameProfile(slug);

  if (!profile) notFound();

  const related = getRelatedPartnerGameProfiles(profile, 6);
  const playPath = profile.playPath || `${profile.path}/play`;

  return (
    <main>
      <section className="partner-profile-hero">
        <div className="partner-profile-copy">
          <span className="eyebrow"><Sparkles size={18} aria-hidden="true" /> GR8 Game Profile #{profile.rank}</span>
          <h1>{profile.title}</h1>
          <p>{profile.description}</p>
          <div className="partner-keyword-row">
            {profile.keywords?.slice(0, 4).map((keyword: string) => <span key={keyword}>{keyword}</span>)}
          </div>
          <div className="cta-row">
            <Link href={playPath} className="cta"><Play size={20} aria-hidden="true" /> Play Now</Link>
            <Link href="/more-free-games" className="secondary-cta">More partner games</Link>
          </div>
        </div>
        <div className="partner-profile-art">
          <Image src={profile.image} alt={`${profile.title} artwork`} width={900} height={506} priority />
        </div>
      </section>

      <section className="profile-facts-grid">
        <article><strong>Category</strong><span>{profile.category}</span></article>
        <article><strong>Best for</strong><span>{profile.bestFor}</span></article>
        <article><strong>Controls</strong><span>{profile.controls}</span></article>
        <article><strong>Feed signal</strong><span>{profile.sourceRank}</span></article>
      </section>

      <section className="content-panel">
        <span className="eyebrow">Why this game is here</span>
        <h2>{profile.whyPicked}</h2>
        <p>{profile.howToPlay || profile.description}</p>
      </section>

      <section className="section-heading">
        <span className="eyebrow">Play next</span>
        <h2>Keep moving through the GR8 Game Network.</h2>
        <Link href="/more-free-games">Full network <ArrowRight size={18} aria-hidden="true" /></Link>
      </section>
      <section className="partner-grid">
        {related.map((item: PartnerGameProfile) => <PartnerGameCard key={item.slug} profile={item} />)}
      </section>
    </main>
  );
}
