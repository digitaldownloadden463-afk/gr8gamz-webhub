import Link from 'next/link';
import { Play } from 'lucide-react';
import PartnerArtwork from '@/components/PartnerArtwork';
import type { RegistryGame } from '@/lib/gameRegistry';
import { categoryName, pathForLocale, tr, type Locale } from '@/lib/i18n';

export function LocalizedGameCard({ game, locale, priority = false }: { game: RegistryGame; locale: Locale; priority?: boolean }) {
  const text = tr(locale);
  const href = pathForLocale(locale, game.url);

  return (
    <article className="game-card">
      <Link href={href} className="game-card__link" aria-label={`${text.common.play} ${game.title}`}>
        <span className="game-card__media">
          <PartnerArtwork src={game.artwork} title={game.title} category={categoryName(locale, game.category)} priority={priority} showBadge={false} />
          <span className="game-card__badge">{game.source === 'gr8-originals' ? text.nav.originals : text.nav.select}</span>
        </span>
        <span className="game-card__body">
          <span className="game-card__kicker">{categoryName(locale, game.category)}</span>
          <strong className="game-card__title">{game.title}</strong>
          <span className="game-card__meta">
            <span>{game.controls}</span>
            <span>{game.difficulty}</span>
          </span>
          <span className="game-card__button"><Play size={18} aria-hidden="true" /> {text.common.play}</span>
        </span>
      </Link>
    </article>
  );
}

export default LocalizedGameCard;
