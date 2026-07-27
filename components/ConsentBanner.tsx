'use client';

import { useEffect, useState } from 'react';

type ConsentChoice = 'accepted' | 'rejected';

const key = 'gr8:privacy-consent';

export function getConsentChoice(): ConsentChoice | null {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(key);
  return value === 'accepted' || value === 'rejected' ? value : null;
}

export function setConsentChoice(choice: ConsentChoice) {
  window.localStorage.setItem(key, choice);
  window.dispatchEvent(new CustomEvent('gr8-consent-change', { detail: choice }));
}

export function ConsentBanner() {
  const [choice, setChoice] = useState<ConsentChoice | null>(() => getConsentChoice());

  useEffect(() => {
    const listener = () => setChoice(getConsentChoice());
    window.addEventListener('gr8-consent-change', listener);
    return () => window.removeEventListener('gr8-consent-change', listener);
  }, []);

  if (choice) return null;

  return (
    <section className="consent-banner" aria-label="Privacy choices">
      <div>
        <strong>Privacy choices</strong>
        <p>GR8 GAMZ uses essential local storage for My Arcade. Optional partner games, analytics or ads only load after a clear choice.</p>
      </div>
      <div className="consent-banner__actions">
        <button type="button" className="cta-button" onClick={() => setConsentChoice('accepted')}>Accept All</button>
        <button type="button" className="secondary-button" onClick={() => setConsentChoice('rejected')}>Reject All</button>
      </div>
    </section>
  );
}

export default ConsentBanner;
