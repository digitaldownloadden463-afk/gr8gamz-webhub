import Link from 'next/link';
import PartnerProfileLiveImage from './PartnerProfileLiveImage';

export default function PartnerProfileGrid({ profiles = [], title = 'GR8 game profiles', eyebrow = 'Indexed game profiles', description = 'Branded profile pages built to help players discover more free games through GR8 GAMZ.' }) {
  if (!profiles.length) return null;

  return (
    <section className="partner-profile-section">
      <div className="section-heading section-heading-primary">
        <div>
          <span>{eyebrow}</span>
          <h2>{title}</h2>
        </div>
        <p>{description}</p>
      </div>
      <div className="partner-profile-grid">
        {profiles.map((game) => (
          <article className="partner-profile-card" key={game.slug}>
            <Link href={game.path} className="partner-profile-image" aria-label={`Open ${game.title} game profile`}>
              <PartnerProfileLiveImage profile={game} showLabel={false} />
              <small>{game.category}</small>
            </Link>
            <div className="partner-profile-body">
              <span className="network-badge">{game.sourceRank}</span>
              <h3><Link href={game.path}>{game.title}</Link></h3>
              <p>{game.description}</p>
              <div className="gamepix-meta">
                <span>{game.difficulty}</span>
                <span>{game.bestFor}</span>
              </div>
              <div className="partner-card-actions">
                <Link href={game.playPath || `${game.path}/play`} className="primary-link">Play Now</Link>
                <Link href={game.path} className="soft-link">View profile</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
