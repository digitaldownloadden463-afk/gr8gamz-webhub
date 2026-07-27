'use client';

import { useState } from 'react';
import { getConsentChoice, setConsentChoice } from '@/components/ConsentBanner';

export default function PrivacyChoicesClient() {
  const [choice, setChoice] = useState<string>(() => getConsentChoice() || 'not set');

  function choose(next: 'accepted' | 'rejected') {
    setConsentChoice(next);
    setChoice(next);
  }

  function clearArcadeStorage() {
    window.localStorage.removeItem('gr8:favourites');
    window.localStorage.removeItem('gr8:recent');
  }

  return (
    <section className="content-panel">
      <p>Current optional resource choice: <strong>{choice}</strong></p>
      <div className="cta-row">
        <button type="button" className="cta-button" onClick={() => choose('accepted')}>Accept All</button>
        <button type="button" className="secondary-button" onClick={() => choose('rejected')}>Reject All</button>
        <button type="button" className="secondary-button" onClick={clearArcadeStorage}>Clear My Arcade storage</button>
      </div>
    </section>
  );
}
