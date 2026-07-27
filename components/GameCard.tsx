import Image from 'next/image';
import Link from 'next/link';
import { isRecentlyAdded } from '@/lib/features';

type GameCardProps = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  url: string;
  dateAdded?: string;
  controls?: string;
  difficulty?: string;
  priority?: boolean;
};

export function GameCard({
  id,
  title,
  category,
  imageUrl,
  url,
  dateAdded,
  controls,
  difficulty,
  priority = false
}: GameCardProps) {
  const displayImage = imageUrl.split('?')[0];

  return (
    <article className="game-card" data-game-id={id}>
      <Link href={url} className="game-card__link" aria-label={`Play ${title}`}>
        <span className="game-card__media">
          <Image
            src={displayImage}
            alt={`${title} game artwork`}
            fill
            sizes="(max-width: 620px) 92vw, (max-width: 1024px) 44vw, 350px"
            priority={priority}
          />
          {isRecentlyAdded(dateAdded) ? <span className="game-card__badge">New</span> : null}
        </span>
        <span className="game-card__body">
          <span className="game-card__kicker">{category}</span>
          <strong className="game-card__title">{title}</strong>
          <span className="game-card__meta">
            <span>{controls || 'Touch and keyboard'}</span>
            <span>{difficulty || 'Quick play'}</span>
          </span>
          <span className="game-card__button">
            Play
          </span>
        </span>
      </Link>
    </article>
  );
}

export default GameCard;
