'use client';

import { useEffect } from 'react';
import { useConsentChoice } from '@/lib/consentPreferences';

const IMPACT_SCRIPT_URL = 'https://utt.impactcdn.com/P-A7586931-c266-49bb-bc60-1b14443f47521.js';
const IMPACT_SCRIPT_ID = 'gr8-lenovo-impact';
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

    const existingScript = document.querySelector<HTMLScriptElement>(`script#${IMPACT_SCRIPT_ID}`)
      || document.querySelector<HTMLScriptElement>(IMPACT_SCRIPT_SELECTOR);

    if (!existingScript) {
      const script = document.createElement('script');
      script.id = IMPACT_SCRIPT_ID;
      script.type = 'text/javascript';
      script.src = IMPACT_SCRIPT_URL;
      script.async = true;
      script.dataset.gr8Integration = 'lenovo-impact';
      document.head.appendChild(script);
    } else {
      existingScript.id = IMPACT_SCRIPT_ID;
      existingScript.dataset.gr8Integration = 'lenovo-impact';
      if (existingScript.parentElement !== document.head) document.head.appendChild(existingScript);
    }

    window.impactStat('transformLinks');
    window.impactStat('trackImpression');
    window.__gr8LenovoImpactInitialized = true;
  }, [consent]);

  return null;
}
