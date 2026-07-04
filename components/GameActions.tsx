'use client';

import Link from 'next/link';

type GameLike = { id?: string; slug?: string; name?: string; title?: string };

export default function GameActions({ game }: { game?: GameLike }) {
  const id = game?.slug || game?.id || '';
  function saveGame() {
    try {
      const key = 'gr8gamz_favourites';
      const current = JSON.parse(window.localStorage.getItem(key) || '[]');
      const next = id && !current.includes(id) ? [id, ...current].slice(0, 30) : current;
      window.localStorage.setItem(key, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent('gr8-passport-change', { detail: { key, value: next } }));
    } catch {}
  }

  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '18px 0' }}>
      <button onClick={saveGame} style={{ border: '1px solid rgba(53,255,141,.35)', background: 'rgba(53,255,141,.12)', color: '#fff', borderRadius: 999, padding: '10px 14px', fontWeight: 900, cursor: 'pointer' }}>Save to My Arcade</button>
      <Link href="/my-arcade" style={{ border: '1px solid rgba(255,255,255,.14)', color: '#fff', borderRadius: 999, padding: '10px 14px', textDecoration: 'none', fontWeight: 900 }}>My Arcade</Link>
      <Link href="/daily-challenge" style={{ border: '1px solid rgba(255,255,255,.14)', color: '#fff', borderRadius: 999, padding: '10px 14px', textDecoration: 'none', fontWeight: 900 }}>Daily Challenge</Link>
    </div>
  );
}
