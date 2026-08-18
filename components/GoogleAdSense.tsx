'use client';

import { useEffect } from 'react';
import { adsenseConfig } from '@/lib/ads/config';

export default function GoogleAdSense() {
  useEffect(() => {
    // Google's tag must be available before a choice so its certified CMP can
    // display on any entry route. Consent defaults are denied in the initial
    // document head; Auto ads route exclusions are managed in AdSense.
    if (!adsenseConfig.enabled) return;
    if (document.getElementById(adsenseConfig.scriptId)) return;
    if (document.querySelector(`script[src="${adsenseConfig.scriptUrl}"]`)) return;

    const script = document.createElement('script');
    script.id = adsenseConfig.scriptId;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = adsenseConfig.scriptUrl;
    document.head.appendChild(script);
  }, []);

  return null;
}
