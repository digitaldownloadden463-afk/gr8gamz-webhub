'use client';

import { setConsentChoice, useConsentChoice } from '@/lib/consentPreferences';

export default function PrivacyChoicesClient() {
  const choice = useConsentChoice();

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
        <button type="button" className="cta-button" onClick={() => choose('accepted')}>Accept All</button>
        <button type="button" className="secondary-button" onClick={() => choose('rejected')}>Reject All</button>
        <button type="button" className="secondary-button" onClick={clearArcadeStorage}>Clear My Arcade storage</button>
      </div>
    </section>
  );
}
