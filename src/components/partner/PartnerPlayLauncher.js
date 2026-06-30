'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { savePartnerRecent, togglePartnerFavourite } from './PartnerRetentionPanel';

export default function PartnerPlayLauncher({ profile }) {
  const href = profile.playPath || `${profile.path}/play`;
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    savePartnerRecent(profile);
    try {
      const favourites = JSON.parse(window.localStorage.getItem('gr8gamz_partner_favourites') || '[]');
      setSaved(favourites.some((item) => item.slug === profile.slug));
    } catch {
      setSaved(false);
    }
  }, [profile]);

  function handlePlay() {
    savePartnerRecent(profile);
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'partner_profile_play_click', title: profile.title, category: profile.category, status: 'direct_play_route' });
    }
  }

  function handleFavourite() {
    const next = togglePartnerFavourite(profile);
    setSaved(next);
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'partner_profile_favourite_toggle', title: profile.title, category: profile.category, saved: next });
    }
  }

  return (
    <div className="partner-launch-box partner-launch-box-ready">
      <div className="partner-launch-actions">
        <Link href={href} className="hero-cta" onClick={handlePlay}>
          Play {profile.title} now
        </Link>
        <button type="button" className={`partner-save-button ${saved ? 'saved' : ''}`} onClick={handleFavourite}>
          {saved ? 'Saved ✓' : 'Save game'}
        </button>
      </div>
      <small>This opens a GR8-branded play route and remembers the game locally so players can return faster.</small>
    </div>
  );
}
