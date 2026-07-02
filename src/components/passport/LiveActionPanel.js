'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getPassportSnapshot } from '../../lib/passportClient';

export default function LiveActionPanel() {
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

  const state = snapshot?.state || {};
  const activity = snapshot?.activity || [];

  return (
    <section className="live-action-panel content-panel compact-panel">
      <div className="section-heading compact">
        <span>Live-feeling player layer</span>
        <h2>GR8 Passport activity starts here.</h2>
      </div>
      <div className="passport-stat-grid">
        <div><strong>{state.plays || 0}</strong><span>Tracked plays</span></div>
        <div><strong>{state.favouriteCount || 0}</strong><span>Saved games</span></div>
        <div><strong>{state.dailyClaims || 0}</strong><span>Daily claims</span></div>
      </div>
      {activity.length ? (
        <div className="activity-feed-list mini">
          {activity.slice(0, 3).map((item) => (
            <Link key={item.id} href={item.href || '/my-arcade'}>
              <strong>{item.label}</strong>
              <span>{new Date(item.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="muted-copy">Create a Passport, play games and save favourites to make this panel come alive.</p>
      )}
      <div className="passport-actions">
        <Link href="/passport" className="secondary-cta">GR8 Passport</Link>
        <Link href="/community" className="secondary-cta">GR8 Clubhouse</Link>
      </div>
    </section>
  );
}
