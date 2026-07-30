'use client';

import { useEffect, useState } from 'react';
import { setConsentChoice, useConsentChoice } from '@/lib/consentPreferences';

export default function PrivacyChoicesClient() {
  const choice = useConsentChoice();
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
        <button type="button" className="cta-button" disabled={!ready} onClick={() => choose('accepted')}>Accept All</button>
        <button type="button" className="secondary-button" disabled={!ready} onClick={() => choose('rejected')}>Reject All</button>
        <button type="button" className="secondary-button" onClick={clearArcadeStorage}>Clear My Arcade storage</button>
      </div>
    </section>
  );
}
