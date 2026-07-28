import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';
import type { RegistryGame } from '@/lib/gameRegistry';

export function RegistryGameCard({ game, priority = false }: { game: RegistryGame; priority?: boolean }) {
  const remote = game.artwork.startsWith('https://');
  const artwork = remote ? game.artwork : game.artwork.split('?')[0];

  return (
    <article className="game-card">
      <Link href={game.url} className="game-card__link">
        <span className="game-card__media">
          <Image
            src={artwork}
            alt={`${game.title} artwork`}
            width={480}
            height={270}
            sizes="(max-width: 620px) 92vw, (max-width: 1024px) 44vw, 320px"
            priority={priority}
            unoptimized={remote}
          />
          <span className="game-card__badge">{game.source === 'gr8-originals' ? 'Original' : 'Select'}</span>
        </span>
        <span className="game-card__body">
          <span className="game-card__kicker">{game.category}</span>
          <strong className="game-card__title">{game.title}</strong>
          <span className="game-card__meta">
            <span>{game.controls}</span>
            <span>{game.difficulty}</span>
          </span>
          <span className="game-card__button"><Play size={18} aria-hidden="true" /> Play</span>
        </span>
      </Link>
    </article>
  );
}

export default RegistryGameCard;
