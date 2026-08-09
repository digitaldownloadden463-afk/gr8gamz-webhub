'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useConsentChoice } from '@/lib/consentPreferences';
import { adsenseConfig } from '@/lib/ads/config';
import { getAdPolicy } from '@/lib/ads/adPolicy';

export default function GoogleAdSense() {
  const consent = useConsentChoice();
  const pathname = usePathname();
  const policy = getAdPolicy(pathname);

  useEffect(() => {
    if (!adsenseConfig.enabled || consent !== 'accepted' || !policy.autoAdsAllowed) return;
    if (document.getElementById(adsenseConfig.scriptId)) return;
    if (document.querySelector(`script[src="${adsenseConfig.scriptUrl}"]`)) return;

    const script = document.createElement('script');
    script.id = adsenseConfig.scriptId;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = adsenseConfig.scriptUrl;
    script.dataset.gr8Integration = 'google-adsense';
    document.head.appendChild(script);
  }, [consent, policy.autoAdsAllowed]);

  return null;
}
