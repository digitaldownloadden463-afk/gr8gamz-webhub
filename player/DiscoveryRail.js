import Link from 'next/link';
import GameCard from '../GameCard';

export default function DiscoveryRail({ eyebrow, title, description, games = [], href }) {
  if (!games.length) return null;

  return (
    <section className="discovery-rail">
      <div className="section-heading">
        <div>
          <span>{eyebrow}</span>
          <h2>{title}</h2>
        </div>
        {description ? <p>{description}</p> : href ? <Link href={href} className="secondary-cta">View more</Link> : null}
      </div>
      <div className="horizontal-game-rail">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}
