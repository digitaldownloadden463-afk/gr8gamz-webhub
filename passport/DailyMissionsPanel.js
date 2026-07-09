'use client';

import { useEffect, useState } from 'react';
import { dailyMissions } from '../../data/passport';
import { claimDailyReward, claimMissionReward, getClaimedMissionIds, getPassportSnapshot } from '../../lib/passportClient';

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
  const claimedMissionIds = getClaimedMissionIds();

  function claim() {
    const result = claimDailyReward();
    setSnapshot(getPassportSnapshot());
    setMessage(result.alreadyClaimed ? 'Daily XP already claimed today.' : 'Daily XP claimed. Nice streak building.');
  }

  function claimMission(mission) {
    const result = claimMissionReward(mission);
    setSnapshot(getPassportSnapshot());
    if (result.reason === 'not-complete') {
      setMessage('Complete the mission first, then claim the XP reward.');
      return;
    }
    setMessage(result.alreadyClaimed ? 'Mission reward already claimed today.' : `${mission.label} reward claimed. +${mission.xp} XP added.`);
  }

  return (
    <section className="daily-mission-panel">
      <div>
        <span className="eyebrow">GR8 Daily Challenge</span>
        <h2>Complete missions and build return habits.</h2>
        <p>These missions are tracked on-device in V32, with claimable XP rewards and a structure ready for the GR8-owned database phase.</p>
      </div>
      <div className="mission-grid">
        {dailyMissions.map((mission) => {
          const complete = mission.test(state);
          const claimed = claimedMissionIds.includes(mission.id);
          return (
            <article key={mission.id} className={`mission-card ${complete ? 'complete' : ''} ${claimed ? 'claimed' : ''}`}>
              <strong>{claimed ? '🏁' : complete ? '✅' : '⬜'} {mission.label}</strong>
              <span>{mission.description}</span>
              <em>+{mission.xp} XP</em>
              <button type="button" className="mission-claim-button" onClick={() => claimMission(mission)} disabled={!complete || claimed}>
                {claimed ? 'Reward claimed' : complete ? 'Claim reward' : 'Complete first'}
              </button>
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
