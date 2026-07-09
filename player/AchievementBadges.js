'use client';

import { useEffect, useState } from 'react';
import { passportBadges } from '../../data/passport';
import { getPassportSnapshot } from '../../lib/passportClient';

export default function AchievementBadges() {
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
    <section className="content-panel achievement-panel">
      <div className="section-heading compact">
        <span>GR8 Passport badges</span>
        <h2>Unlock player progress.</h2>
      </div>
      <div className="achievement-grid">
        {passportBadges.slice(0, 5).map((achievement) => {
          const unlocked = unlockedIds.has(achievement.id);
          return (
            <div key={achievement.name} className={`achievement-badge ${unlocked ? 'unlocked' : ''}`}>
              <strong>{unlocked ? achievement.emoji : '🔒'} {achievement.name}</strong>
              <span>{achievement.description}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
