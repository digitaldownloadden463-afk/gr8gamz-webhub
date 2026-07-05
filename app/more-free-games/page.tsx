import Link from 'next/link';
import { ArrowRight, Globe2, Play, Sparkles, Zap } from 'lucide-react';
import PartnerGameCard from '@/components/PartnerGameCard';
import {
  getFeaturedPartnerGameProfiles,
  getNewPartnerProfiles,
  getPartnerGameProfiles,
  getPartnerNetworkClusters,
  getTrendingPartnerProfiles
} from '@/src/data/partnerGameProfiles';

export const metadata = {
  title: 'More Free Games | GR8 Game Network',
  description: 'Play partner-powered free browser games through the GR8 Game Network, with action, racing, sports, puzzle and arcade games for worldwide players.'
};

export default function MoreFreeGamesPage() {
  const featured = getFeaturedPartnerGameProfiles(9);
  const trending = getTrendingPartnerProfiles(6);
  const newest = getNewPartnerProfiles(6);
  const allProfiles = getPartnerGameProfiles();
  const clusters = getPartnerNetworkClusters();

  return (
    <main>
      <section className="hero network-hero">
        <span className="eyebrow"><Globe2 size={18} aria-hidden="true" /> GR8 Game Network</span>
        <h1>More free games, built for worldwide play.</h1>
        <p>Partner-powered action, puzzle, racing, sports and arcade games now sit inside the main GR8 GAMZ journey, with fast Play Now prompts and branded profile pages that keep players moving.</p>
        <div className="cta-row">
          <Link href={featured[0]?.playPath || '/more-free-games'} className="cta"><Play size={20} aria-hidden="true" /> Play top partner game</Link>
          <Link href="/games" className="secondary-cta">GR8 originals</Link>
        </div>
      </section>

      <section className="arcade-strip" aria-label="Partner network snapshot">
        <div><strong>{allProfiles.length}</strong><span>partner profiles</span></div>
        <div><strong>2</strong><span>revenue feeds</span></div>
        {clusters.slice(0, 5).map((cluster) => (
          <a href={`#${cluster.slug}`} key={cluster.slug}>
            <strong>{cluster.categories.length}</strong>
            <span>{cluster.title}</span>
          </a>
        ))}
      </section>

      <section className="section-heading">
        <span className="eyebrow"><Zap size={18} aria-hidden="true" /> Hot partner picks</span>
        <h2>Put the revenue games where players can see them.</h2>
      </section>
      <section className="partner-grid partner-grid--large">
        {featured.map((profile, index) => (
          <PartnerGameCard key={profile.slug} profile={profile} priority={index < 3} />
        ))}
      </section>

      <section className="network-showcase">
        <div className="network-showcase__copy">
          <span className="eyebrow"><Sparkles size={18} aria-hidden="true" /> Retention routes</span>
          <h2>Trending and fresh games keep the arcade feeling alive.</h2>
          <p>These rails give global players another click before they leave: most-played partner games, new feed picks and category clusters.</p>
        </div>
        <div className="network-showcase__rail">
          {trending.slice(0, 4).map((profile) => (
            <Link href={profile.playPath || `${profile.path}/play`} key={profile.slug}>
              <span>{profile.category}</span>
              <strong>{profile.title}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-heading">
        <span className="eyebrow">Fresh feed</span>
        <h2>Newest partner games.</h2>
      </section>
      <section className="partner-grid">
        {newest.map((profile) => (
          <PartnerGameCard key={profile.slug} profile={profile} />
        ))}
      </section>

      {clusters.map((cluster) => (
        <section className="game-section" id={cluster.slug} key={cluster.slug}>
          <div className="section-heading">
            <span className="eyebrow">{cluster.eyebrow}</span>
            <h2>{cluster.title}</h2>
            <Link href="/more-free-games">Play more <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
          <p className="section-copy">{cluster.description}</p>
          <div className="partner-mini-row">
            {allProfiles
              .filter((profile) => cluster.categories.map((item) => item.toLowerCase()).includes(String(profile.category).toLowerCase()))
              .slice(0, 6)
              .map((profile) => (
                <Link href={profile.playPath || `${profile.path}/play`} key={profile.slug}>
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
