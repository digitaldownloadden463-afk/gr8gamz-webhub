import Link from 'next/link';
import { Play } from 'lucide-react';
import type { RegistryGame } from '@/lib/gameRegistry';
import PartnerArtwork from '@/components/PartnerArtwork';

export function RegistryGameCard({ game, priority = false }: { game: RegistryGame; priority?: boolean }) {
  return (
    <article className="game-card">
      <Link href={game.url} className="game-card__link">
        <span className="game-card__media">
          <PartnerArtwork src={game.artwork} title={game.title} category={game.category} priority={priority} showBadge={false} />
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
