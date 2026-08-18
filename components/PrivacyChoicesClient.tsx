'use client';

import { useEffect, useState } from 'react';
import { openGooglePrivacyOptions } from '@/components/GoogleConsentBridge';
import { setConsentChoice, useConsentAuthority, useConsentChoice } from '@/lib/consentPreferences';
import { setPartnerContentChoice, usePartnerContentChoice } from '@/lib/partnerContentConsent';

export default function PrivacyChoicesClient() {
  const choice = useConsentChoice();
  const partnerChoice = usePartnerContentChoice();
  const authority = useConsentAuthority();
  const [ready, setReady] = useState(false);
  const [googleMessage, setGoogleMessage] = useState('');

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

  async function openGoogleSettings() {
    setGoogleMessage('');
    const opened = await openGooglePrivacyOptions();
    if (!opened) setGoogleMessage('Google privacy settings are not available yet. Your current Google consent remains unchanged.');
  }

  return (
    <section className="content-panel">
      <h2>External GR8 Select games</h2>
      <p>Choose whether external GR8 Select games may load on this device. These games may process device, usage and advertising data under the game service&apos;s own terms.</p>
      <p>Current external game choice: <strong>{partnerChoice === 'unknown' ? 'loading' : partnerChoice || 'not set'}</strong></p>
      <div className="cta-row">
        <button type="button" className="cta-button" disabled={!ready} onClick={() => setPartnerContentChoice('accepted')}>Allow external games</button>
        <button type="button" className="secondary-button" disabled={!ready} onClick={() => setPartnerContentChoice('rejected')}>Block external games</button>
      </div>
      <hr />
      <h2>Site privacy choices</h2>
      <p>Current optional resource choice: <strong>{choice === 'unknown' ? 'loading' : choice || 'not set'}</strong></p>
      <div className="cta-row">
        {authority === 'google-cmp' ? (
          <button type="button" className="cta-button" disabled={!ready} onClick={() => void openGoogleSettings()}>Open Google privacy settings</button>
        ) : authority === 'custom' ? (
          <>
            <button type="button" className="cta-button" disabled={!ready} onClick={() => choose('accepted')}>Accept All</button>
            <button type="button" className="secondary-button" disabled={!ready} onClick={() => choose('rejected')}>Reject All</button>
          </>
        ) : null}
        <button type="button" className="secondary-button" onClick={clearArcadeStorage}>Clear My Arcade storage</button>
      </div>
      {googleMessage ? <p className="fine-print" role="status">{googleMessage}</p> : null}
    </section>
  );
}
