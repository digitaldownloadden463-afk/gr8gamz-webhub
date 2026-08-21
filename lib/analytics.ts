'use client';

import { getConsentChoice } from '@/lib/consentPreferences';

export type AnalyticsEventName =
  | 'game_play_start'
  | 'game_play_complete'
  | 'game_favourite'
  | 'game_share'
  | 'affiliate_click'
  | 'search'
  | 'language_change'
  | 'affiliate_guide_view'
  | 'product_view'
  | 'partner_profile_view'
  | 'affiliate_product_impression';

export type AnalyticsParameters = Partial<{
  game_slug: string;
  game_type: 'original' | 'select';
  locale: string;
  provider: 'gr8' | 'gamepix' | 'gamemonetize';
  merchant: 'razer';
  product_id: string;
  product_name: string;
  category: string;
  page_type: 'hub' | 'category' | 'guide' | 'comparison' | 'product';
  cta_position: string;
}>;

type GtagCommand = 'config' | 'consent' | 'event' | 'js';
type Gtag = (command: GtagCommand, target: string | Date, parameters?: Record<string, unknown>) => void;

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: Gtag;
    __gr8GaInitialized?: boolean;
    __gr8GaLastPageView?: string;
  }
}

const safeParameterKeys = new Set<keyof AnalyticsParameters>([
  'game_slug', 'game_type', 'locale', 'provider', 'merchant', 'product_id', 'product_name', 'category', 'page_type', 'cta_position'
]);
const pendingEvents: Array<{ name: AnalyticsEventName; parameters: Record<string, string> }> = [];

function safeParameters(parameters: AnalyticsParameters) {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(parameters)) {
    if (!safeParameterKeys.has(key as keyof AnalyticsParameters) || typeof value !== 'string') continue;
    const normalized = value.trim().slice(0, 100);
    if (!normalized) continue;
    if (key === 'game_slug' && !/^[a-z0-9-]+$/.test(normalized)) continue;
    if (key === 'game_type' && normalized !== 'original' && normalized !== 'select') continue;
    if (key === 'locale' && !/^[a-z]{2}(?:-[A-Z]{2})?$/.test(normalized)) continue;
    if (key === 'provider' && !['gr8', 'gamepix', 'gamemonetize'].includes(normalized)) continue;
    if (key === 'merchant' && normalized !== 'razer') continue;
    if (key === 'page_type' && !['hub', 'category', 'guide', 'comparison', 'product'].includes(normalized)) continue;
    if (['product_id', 'category', 'cta_position'].includes(key) && !/^[a-z0-9_-]+$/.test(normalized)) continue;
    result[key] = normalized;
  }
  return result;
}

export function flushPendingAnalyticsEvents() {
  try {
    if (typeof window === 'undefined' || getConsentChoice() !== 'accepted') return;
    if (!window.__gr8GaInitialized || typeof window.gtag !== 'function') return;
    for (const event of pendingEvents.splice(0)) window.gtag('event', event.name, event.parameters);
  } catch {}
}

export function trackEvent(name: AnalyticsEventName, parameters: AnalyticsParameters = {}) {
  try {
    if (typeof window === 'undefined') return false;
    if (getConsentChoice() !== 'accepted') return false;
    const sanitized = safeParameters(parameters);
    if (!window.__gr8GaInitialized || typeof window.gtag !== 'function') {
      if (pendingEvents.length < 20) pendingEvents.push({ name, parameters: sanitized });
      return true;
    }
    window.gtag('event', name, sanitized);
    return true;
  } catch {
    return false;
  }
}
