'use client';

import { Analytics, type BeforeSendEvent } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { useConsentChoice } from '@/lib/consentPreferences';

function redactAnalyticsUrl(event: BeforeSendEvent): BeforeSendEvent | null {
  try {
    const url = new URL(event.url);
    if (url.pathname.startsWith('/challenge/')) return null;
    url.search = '';
    url.hash = '';
    return { ...event, url: url.toString() };
  } catch {
    return null;
  }
}

export default function VercelObservability() {
  const choice = useConsentChoice();

  if (choice !== 'accepted') return null;

  return (
    <>
      <Analytics beforeSend={redactAnalyticsUrl} />
      <SpeedInsights />
    </>
  );
}
