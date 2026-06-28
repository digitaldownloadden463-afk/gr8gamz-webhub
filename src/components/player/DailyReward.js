'use client';

import { useEffect, useMemo, useState } from 'react';

const REWARD_KEY = 'gr8gamz_daily_reward';
const XP_KEY = 'gr8gamz_profile';

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function readProfile() {
  try {
    return JSON.parse(window.localStorage.getItem(XP_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeProfile(profile) {
  window.localStorage.setItem(XP_KEY, JSON.stringify(profile));
}

export default function DailyReward() {
  const [claimed, setClaimed] = useState(false);
  const [xp, setXp] = useState(0);
  const today = useMemo(() => todayKey(), []);

  useEffect(() => {
    try {
      setClaimed(window.localStorage.getItem(REWARD_KEY) === today);
      const profile = readProfile();
      setXp(Number(profile.xp || 0));
    } catch {}
  }, [today]);

  function claimReward() {
    if (claimed) return;
    const profile = readProfile();
    const nextXp = Number(profile.xp || 0) + 75;
    const next = {
      ...profile,
      xp: nextXp,
      lastDailyReward: today,
      dailyClaims: Number(profile.dailyClaims || 0) + 1
    };
    writeProfile(next);
    window.localStorage.setItem(REWARD_KEY, today);
    setXp(nextXp);
    setClaimed(true);
  }

  return (
    <section className="reward-card">
      <div>
        <span className="eyebrow">Daily reward</span>
        <h2>{claimed ? 'Reward locked in.' : 'Claim today’s XP boost.'}</h2>
        <p>
          Keep returning to build the habit loop. Claim your daily XP, then jump into a quick-play challenge.
        </p>
      </div>
      <div className="reward-side">
        <strong>{claimed ? '+75 XP claimed' : '+75 XP'}</strong>
        <span>Total local XP: {xp}</span>
        <button type="button" className="cta session-button" onClick={claimReward} disabled={claimed}>
          {claimed ? 'Come back tomorrow' : 'Claim daily reward'}
        </button>
      </div>
    </section>
  );
}
