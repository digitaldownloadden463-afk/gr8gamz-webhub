'use client';

import Link from 'next/link';

export default function PartnerPlayLauncher({ profile }) {
  const href = profile.playPath || `${profile.path}/play`;

  return (
    <div className="partner-launch-box partner-launch-box-ready">
      <Link href={href} className="hero-cta" onClick={() => {
        if (typeof window !== 'undefined') {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: 'partner_profile_play_click', title: profile.title, category: profile.category, status: 'direct_play_route' });
        }
      }}>
        Play {profile.title} now
      </Link>
      <small>This opens a GR8-branded play route that connects to the intended partner game feed when the player clicks.</small>
    </div>
  );
}
