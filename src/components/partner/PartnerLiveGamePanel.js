'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function PartnerLiveGamePanel({ profile }) {
  const [data, setData] = useState(null);
  const [state, setState] = useState('loading');

  useEffect(() => {
    let alive = true;
    fetch(`/api/partner-games/${profile.slug}`)
      .then((response) => response.json())
      .then((payload) => {
        if (!alive) return;
        setData(payload);
        setState(payload?.resolved?.found ? 'ready' : 'fallback');
      })
      .catch(() => {
        if (!alive) return;
        setState('fallback');
      });
    return () => { alive = false; };
  }, [profile.slug]);

  const live = data?.resolved || {};
  const previewImage = live.bannerImage || live.image || profile.image;
  const playPath = profile.playPath || `${profile.path}/play`;

  return (
    <aside className="partner-live-panel" aria-label={`${profile.title} live game preview panel`}>
      <div className="partner-live-screen">
        {/* Runtime-resolved partner images cannot be safely proxied through Next.js. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={previewImage} alt={`${profile.title} actual game preview`} loading="eager" />
        <span>{live.image || live.bannerImage ? 'Actual game artwork' : 'GR8 branded preview'}</span>
      </div>
      <div className="partner-live-actions">
        <Link href={playPath} className="hero-cta" onClick={() => {
          if (typeof window !== 'undefined') {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({ event: 'partner_profile_play_now', title: profile.title, status: state });
          }
        }}>
          Play {profile.title} now
        </Link>
        <Link href="/more-free-games" className="secondary-cta">More free games</Link>
      </div>
      <p className="partner-live-status">
        {state === 'ready'
          ? `Connected to the live GR8 Game Network feed. ${data?.checkedCount || 0} partner items checked.`
          : 'If the live partner feed is still warming up, this page keeps the player inside the GR8 Game Network.'}
      </p>
    </aside>
  );
}
