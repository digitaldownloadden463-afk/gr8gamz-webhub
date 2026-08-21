'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';
import type { Locale } from '@/lib/i18n';

export default function PartnerProfileAnalytics({ slug, provider, locale = 'en' }: { slug: string; provider: 'gamepix' | 'gamemonetize'; locale?: Locale }) {
  useEffect(() => {
    trackEvent('partner_profile_view', {
      game_slug: slug,
      game_type: 'select',
      provider,
      locale
    });
  }, [locale, provider, slug]);
  return null;
}
