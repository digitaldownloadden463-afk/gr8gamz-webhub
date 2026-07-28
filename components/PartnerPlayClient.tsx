'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getConsentChoice } from '@/components/ConsentBanner';

type PartnerPlayClientProps = {
  title: string;
  profilePath: string;
  image: string;
  playUrl: string;
  width: number;
  height: number;
};

export function PartnerPlayClient({ title, profilePath, image, playUrl, width, height }: PartnerPlayClientProps) {
  const [loaded, setLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!loaded) return undefined;
    const timer = window.setTimeout(() => setTimedOut(true), 12000);
    return () => window.clearTimeout(timer);
  }, [loaded]);

  if (!playUrl) {
    return (
      <section className="partner-consent-panel">
        <Image src={image} alt={`${title} artwork`} width={900} height={506} priority sizes="(max-width: 900px) 92vw, 720px" />
        <div>
          <span className="eyebrow">Game unavailable</span>
          <h2>{title} could not be loaded right now.</h2>
          <p>Try another GR8 Select game while the catalogue refreshes.</p>
          <Link href="/more-free-games" className="cta">More Games</Link>
        </div>
      </section>
    );
  }

  if (!loaded) {
    return (
      <section className="partner-consent-panel">
        <Image src={image} alt={`${title} artwork`} width={900} height={506} priority sizes="(max-width: 900px) 92vw, 720px" />
        <div>
          <span className="eyebrow">Load game</span>
          <h2>{title}</h2>
          <p>This opens an embedded game outside the core GR8 Originals library. Extra device, usage or advertising data may be processed by the game service under its own terms.</p>
          <div className="cta-row">
            <button type="button" className="cta-button" onClick={() => setLoaded(true)}>
              Load game
            </button>
            <Link href={profilePath} className="secondary-cta">Back to profile</Link>
          </div>
          {getConsentChoice() === 'rejected' ? <p className="fine-print">You rejected optional site-wide cookies. You can still choose to load this specific partner game.</p> : null}
        </div>
      </section>
    );
  }

  return (
    <section className="partner-player" aria-label={`${title} partner game`}>
      {!timedOut ? <div className="partner-player__status">Loading {title}...</div> : null}
      {timedOut ? (
        <div className="partner-player__fallback">
          <h2>{title} is taking longer than expected.</h2>
          <p>You can retry, return to the profile or choose another game.</p>
          <div className="cta-row">
            <button type="button" className="cta-button" onClick={() => setTimedOut(false)}>Retry</button>
            <Link href={profilePath} className="secondary-cta">Game profile</Link>
          </div>
        </div>
      ) : null}
      <iframe
        title={title}
        src={playUrl}
        width={width}
        height={height}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-popups"
        allow="autoplay; fullscreen; gamepad"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={() => setTimedOut(false)}
      />
    </section>
  );
}

export default PartnerPlayClient;
