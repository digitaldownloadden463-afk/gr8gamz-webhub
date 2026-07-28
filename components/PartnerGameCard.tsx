import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import PartnerArtwork from '@/components/PartnerArtwork';

export type PartnerGameProfile = {
  title: string;
  slug: string;
  image: string;
  path: string;
  playPath?: string;
  provider?: string;
  category: string;
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
        <PartnerArtwork src={profile.image} title={profile.title} category={profile.category} priority={priority} />
      </Link>
      <div className="partner-card__body">
        <span className="game-card__kicker">GR8 Select</span>
        <h3><Link href={profile.path}>{profile.title}</Link></h3>
        <p>{profile.description}</p>
        <div className="partner-card__meta">
          <span>{profile.difficulty || 'Instant play'}</span>
          <span>{profile.bestFor || 'quick browser sessions'}</span>
        </div>
        <div className="partner-card__actions">
          <Link href={playPath} className="cta"><Play size={18} aria-hidden="true" /> Play</Link>
          <Link href={profile.path} className="secondary-cta">Details <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
      </div>
    </article>
  );
}

export default PartnerGameCard;
