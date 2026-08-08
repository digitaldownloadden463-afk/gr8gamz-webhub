'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { getConsentSnapshot, getServerConsentSnapshot, subscribeConsentChoice } from '@/lib/consentPreferences';
import PartnerArtwork from '@/components/PartnerArtwork';
import ChallengeShare from '@/components/ChallengeShare';
import GameShare from '@/components/GameShare';
import { recordGameStarted } from '@/lib/playerEngagement';
import { tr, type EngagementText, type Locale } from '@/lib/i18n';
import { trackEvent } from '@/lib/analytics';

type PartnerPlayClientProps = {
  title: string;
  profilePath: string;
  image: string;
  playUrl: string;
  width: number;
  height: number;
  provider?: 'gamepix' | 'gamemonetize';
  locale?: Locale;
  labels?: EngagementText;
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

export function PartnerPlayClient({ title, profilePath, image, playUrl, width, height, provider = 'gamepix', locale = 'en', labels }: PartnerPlayClientProps) {
  const hydrated = useSyncExternalStore(subscribeHydration, getHydratedSnapshot, getServerHydrationSnapshot);
  const consentChoice = useSyncExternalStore(subscribeConsentChoice, getConsentSnapshot, getServerConsentSnapshot);
  const copy = labels || tr(locale).engagement;
  const [loaded, setLoaded] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const startTrackedRef = useRef(false);
  const gameSlug = profilePath.split('/').filter(Boolean).pop() || title.toLowerCase().replace(/\s+/g, '-');

  useEffect(() => {
    if (!loaded || iframeReady) return undefined;
    const timer = window.setTimeout(() => setTimedOut(true), 12000);
    return () => window.clearTimeout(timer);
  }, [iframeReady, loaded, retryKey]);

  function loadGame() {
    if (!hydrated || (provider === 'gamemonetize' && consentChoice !== 'accepted')) return;
    setTimedOut(false);
    setIframeReady(false);
    recordGameStarted(gameSlug, 'select');
    if (!startTrackedRef.current) {
      startTrackedRef.current = true;
      trackEvent('game_play_start', { game_slug: gameSlug, game_type: 'select', locale, provider });
    }
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
    const gameMonetizeBlocked = provider === 'gamemonetize' && consentChoice !== 'accepted';
    return (
      <section className="partner-consent-panel">
        <PartnerArtwork src={image} title={title} category="GR8 Select" priority variant="panel" sizes="(max-width: 900px) 92vw, 720px" />
        <div>
          <span className="eyebrow">Load game</span>
          <h2>{title}</h2>
          <p>This opens an embedded game outside the core GR8 Originals library. Extra device, usage or advertising data may be processed by the game service under its own terms.</p>
          <div className="cta-row">
            <button type="button" className="cta-button" onClick={loadGame} disabled={!hydrated || gameMonetizeBlocked} aria-disabled={!hydrated || gameMonetizeBlocked}>
              {!hydrated ? 'Preparing game...' : gameMonetizeBlocked ? 'Accept optional content to play' : 'Load game'}
            </button>
            <Link href={profilePath} className="secondary-cta">Back to profile</Link>
          </div>
          {gameMonetizeBlocked ? <p className="fine-print">This game includes provider-controlled advertising and can load only after you accept optional content in Privacy Choices.</p> : null}
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
      <section className="partner-afterplay">
        <GameShare title={title} url={profilePath} text={`Challenge a friend to try ${title} on GR8 GAMZ.`} labels={copy} />
        <ChallengeShare gameSlug={gameSlug} gameTitle={title} kind="select" locale={locale} labels={copy} />
      </section>
    </section>
  );
}

export default PartnerPlayClient;
