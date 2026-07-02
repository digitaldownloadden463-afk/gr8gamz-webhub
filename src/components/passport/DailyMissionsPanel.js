'use client';

import { useEffect, useState } from 'react';
import { dailyMissions } from '../../data/passport';
import { claimDailyReward, getPassportSnapshot } from '../../lib/passportClient';

export default function DailyMissionsPanel() {
  const [snapshot, setSnapshot] = useState(null);
  const [message, setMessage] = useState('');

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

  const state = snapshot?.state || {};

  function claim() {
    const result = claimDailyReward();
    setSnapshot(getPassportSnapshot());
    setMessage(result.alreadyClaimed ? 'Daily XP already claimed today.' : 'Daily XP claimed. Nice streak building.');
  }

  return (
    <section className="daily-mission-panel">
      <div>
        <span className="eyebrow">GR8 Daily Challenge</span>
        <h2>Complete missions and build return habits.</h2>
        <p>These missions are tracked on-device in V31. They are ready to connect to a GR8-owned database when the backend goes live.</p>
      </div>
      <div className="mission-grid">
        {dailyMissions.map((mission) => {
          const complete = mission.test(state);
          return (
            <article key={mission.id} className={`mission-card ${complete ? 'complete' : ''}`}>
              <strong>{complete ? '✅' : '⬜'} {mission.label}</strong>
              <span>{mission.description}</span>
              <em>+{mission.xp} XP</em>
            </article>
          );
        })}
      </div>
      <div className="passport-actions">
        <button className="cta" type="button" onClick={claim} disabled={state.claimedToday}>{state.claimedToday ? 'Claimed today' : 'Claim daily XP'}</button>
        {message ? <span className="form-note">{message}</span> : null}
      </div>
    </section>
  );
}
