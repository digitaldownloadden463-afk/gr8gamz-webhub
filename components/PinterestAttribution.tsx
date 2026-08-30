'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';
import { useConsentChoice } from '@/lib/consentPreferences';

function destinationType(pathname: string) {
  if (pathname === '/') return 'homepage' as const;
  if (pathname.startsWith('/arcade/') || pathname.startsWith('/more-free-games/'))
    return 'game' as const;
  return 'collection' as const;
}

export default function PinterestAttribution() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const consent = useConsentChoice();
  const sentKey = useRef('');

  useEffect(() => {
    if (consent !== 'accepted') return;
    const source = searchParams.get('utm_source');
    const medium = searchParams.get('utm_medium');
    const campaign = searchParams.get('utm_campaign') || '';
    const creativeId = searchParams.get('utm_content') || '';
    if (source !== 'pinterest' || medium !== 'organic') return;
    if (!/^[a-z0-9-]{1,80}$/.test(campaign) || !/^pin-[a-z0-9-]{1,96}$/.test(creativeId)) return;
    const key = `${pathname}|${campaign}|${creativeId}`;
    if (sentKey.current === key) return;
    const locale = document.documentElement.lang || 'en';
    if (
      trackEvent('pinterest_landing', {
        creative_id: creativeId,
        campaign,
        destination_type: destinationType(pathname),
        locale,
        source_surface: 'pinterest-organic',
      })
    )
      sentKey.current = key;
  }, [consent, pathname, searchParams]);

  return null;
}
