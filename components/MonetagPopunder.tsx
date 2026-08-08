'use client';

import { useEffect } from 'react';
import { useConsentChoice } from '@/lib/consentPreferences';

const MONETAG_ZONE = '11527055';
const MONETAG_SCRIPT_URL = 'https://al5sm.com/tag.min.js';
const MONETAG_SELECTOR = `script[data-zone="${MONETAG_ZONE}"]`;

export default function MonetagPopunder() {
  const consent = useConsentChoice();

  useEffect(() => {
    if (consent !== 'accepted') return;
    if (document.querySelector(MONETAG_SELECTOR)) return;

    const script = document.createElement('script');
    script.dataset.zone = MONETAG_ZONE;
    script.src = MONETAG_SCRIPT_URL;
    script.async = true;
    document.body.appendChild(script);
  }, [consent]);

  return null;
}
