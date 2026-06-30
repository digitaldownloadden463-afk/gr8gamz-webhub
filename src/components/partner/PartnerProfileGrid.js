import Link from 'next/link';

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
              <img src={game.image} alt={`${game.title} GR8 GAMZ branded game profile artwork`} loading="lazy" />
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
              <Link href={game.path} className="primary-link">View GR8 profile</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
