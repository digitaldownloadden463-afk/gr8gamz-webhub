import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import LivePartnerCatalogue from '@/components/LivePartnerCatalogue';
import PartnerGameCard from '@/components/PartnerGameCard';
import { canonical } from '@/lib/features';
import { getFeaturedPartnerGameProfiles, getPartnerGameProfiles, getPartnerNetworkClusters } from '@/src/data/partnerGameProfiles';

export const metadata = {
  title: 'More Games | GR8 Select',
  description: 'Browse GR8 Select browser games with real artwork, scrolling discovery and clear load choices.',
  alternates: { canonical: canonical('/more-free-games') }
};

export default function MoreFreeGamesPage() {
  const featured = getFeaturedPartnerGameProfiles(12);
  const allProfiles = getPartnerGameProfiles();
  const clusters = getPartnerNetworkClusters();

  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">GR8 Select</span>
        <h1>Scroll through the wider game catalogue.</h1>
        <p>Browse real game artwork and keep loading more as you go. External games still load only after you choose to open one.</p>
      </section>
      <LivePartnerCatalogue />
      <section className="game-section" id="curated-partner-guides">
        <div className="section-heading">
          <span className="eyebrow">Featured guides</span>
          <h2>GR8 Select picks with extra notes.</h2>
          <Link href="/partner-disclosure">How external games load <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
      </section>
      <section className="partner-grid partner-grid--large">
        {featured.map((profile, index) => <PartnerGameCard key={profile.slug} profile={profile} priority={index < 4} />)}
      </section>
      <section className="game-section" id="all-partner-games">
        <div className="section-heading">
          <span className="eyebrow">Full Select shelf</span>
          <h2>Keep scrolling for every extra game we currently list.</h2>
          <Link href="/partner-disclosure">How external games load <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
        <div className="partner-grid">
          {allProfiles.map((profile, index) => (
            <PartnerGameCard key={profile.slug} profile={profile} priority={index < 6} />
          ))}
        </div>
      </section>
      {clusters.map((cluster) => (
        <section className="game-section" id={cluster.slug} key={cluster.slug}>
          <div className="section-heading">
            <span className="eyebrow">{cluster.eyebrow}</span>
            <h2>{cluster.title}</h2>
            <Link href="/partner-disclosure">Provider details <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
          <p className="section-copy">{cluster.description}</p>
          <div className="partner-rail" aria-label={`${cluster.title} partner games`}>
            {allProfiles
              .filter((profile) => cluster.categories.map((item) => item.toLowerCase()).includes(String(profile.category).toLowerCase()))
              .map((profile) => <PartnerGameCard key={profile.slug} profile={profile} />)}
          </div>
        </section>
      ))}
    </main>
  );
}
