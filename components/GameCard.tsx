import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { Game } from '@/lib/games';
import { MiniStats } from './MiniStats';

export function GameCard({ game, style, compact = false }: { game: Game; style?: CSSProperties; compact?: boolean }) {
  const href = game.href || `/arcade/${game.slug || game.id}`;
  return (
    <article style={{ border: '1px solid rgba(255,255,255,.1)', borderRadius: 22, padding: compact ? 16 : 20, background: 'rgba(255,255,255,.04)', ...style }}>
      <Link href={href} style={{ color: '#fff', textDecoration: 'none' }}>
        <span style={{ fontSize: compact ? '2rem' : '2.8rem' }}>{game.emoji || '🎮'}</span>
        <h3 style={{ margin: '10px 0 6px', fontSize: compact ? '1.25rem' : '1.65rem' }}>{game.name || game.title}</h3>
        <p style={{ color: '#a1a1aa', lineHeight: 1.5 }}>{game.description || 'Play this free browser game on GR8 GAMZ.'}</p>
      </Link>
      <MiniStats compact items={[{ label: 'Genre', value: game.genre || game.category || 'Arcade' }, { label: 'Plays', value: game.plays || 'GR8' }, { label: 'Rating', value: game.rating || '4.8' }, { label: 'Level', value: game.difficulty || 'Easy' }]} />
    </article>
  );
}

export default GameCard;
