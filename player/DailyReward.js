'use client';

import { useEffect, useState } from 'react';
import { claimDailyReward, getPassportSnapshot } from '../../lib/passportClient';

export default function DailyReward() {
  const [snapshot, setSnapshot] = useState(null);
  const state = snapshot?.state || {};

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

  function claimReward() {
    claimDailyReward();
    setSnapshot(getPassportSnapshot());
  }

  return (
    <section className="reward-card">
      <div>
        <span className="eyebrow">GR8 Passport daily reward</span>
        <h2>{state.claimedToday ? 'Reward locked in.' : 'Claim today’s XP boost.'}</h2>
        <p>
          Keep returning to build the habit loop. Claim your daily XP, then jump into a quick-play challenge.
        </p>
      </div>
      <div className="reward-side">
        <strong>{state.claimedToday ? '+75 XP claimed' : '+75 XP'}</strong>
        <span>Total Passport XP: {state.xp || 0}</span>
        <button type="button" className="cta session-button" onClick={claimReward} disabled={state.claimedToday}>
          {state.claimedToday ? 'Come back tomorrow' : 'Claim daily reward'}
        </button>
      </div>
    </section>
  );
}
