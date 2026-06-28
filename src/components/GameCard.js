import Link from 'next/link';

export default function GameCard({ game, localePathPrefix = '' }) {
  const href = `${localePathPrefix}/arcade/${game.id}`.replace('//', '/');

  return (
    <article className="game-card">
      <Link href={href} className="game-card-link" aria-label={`Play ${game.name}`}>
        <div className="game-thumb" aria-hidden="true">
          {game.thumbnail ? <img src={game.thumbnail} alt="" loading="lazy" /> : <span>{game.emoji}</span>}
          <span className="game-thumb-emoji">{game.emoji}</span>
        </div>
        <div className="game-card-body">
          <div className="game-meta-row">
            <span>{game.genre}</span>
            <span>{game.difficulty}</span>
          </div>
          <h3>{game.name}</h3>
          <p>{game.description}</p>
          <div className="mini-tag-row">
            {(game.tags || []).slice(0, 3).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="game-actions">
            <span className="play-pill">Play now</span>
            <span className="micro-copy">{game.shortControls || '+25 XP'}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
