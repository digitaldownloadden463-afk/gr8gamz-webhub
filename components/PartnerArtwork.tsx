'use client';

import Image from 'next/image';
import { useState } from 'react';

type PartnerArtworkProps = {
  src?: string;
  title: string;
  category?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  variant?: 'card' | 'profile' | 'panel';
  showBadge?: boolean;
};

export function PartnerArtwork({
  src,
  title,
  category = 'GR8 Select',
  priority = false,
  sizes = '(max-width: 620px) 92vw, (max-width: 1024px) 44vw, 320px',
  className = '',
  variant = 'card',
  showBadge = true
}: PartnerArtworkProps) {
  const [failed, setFailed] = useState(!src);
  const isRemote = Boolean(src?.startsWith('https://'));

  return (
    <span className={`partner-artwork partner-artwork--${variant} ${failed ? 'partner-artwork--fallback' : ''} ${className}`}>
      {!failed && src && isRemote ? (
        // Supplier images are already size-bounded by ingestion; direct loading avoids production optimizer proxy failures.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`${title} ${category} game artwork`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      ) : !failed && src ? (
        <Image
          src={src}
          alt={`${title} ${category} game artwork`}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="partner-artwork__fallback" role="img" aria-label={`${title} fallback artwork`}>
          <span className="partner-artwork__brand">GR8 GAMZ</span>
          <strong>{title}</strong>
          <span>{category}</span>
        </span>
      )}
      {showBadge ? <span className="partner-artwork__badge">{category}</span> : null}
    </span>
  );
}

export default PartnerArtwork;
