'use client';

import { useEffect, useState } from 'react';

export default function PartnerProfileLiveImage({ profile, className = '', showLabel = true, priority = false }) {
  const [live, setLive] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    setFailed(false);
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

  const hasLiveImage = Boolean(live?.image && !failed);
  const image = hasLiveImage ? live.image : profile.image;
  const label = hasLiveImage ? 'Live game artwork' : 'GR8 branded artwork';
  const stateClass = hasLiveImage ? 'is-live-artwork' : 'is-fallback-artwork';

  return (
    <div className={`partner-live-image ${stateClass} ${className}`.trim()} data-image-state={hasLiveImage ? 'live' : 'fallback'}>
      <img
        src={image}
        alt={`${profile.title} ${hasLiveImage ? 'actual game preview' : 'GR8 GAMZ branded artwork'}`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setFailed(true)}
      />
      {showLabel ? <small>{label}</small> : null}
    </div>
  );
}
