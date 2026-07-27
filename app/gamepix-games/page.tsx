import Link from 'next/link';
import { ArrowRight, Globe2, Play, Radio } from 'lucide-react';
import PartnerGameCard from '@/components/PartnerGameCard';
import { gamePixCategories, gamePixConfig } from '@/src/data/gamepix';
import { getFeaturedPartnerGameProfiles, getPartnerGameProfilesByCategory } from '@/src/data/partnerGameProfiles';

export const metadata = {
  title: 'GamePix Games | GR8 GAMZ',
  description:
    'Explore GamePix-powered partner games on GR8 GAMZ, including action, racing, sports, puzzle and arcade browser games.'
};

export default function GamePixGamesPage() {
  const featured = getFeaturedPartnerGameProfiles(9);
  const action = getPartnerGameProfilesByCategory('Action', 6);

  return (
    <main>
      <section className="hero network-hero">
        <span className="eyebrow">
          <Globe2 size={18} aria-hidden="true" /> GamePix partner feed
        </span>
        <h1>GamePix revenue games connected to the GR8 player journey.</h1>
        <p>
          GamePix remains a core partner source, with curated profile pages, Play Now prompts and a live feed endpoint
          ready for worldwide discovery.
        </p>
        <div className="cta-row">
          <Link href={featured[0]?.playPath || '/more-free-games'} className="cta">
            <Play size={20} aria-hidden="true" /> Play GamePix pick
          </Link>
          <Link href="/api/gamepix/feed" className="secondary-cta">
            <Radio size={20} aria-hidden="true" /> Feed status
          </Link>
        </div>
      </section>

      <section className="arcade-strip" aria-label="GamePix snapshot">
        <div>
          <strong>{gamePixConfig.sid}</strong>
          <span>GamePix SID</span>
        </div>
        <div>
          <strong>{gamePixCategories.length}</strong>
          <span>feed categories</span>
        </div>
        <Link href="/gamemonetize-games">
          <strong>CMS</strong>
          <span>GameMonetize import</span>
        </Link>
      </section>

      <section className="section-heading">
        <span className="eyebrow">Curated GamePix profiles</span>
        <h2>High-intent partner games stay close to the front door.</h2>
        <Link href="/more-free-games">Full network <ArrowRight size={18} aria-hidden="true" /></Link>
      </section>
      <section className="partner-grid partner-grid--large">
        {featured.map((profile, index) => (
          <PartnerGameCard key={profile.slug} profile={profile} priority={index < 3} />
        ))}
      </section>

      <section className="game-section">
        <div className="section-heading">
          <span className="eyebrow">Action feed</span>
          <h2>Fast GamePix games for instant sessions.</h2>
        </div>
        <div className="partner-mini-row">
          {action.map((profile) => (
            <Link href={profile.playPath || `${profile.path}/play`} key={profile.slug}>
              <span>{profile.category}</span>
              <strong>{profile.title}</strong>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
