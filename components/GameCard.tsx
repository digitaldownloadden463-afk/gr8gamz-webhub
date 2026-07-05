import Link from 'next/link';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import type { Game } from '@/lib/games';
import { MiniStats } from './MiniStats';

export function GameCard({ game, style, compact = false }: { game: Game; style?: CSSProperties; compact?: boolean }) {
  const href = game.href || `/arcade/${game.slug || game.id}`;
  return (
    <article className={`game-card ${compact ? 'game-card--compact' : ''}`} style={style}>
      <Link href={href} className="game-card__media" aria-label={`Play ${game.name || game.title}`}>
        {game.thumbnail ? (
          <Image
            src={game.thumbnail}
            alt={game.thumbnailAlt || `${game.name || game.title} artwork`}
            width={640}
            height={360}
            sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
          />
        ) : (
          <span className="game-card__fallback">{game.emoji || 'GR8'}</span>
        )}
        <span className="game-card__badge">{game.playsLabel || game.genre || 'Instant play'}</span>
      </Link>
      <Link href={href} className="game-card__body">
        <span className="game-card__kicker">{game.genre || game.category || 'Arcade'} · {game.difficulty || 'Easy'}</span>
        <h3>{game.name || game.title}</h3>
        <p>{game.description || 'Play this free browser game on GR8 GAMZ.'}</p>
      </Link>
      <MiniStats compact items={[
        { label: 'Controls', value: game.shortControls || game.playStyle || 'Tap' },
        { label: 'Rating', value: game.rating || '4.8' },
        { label: 'Status', value: game.isNew ? 'New' : 'Live' },
        { label: 'Level', value: game.difficulty || 'Easy' }
      ]} />
    </article>
  );
}

export default GameCard;
