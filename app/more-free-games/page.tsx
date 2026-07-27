import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PartnerGameCard from '@/components/PartnerGameCard';
import { canonical } from '@/lib/features';
import { getFeaturedPartnerGameProfiles, getPartnerGameProfiles, getPartnerNetworkClusters } from '@/src/data/partnerGameProfiles';

export const metadata = {
  title: 'More Games',
  description: 'Curated partner browser games with clear provider disclosure and consent before embedded play.',
  alternates: { canonical: canonical('/more-free-games') }
};

export default function MoreFreeGamesPage() {
  const featured = getFeaturedPartnerGameProfiles(12);
  const allProfiles = getPartnerGameProfiles();
  const clusters = getPartnerNetworkClusters();

  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">Curated partner games</span>
        <h1>More games when you want a bigger library.</h1>
        <p>These partner games are presented with clear provider labels. The embedded game does not load until you choose to load it.</p>
      </section>
      <section className="partner-grid partner-grid--large">
        {featured.map((profile, index) => <PartnerGameCard key={profile.slug} profile={profile} priority={index < 4} />)}
      </section>
      {clusters.map((cluster) => (
        <section className="game-section" id={cluster.slug} key={cluster.slug}>
          <div className="section-heading">
            <span className="eyebrow">{cluster.eyebrow}</span>
            <h2>{cluster.title}</h2>
            <Link href="/partner-disclosure">Provider details <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
          <p className="section-copy">{cluster.description}</p>
          <div className="compact-link-list">
            {allProfiles
              .filter((profile) => cluster.categories.map((item) => item.toLowerCase()).includes(String(profile.category).toLowerCase()))
              .slice(0, 8)
              .map((profile) => (
                <Link href={profile.path} key={profile.slug}>
                  <span>{profile.category}</span>
                  <strong>{profile.title}</strong>
                </Link>
              ))}
          </div>
        </section>
      ))}
    </main>
  );
}
