import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';

export type PartnerGameProfile = {
  title: string;
  slug: string;
  image: string;
  path: string;
  playPath?: string;
  provider?: string;
  category: string;
  sourceRank?: string;
  difficulty?: string;
  bestFor?: string;
  description: string;
  rank?: number;
};

export function PartnerGameCard({ profile, priority = false }: { profile: PartnerGameProfile; priority?: boolean }) {
  const playPath = profile.playPath || `${profile.path}/play`;

  return (
    <article className="partner-card">
      <Link href={profile.path} className="partner-card__image" aria-label={`Open ${profile.title}`}>
        <Image
          src={profile.image}
          alt={`${profile.title} game artwork`}
          width={640}
          height={360}
          sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
          priority={priority}
        />
        <span>{profile.category}</span>
      </Link>
      <div className="partner-card__body">
        <span className="game-card__kicker">{profile.sourceRank || 'GR8 Game Network'}</span>
        <h3><Link href={profile.path}>{profile.title}</Link></h3>
        <p>{profile.description}</p>
        <div className="partner-card__meta">
          <span>{profile.difficulty || 'Instant play'}</span>
          <span>{profile.provider === 'gamemonetize' ? 'GameMonetize' : 'GamePix'}</span>
        </div>
        <div className="partner-card__actions">
          <Link href={playPath} className="cta"><Play size={18} aria-hidden="true" /> Play Now</Link>
          <Link href={profile.path} className="secondary-cta">Profile <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
      </div>
    </article>
  );
}

export default PartnerGameCard;
