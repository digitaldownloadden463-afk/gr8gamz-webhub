'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import PartnerArtwork from '@/components/PartnerArtwork';
import ChallengeShare from '@/components/ChallengeShare';
import GameShare from '@/components/GameShare';
import { recordGameStarted } from '@/lib/playerEngagement';
import { tr, type EngagementText, type Locale } from '@/lib/i18n';
import { trackEvent } from '@/lib/analytics';
import {
  getPartnerContentSnapshot,
  getServerPartnerContentSnapshot,
  setPartnerContentChoice,
  subscribePartnerContentChoice
} from '@/lib/partnerContentConsent';
import { partnerContentText } from '@/lib/partnerContentTranslations';

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
  const partnerContentChoice = useSyncExternalStore(
    subscribePartnerContentChoice,
    getPartnerContentSnapshot,
    getServerPartnerContentSnapshot
  );
  const copy = labels || tr(locale).engagement;
  const consentCopy = partnerContentText(locale);
  const [loaded, setLoaded] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [consentDialogOpen, setConsentDialogOpen] = useState(false);
  const startTrackedRef = useRef(false);
  const consentDialogRef = useRef<HTMLDivElement | null>(null);
  const consentActionRef = useRef<HTMLButtonElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const gameSlug = profilePath.split('/').filter(Boolean).pop() || title.toLowerCase().replace(/\s+/g, '-');
  const privacyChoicesPath = '/privacy-choices';

  useEffect(() => {
    if (!consentDialogOpen) return undefined;
    restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const frame = window.requestAnimationFrame(() => consentActionRef.current?.focus());
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setConsentDialogOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = consentDialogRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('keydown', closeOnEscape);
      restoreFocusRef.current?.focus();
    };
  }, [consentDialogOpen]);

  useEffect(() => {
    if (!loaded || iframeReady) return undefined;
    const timer = window.setTimeout(() => setTimedOut(true), 25000);
    return () => window.clearTimeout(timer);
  }, [iframeReady, loaded, retryKey]);

  const loadGame = useCallback(() => {
    if (loaded || !hydrated || (provider === 'gamemonetize' && partnerContentChoice !== 'accepted')) return;
    setTimedOut(false);
    setIframeReady(false);
    recordGameStarted(gameSlug, 'select');
    if (!startTrackedRef.current) {
      startTrackedRef.current = true;
      trackEvent('game_play_start', { game_slug: gameSlug, game_type: 'select', locale, provider });
    }
    setLoaded(true);
  }, [gameSlug, hydrated, loaded, locale, partnerContentChoice, provider]);

  useEffect(() => {
    if (provider !== 'gamemonetize' || !hydrated) return;
    const timer = window.setTimeout(() => {
      if (partnerContentChoice === 'accepted') {
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
  }, [hydrated, loadGame, loaded, partnerContentChoice, provider]);

  function choosePartnerContent(choice: 'accepted' | 'rejected') {
    setPartnerContentChoice(choice);
    setConsentDialogOpen(false);
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
    const gameMonetizeBlocked = provider === 'gamemonetize' && partnerContentChoice !== 'accepted';
    return (
      <>
        <section className="partner-consent-panel">
          <PartnerArtwork src={image} title={title} category="GR8 Select" priority variant="panel" sizes="(max-width: 900px) 92vw, 720px" />
          <div>
            <span className="eyebrow">{tr(locale).common.loadGame}</span>
            <h2>{title}</h2>
            <p>{consentCopy.dialogBody}</p>
            <div className="cta-row">
              <button
                type="button"
                className="cta-button"
                onClick={gameMonetizeBlocked ? () => setConsentDialogOpen(true) : loadGame}
                disabled={!hydrated}
                aria-disabled={!hydrated}
              >
                {!hydrated ? `${tr(locale).common.loadGame}...` : gameMonetizeBlocked ? (partnerContentChoice === 'rejected' ? consentCopy.changeChoice : consentCopy.consentAction) : tr(locale).common.loadGame}
              </button>
              <Link href={profilePath} className="secondary-cta">{copy.gameDetails}</Link>
            </div>
            {gameMonetizeBlocked ? <p className="fine-print">{consentCopy.blockedNotice} <Link href={privacyChoicesPath}>{consentCopy.privacyChoices}</Link></p> : null}
          </div>
        </section>
        {consentDialogOpen ? (
          <div className="partner-consent-dialog-backdrop" role="presentation">
            <div
              ref={consentDialogRef}
              className="partner-consent-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="partner-consent-title"
              aria-describedby="partner-consent-description"
            >
              <button type="button" className="partner-consent-dialog__close" aria-label={consentCopy.close} onClick={() => setConsentDialogOpen(false)}>&times;</button>
              <span className="eyebrow">GR8 Select</span>
              <h2 id="partner-consent-title">{consentCopy.dialogTitle}</h2>
              <p id="partner-consent-description">{consentCopy.dialogBody}</p>
              <p className="fine-print">{consentCopy.dialogDetail}</p>
              <div className="partner-consent-dialog__actions">
                <button ref={consentActionRef} type="button" className="cta-button" onClick={() => choosePartnerContent('accepted')}>{consentCopy.allowGame}</button>
                <button type="button" className="secondary-button" onClick={() => choosePartnerContent('rejected')}>{consentCopy.keepBlocked}</button>
              </div>
              <Link href={privacyChoicesPath}>{consentCopy.privacyChoices}</Link>
            </div>
          </div>
        ) : null}
      </>
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
