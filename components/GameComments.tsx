'use client';

import Link from 'next/link';
import type { Game } from '@/lib/games';

type GameCommentsProps = {
  slug?: string;
  game?: Partial<Game>;
  compact?: boolean;
  className?: string;
};

export function GameComments({ slug, game, compact = false, className = '' }: GameCommentsProps) {
  return (
    <section className={`game-comments ${className}`} style={{ border: '1px solid rgba(255,255,255,.1)', borderRadius: 22, padding: compact ? 14 : 18, background: 'rgba(255,255,255,.04)', marginTop: 18 }}>
      <strong style={{ display: 'block', marginBottom: 8 }}>GR8 Clubhouse</strong>
      <p style={{ color: '#a1a1aa', lineHeight: 1.55, marginTop: 0 }}>Public comments stay controlled while moderation is prepared. Send feedback through GR8 Clubhouse.</p>
      <Link href="/community/favourite-games" style={{ color: '#35ff8d', fontWeight: 900 }}>Discuss {game?.name || game?.title || slug || 'this game'}</Link>
    </section>
  );
}

export default GameComments;
