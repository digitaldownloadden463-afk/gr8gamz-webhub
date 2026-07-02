'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getRecentGames } from '../../lib/passportClient';

export default function RecentlyPlayed() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    function sync() {
      setItems(getRecentGames().slice(0, 5));
    }
    sync();
    window.addEventListener('gr8-passport-change', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('gr8-passport-change', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  if (!items.length) return null;

  return (
    <section className="content-panel compact-panel">
      <div className="section-heading compact">
        <span>Keep playing</span>
        <h2>Recently played</h2>
      </div>
      <div className="quick-link-grid">
        {items.map((item) => (
          <Link key={item.id} href={item.href} className="quick-link-card">
            <strong>{item.emoji} {item.name}</strong>
            <small>Resume game from My Arcade</small>
          </Link>
        ))}
      </div>
    </section>
  );
}
