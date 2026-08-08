'use client';

import { useEffect } from 'react';
import { useConsentChoice } from '@/lib/consentPreferences';

const IMPACT_SCRIPT_URL = 'https://utt.impactcdn.com/P-A7586931-c266-49bb-bc60-1b14443f47521.js';
const IMPACT_SCRIPT_SELECTOR = `script[src="${IMPACT_SCRIPT_URL}"]`;

type ImpactStat = {
  (...args: string[]): void;
  a?: string[][];
};

declare global {
  interface Window {
    impactStat?: ImpactStat;
    ire_o?: string;
    __gr8LenovoImpactInitialized?: boolean;
  }
}

export default function LenovoImpactTracking() {
  const consent = useConsentChoice();

  useEffect(() => {
    if (consent !== 'accepted' || window.__gr8LenovoImpactInitialized) return;

    window.ire_o = 'impactStat';
    if (!window.impactStat) {
      const queuedImpactStat: ImpactStat = (...args) => {
        queuedImpactStat.a = queuedImpactStat.a || [];
        queuedImpactStat.a.push(args);
      };
      window.impactStat = queuedImpactStat;
    }

    if (!document.querySelector(IMPACT_SCRIPT_SELECTOR)) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = IMPACT_SCRIPT_URL;
      script.async = true;
      script.dataset.gr8Integration = 'lenovo-impact';
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript?.parentNode) firstScript.parentNode.insertBefore(script, firstScript);
      else document.body.appendChild(script);
    }

    window.impactStat('transformLinks');
    window.impactStat('trackImpression');
    window.__gr8LenovoImpactInitialized = true;
  }, [consent]);

  return null;
}

