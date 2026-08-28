'use client';

import Link from 'next/link';
import { Play } from 'lucide-react';
import PartnerArtwork from '@/components/PartnerArtwork';
import { trackEvent } from '@/lib/analytics';
import type { RegistryGame } from '@/lib/gameRegistry';

export default function GameHubGameCard({ game, hubId, priority = false }: { game: RegistryGame; hubId: string; priority?: boolean }) {
  return (
    <article className="game-card">
      <Link
        href={game.url}
        className="game-card__link"
        onClick={() => trackEvent('game_hub_game_selected', { hub_id: hubId, game_slug: game.slug, source_surface: 'hub-grid' })}
      >
        <span className="game-card__media">
          <PartnerArtwork src={game.artwork} title={game.title} category={game.category} priority={priority} showBadge={false} />
          <span className="game-card__badge">{game.source === 'gr8-originals' ? 'Original' : 'Select'}</span>
        </span>
        <span className="game-card__body">
          <span className="game-card__kicker">{game.category}</span>
          <strong className="game-card__title">{game.title}</strong>
          <span className="game-card__meta"><span>{game.controls}</span><span>{game.difficulty}</span></span>
          <span className="game-card__button"><Play size={18} aria-hidden="true" /> Play</span>
        </span>
      </Link>
    </article>
  );
}
