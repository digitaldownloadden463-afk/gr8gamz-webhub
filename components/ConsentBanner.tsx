'use client';

import {
  getConsentChoice,
  setConsentChoice,
  useConsentChoice,
  type ConsentChoice
} from '@/lib/consentPreferences';

export { getConsentChoice, setConsentChoice };
export type { ConsentChoice };

export function ConsentBanner() {
  const choice = useConsentChoice();

  if (choice === 'unknown' || choice) return null;

  return (
    <section className="consent-banner" aria-label="Privacy choices">
      <div>
        <strong>Privacy choices</strong>
        <p>GR8 GAMZ uses essential local-device storage for My Arcade. Optional partner games, analytics or ads only load after a clear choice.</p>
      </div>
      <div className="consent-banner__actions">
        <button type="button" className="cta-button" onClick={() => setConsentChoice('accepted')}>Accept All</button>
        <button type="button" className="secondary-button" onClick={() => setConsentChoice('rejected')}>Reject All</button>
      </div>
    </section>
  );
}

export default ConsentBanner;
