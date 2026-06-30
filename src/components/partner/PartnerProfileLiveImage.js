'use client';

import { useEffect, useState } from 'react';

export default function PartnerProfileLiveImage({ profile, className = '', showLabel = true }) {
  const [live, setLive] = useState(null);

  useEffect(() => {
    let alive = true;
    fetch(`/api/partner-games/${profile.slug}`)
      .then((response) => response.json())
      .then((data) => {
        if (!alive) return;
        const image = data?.resolved?.bannerImage || data?.resolved?.image || '';
        if (image) setLive({ image, title: data?.resolved?.title || profile.title, found: data?.resolved?.found });
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [profile.slug, profile.title]);

  const image = live?.image || profile.image;
  const label = live?.image ? 'Live game artwork' : 'GR8 branded artwork';

  return (
    <div className={`partner-live-image ${className}`.trim()}>
      <img src={image} alt={`${profile.title} ${live?.image ? 'actual game preview' : 'GR8 GAMZ branded artwork'}`} loading="lazy" />
      {showLabel ? <small>{label}</small> : null}
    </div>
  );
}
