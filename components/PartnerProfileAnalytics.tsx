'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';
import { useConsentChoice } from '@/lib/consentPreferences';
import type { Locale } from '@/lib/i18n';

export default function PartnerProfileAnalytics({ slug, provider, locale = 'en' }: { slug: string; provider: 'gamepix' | 'gamemonetize'; locale?: Locale }) {
  const consent = useConsentChoice();
  const trackedKey = useRef('');

  useEffect(() => {
    if (consent !== 'accepted') return;
    const key = `${slug}:${provider}:${locale}`;
    if (trackedKey.current === key) return;
    if (!trackEvent('partner_profile_view', {
      game_slug: slug,
      game_type: 'select',
      provider,
      locale
    })) return;
    trackedKey.current = key;
  }, [consent, locale, provider, slug]);

  return null;
}
