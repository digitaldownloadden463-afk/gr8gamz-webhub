'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function RecentlyPlayed() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      setItems(JSON.parse(window.localStorage.getItem('gr8gamz_recent_games') || '[]').slice(0, 5));
    } catch {
      setItems([]);
    }
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
            <small>Resume game</small>
          </Link>
        ))}
      </div>
    </section>
  );
}
