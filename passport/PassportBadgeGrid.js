'use client';

import { useEffect, useState } from 'react';
import { passportBadges } from '../../data/passport';
import { getPassportSnapshot } from '../../lib/passportClient';

export default function PassportBadgeGrid() {
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    function sync() {
      setSnapshot(getPassportSnapshot());
    }
    sync();
    window.addEventListener('gr8-passport-change', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('gr8-passport-change', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const unlockedIds = new Set((snapshot?.unlockedBadges || []).map((badge) => badge.id));

  return (
    <section className="content-panel compact-panel passport-badges-panel">
      <div className="section-heading compact">
        <span>GR8 Badges</span>
        <h2>Unlock progress markers.</h2>
      </div>
      <div className="passport-badge-grid">
        {passportBadges.map((badge) => {
          const unlocked = unlockedIds.has(badge.id);
          return (
            <article key={badge.id} className={`passport-badge ${unlocked ? 'unlocked' : ''}`}>
              <strong>{unlocked ? badge.emoji : '🔒'} {badge.name}</strong>
              <span>{badge.description}</span>
            </article>
          );
        })}
      </div>
    </section>
  );
}
