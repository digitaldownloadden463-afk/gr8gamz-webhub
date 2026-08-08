'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useConsentChoice } from '@/lib/consentPreferences';
import { flushPendingAnalyticsEvents } from '@/lib/analytics';

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const scriptId = 'gr8-ga4-script';
const safeSearchKeys = new Set(['category', 'control', 'difficulty', 'page', 'q']);

function safePagePath(pathname: string, rawSearch: string) {
  const source = new URLSearchParams(rawSearch);
  const safe = new URLSearchParams();

  for (const [key, value] of source) {
    if (!safeSearchKeys.has(key)) continue;
    const normalized = value.trim().slice(0, key === 'q' ? 80 : 40);
    if (!normalized) continue;
    if (key === 'q' && (!/^[\p{L}\p{N}\s'._-]+$/u.test(normalized) || /@|\d{9,}/.test(normalized))) continue;
    safe.append(key, normalized);
  }

  const query = safe.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export default function GoogleAnalytics() {
  const consent = useConsentChoice();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rawSearch = searchParams.toString();
  const pagePath = safePagePath(pathname, rawSearch);

  useEffect(() => {
    if (consent !== 'accepted' || !measurementId) return;
    if (pathname.startsWith('/challenge/')) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

    if (!window.__gr8GaInitialized) {
      window.gtag('js', new Date());
      window.gtag('config', measurementId, { send_page_view: false });
      window.__gr8GaInitialized = true;
    }
    flushPendingAnalyticsEvents();

    const exactScriptUrl = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    if (!document.getElementById(scriptId) && !document.querySelector(`script[src="${exactScriptUrl}"]`)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.src = exactScriptUrl;
      document.head.appendChild(script);
    }

    if (window.__gr8GaLastPageView === pagePath) return;
    window.__gr8GaLastPageView = pagePath;
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_location: `${window.location.origin}${pagePath}`,
      page_title: document.title
    });
  }, [consent, pagePath, pathname]);

  return null;
}
