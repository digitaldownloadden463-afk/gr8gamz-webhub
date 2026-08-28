'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';
import { useConsentChoice } from '@/lib/consentPreferences';

export default function GameHubViewTracker({ hubId, parentCategory, pageNumber }: { hubId: string; parentCategory: string; pageNumber: number }) {
  const consent = useConsentChoice();
  const sent = useRef(false);
  useEffect(() => {
    if (consent !== 'accepted') return;
    if (sent.current) return;
    sent.current = trackEvent('game_hub_view', {
      hub_id: hubId,
      parent_category: parentCategory,
      page_number: pageNumber,
      source_surface: pageNumber === 1 ? 'hub-landing' : 'hub-pagination'
    });
  }, [consent, hubId, pageNumber, parentCategory]);
  return null;
}
