'use client';

import { useEffect, useState } from 'react';
import { openGooglePrivacyOptions } from '@/components/GoogleConsentBridge';
import { setConsentChoice, useConsentAuthority, useConsentChoice } from '@/lib/consentPreferences';

export default function PrivacyChoicesClient() {
  const choice = useConsentChoice();
  const authority = useConsentAuthority();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function choose(next: 'accepted' | 'rejected') {
    setConsentChoice(next);
  }

  function clearArcadeStorage() {
    try {
      window.localStorage.removeItem('gr8:favourites');
      window.localStorage.removeItem('gr8:recent');
    } catch {}
  }

  return (
    <section className="content-panel">
      <p>Current optional resource choice: <strong>{choice === 'unknown' ? 'loading' : choice || 'not set'}</strong></p>
      <div className="cta-row">
        {authority === 'google-cmp' ? (
          <button type="button" className="cta-button" disabled={!ready} onClick={() => void openGooglePrivacyOptions()}>Open privacy and cookie settings</button>
        ) : authority === 'custom' ? (
          <>
            <button type="button" className="cta-button" disabled={!ready} onClick={() => choose('accepted')}>Accept All</button>
            <button type="button" className="secondary-button" disabled={!ready} onClick={() => choose('rejected')}>Reject All</button>
          </>
        ) : null}
        <button type="button" className="secondary-button" onClick={clearArcadeStorage}>Clear My Arcade storage</button>
      </div>
    </section>
  );
}
