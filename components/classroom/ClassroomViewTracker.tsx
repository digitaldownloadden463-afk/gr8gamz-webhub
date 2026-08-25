'use client';

import { useEffect, useRef } from 'react';
import { trackEvent, type AnalyticsEventName } from '@/lib/analytics';
import { useConsentChoice } from '@/lib/consentPreferences';

export default function ClassroomViewTracker({ event }: { event: Extract<AnalyticsEventName, 'classroom_hub_view' | 'classroom_timer_view'> }) {
  const consent = useConsentChoice();
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current || consent !== 'accepted') return;
    sent.current = trackEvent(event, { locale: 'en' });
  }, [consent, event]);
  return null;
}
