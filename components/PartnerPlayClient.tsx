'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import {
  getConsentSnapshot,
  getServerConsentSnapshot,
  setConsentChoice,
  subscribeConsentChoice,
  useConsentAuthority
} from '@/lib/consentPreferences';
import PartnerArtwork from '@/components/PartnerArtwork';
import ChallengeShare from '@/components/ChallengeShare';
import GameShare from '@/components/GameShare';
import { openGooglePrivacyOptions } from '@/components/GoogleConsentBridge';
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
  const consentAuthority = useConsentAuthority();
  const copy = labels || tr(locale).engagement;
  const [loaded, setLoaded] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [requestingConsent, setRequestingConsent] = useState(false);
  const [consentError, setConsentError] = useState('');
  const startTrackedRef = useRef(false);
  const consentRequestRef = useRef(false);
  const consentAbortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);
  const gameSlug = profilePath.split('/').filter(Boolean).pop() || title.toLowerCase().replace(/\s+/g, '-');
  const privacyChoicesPath = locale === 'en' ? '/privacy-choices' : `/${locale}/privacy-choices`;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      consentAbortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (!loaded || iframeReady) return undefined;
    const timer = window.setTimeout(() => setTimedOut(true), 12000);
    return () => window.clearTimeout(timer);
  }, [iframeReady, loaded, retryKey]);

  const loadGame = useCallback(() => {
    if (loaded || !hydrated || (provider === 'gamemonetize' && consentChoice !== 'accepted')) return;
    setTimedOut(false);
    setIframeReady(false);
    recordGameStarted(gameSlug, 'select');
    if (!startTrackedRef.current) {
      startTrackedRef.current = true;
      trackEvent('game_play_start', { game_slug: gameSlug, game_type: 'select', locale, provider });
    }
    setLoaded(true);
  }, [consentChoice, gameSlug, hydrated, loaded, locale, provider]);

  useEffect(() => {
    if (provider !== 'gamemonetize' || !hydrated) return;
    const timer = window.setTimeout(() => {
      if (consentChoice === 'accepted') {
        setConsentError('');
        loadGame();
        return;
      }
      if (loaded) {
        setLoaded(false);
        setIframeReady(false);
        setTimedOut(false);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [consentChoice, hydrated, loadGame, loaded, provider]);

  async function requestOptionalConsent() {
    if (!hydrated || consentRequestRef.current) return;
    consentRequestRef.current = true;
    setRequestingConsent(true);
    setConsentError('');
    const controller = new AbortController();
    consentAbortRef.current = controller;
    try {
      if (consentAuthority === 'custom') {
        setConsentChoice('accepted');
        return;
      }
      const opened = await openGooglePrivacyOptions(5000, controller.signal);
      if (!opened && mountedRef.current) {
        setConsentError('Privacy choices could not be opened. Try again or use Privacy Choices below.');
      }
    } catch {
      if (mountedRef.current) setConsentError('Privacy choices could not be opened. Try again or use Privacy Choices below.');
    } finally {
      if (consentAbortRef.current === controller) consentAbortRef.current = null;
      consentRequestRef.current = false;
      if (mountedRef.current) setRequestingConsent(false);
    }
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
            <button
              type="button"
              className="cta-button"
              onClick={gameMonetizeBlocked ? requestOptionalConsent : loadGame}
              disabled={!hydrated || requestingConsent}
              aria-disabled={!hydrated || requestingConsent}
              aria-busy={requestingConsent}
            >
              {!hydrated ? 'Preparing game...' : requestingConsent ? 'Opening privacy choices...' : gameMonetizeBlocked ? 'Accept optional content to play' : 'Load game'}
            </button>
            <Link href={profilePath} className="secondary-cta">Back to profile</Link>
          </div>
          {gameMonetizeBlocked ? <p className="fine-print">This game includes provider-controlled advertising and can load only after you accept optional content in Privacy Choices.</p> : null}
          {consentError ? <p className="fine-print" role="alert">{consentError} <Link href={privacyChoicesPath}>Privacy Choices</Link></p> : null}
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
