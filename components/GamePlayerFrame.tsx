'use client';

import Link from 'next/link';

type GameLike = {
  id?: string;
  slug?: string;
  name?: string;
  title?: string;
  genre?: string;
  description?: string;
  iframeUrl?: string;
  url?: string;
  emoji?: string;
};

export default function GamePlayerFrame({ game }: { game?: GameLike }) {
  const title = game?.name || game?.title || 'GR8 Game';
  const src = game?.iframeUrl || game?.url || '';

  return (
    <section style={{ border: '1px solid rgba(255,255,255,.12)', borderRadius: 24, overflow: 'hidden', background: '#050507', minHeight: 420 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', padding: '14px 18px', background: '#0d0d13', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
        <div>
          <strong style={{ display: 'block', fontSize: '1.1rem' }}>{game?.emoji || '🎮'} {title}</strong>
          <span style={{ color: '#a1a1aa', fontSize: '.88rem' }}>{game?.genre || 'Browser game'} · GR8 GAMZ play screen</span>
        </div>
        <Link href="/games" style={{ color: '#35ff8d', fontWeight: 800, textDecoration: 'none' }}>More games</Link>
      </div>
      {src ? (
        <iframe
          title={title}
          src={src}
          style={{ display: 'block', width: '100%', height: 'min(72vh, 720px)', border: 0, background: '#000' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div style={{ minHeight: 420, display: 'grid', placeItems: 'center', padding: 24, textAlign: 'center' }}>
          <div>
            <h2 style={{ margin: '0 0 10px', fontSize: '2rem' }}>{title}</h2>
            <p style={{ color: '#a1a1aa', maxWidth: 620 }}>{game?.description || 'This GR8 GAMZ play page is ready. Add an iframe URL when the game source is available.'}</p>
            <Link href="/games" style={{ color: '#35ff8d', fontWeight: 900 }}>Browse all games</Link>
          </div>
        </div>
      )}
    </section>
  );
}
