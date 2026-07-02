'use client';

import Link from 'next/link';
import PartnerProfileLiveImage from './PartnerProfileLiveImage';

export default function PartnerHeroShowcase({ profiles = [] }) {
  const picks = profiles.slice(0, 6);
  const primary = picks[0];
  const secondary = picks[1] || picks[0];
  const rail = picks.slice(2, 6);

  if (!primary) return null;

  const demos = [
    { ...primary, label: 'Live partner preview', accent: 'green' },
    { ...secondary, label: 'Featured network game', accent: 'pink' }
  ];

  return (
    <div className="partner-hero-showcase" aria-label="Featured partner game previews">
      <div className="partner-hero-demo-grid">
        {demos.map((game) => (
          <article className={`partner-hero-demo partner-hero-demo-${game.accent}`} key={`${game.slug}-${game.accent}`}>
            <Link href={game.path} className="partner-hero-demo-image" aria-label={`View ${game.title} profile`}>
              <PartnerProfileLiveImage profile={game} showLabel={false} priority />
              <span className="partner-hero-category">{game.category}</span>
            </Link>
            <div className="partner-hero-demo-copy">
              <span className="partner-hero-kicker">{game.label}</span>
              <h3>{game.title}</h3>
              <p>{game.description}</p>
              <div className="partner-hero-actions">
                <Link href={game.playPath || `${game.path}/play`} className="hero-cta">Play Now</Link>
                <Link href={game.path} className="secondary-cta">View profile</Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {rail.length ? (
        <div className="partner-hero-mini-rail" aria-label="More featured partner games">
          {rail.map((game) => (
            <Link href={game.path} className="partner-hero-mini-card" key={game.slug}>
              <PartnerProfileLiveImage profile={game} showLabel={false} />
              <span>{game.title}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
