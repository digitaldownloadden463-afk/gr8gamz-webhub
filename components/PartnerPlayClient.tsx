'use client';

import Link from 'next/link';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { getConsentSnapshot, getServerConsentSnapshot, subscribeConsentChoice } from '@/lib/consentPreferences';
import PartnerArtwork from '@/components/PartnerArtwork';

type PartnerPlayClientProps = {
  title: string;
  profilePath: string;
  image: string;
  playUrl: string;
  width: number;
  height: number;
};

function subscribeHydration() {
  return () => {};
}

function getHydratedSnapshot() {
  return true;
}

function getServerHydrationSnapshot() {
  return false;
}

export function PartnerPlayClient({ title, profilePath, image, playUrl, width, height }: PartnerPlayClientProps) {
  const hydrated = useSyncExternalStore(subscribeHydration, getHydratedSnapshot, getServerHydrationSnapshot);
  const consentChoice = useSyncExternalStore(subscribeConsentChoice, getConsentSnapshot, getServerConsentSnapshot);
  const [loaded, setLoaded] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!loaded || iframeReady) return undefined;
    const timer = window.setTimeout(() => setTimedOut(true), 12000);
    return () => window.clearTimeout(timer);
  }, [iframeReady, loaded, retryKey]);

  function loadGame() {
    if (!hydrated) return;
    setTimedOut(false);
    setIframeReady(false);
    setLoaded(true);
  }

  function retryGame() {
    setTimedOut(false);
    setIframeReady(false);
    setRetryKey((value) => value + 1);
  }

  if (!playUrl) {
    return (
      <section className="partner-consent-panel">
        <PartnerArtwork src={image} title={title} category="GR8 Select" priority variant="panel" sizes="(max-width: 900px) 92vw, 720px" />
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
        <PartnerArtwork src={image} title={title} category="GR8 Select" priority variant="panel" sizes="(max-width: 900px) 92vw, 720px" />
        <div>
          <span className="eyebrow">Load game</span>
          <h2>{title}</h2>
          <p>This opens an embedded game outside the core GR8 Originals library. Extra device, usage or advertising data may be processed by the game service under its own terms.</p>
          <div className="cta-row">
            <button type="button" className="cta-button" onClick={loadGame} disabled={!hydrated} aria-disabled={!hydrated}>
              {hydrated ? 'Load game' : 'Preparing game...'}
            </button>
            <Link href={profilePath} className="secondary-cta">Back to profile</Link>
          </div>
          {consentChoice === 'rejected' ? <p className="fine-print">You rejected optional site-wide cookies. You can still choose to load this specific partner game.</p> : null}
        </div>
      </section>
    );
  }

  return (
    <section className="partner-player" aria-label={`${title} partner game`}>
      {!iframeReady && !timedOut ? <div className="partner-player__status" role="status">Loading {title}...</div> : null}
      {timedOut ? (
        <div className="partner-player__fallback">
          <h2>{title} is taking longer than expected.</h2>
          <p>You can retry, return to the profile or choose another game.</p>
          <div className="cta-row">
            <button type="button" className="cta-button" onClick={retryGame}>Retry</button>
            <Link href={profilePath} className="secondary-cta">Game profile</Link>
          </div>
        </div>
      ) : null}
      <iframe
        key={retryKey}
        title={title}
        src={playUrl}
        width={width}
        height={height}
        loading="eager"
        sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-popups"
        allow="autoplay; fullscreen; gamepad"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={() => {
          setIframeReady(true);
          setTimedOut(false);
        }}
      />
    </section>
  );
}

export default PartnerPlayClient;
