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
  | 'affiliate_product_impression'
  | 'classroom_hub_view'
  | 'classroom_timer_view'
  | 'timer_preset_selected'
  | 'timer_custom_set'
  | 'timer_started'
  | 'timer_paused'
  | 'timer_resumed'
  | 'timer_completed'
  | 'timer_reset'
  | 'timer_fullscreen'
  | 'timer_sound_enabled'
  | 'classroom_game_selected'
  | 'classroom_filter_used'
  | 'game_hub_view'
  | 'game_hub_filter_used'
  | 'game_hub_pagination_used'
  | 'game_hub_game_selected'
  | 'related_hub_selected'
  | 'category_discovery_selected';

export type AnalyticsParameters = Partial<{
  game_slug: string;
  game_type: 'original' | 'select';
  locale: string;
  provider: 'gr8' | 'gamepix' | 'gamemonetize';
  merchant: 'razer';
  product_slug: string;
  product_name: string;
  guide_slug: string;
  category: string;
  page_type: 'hub' | 'category' | 'guide' | 'comparison' | 'product';
  link_position: string;
  destination_type: 'merchant_product';
  timer_seconds: number;
  timer_mode: 'standard' | 'calm';
  classroom_section: string;
  hub_id: string;
  parent_category: string;
  filter_id: string;
  page_number: number;
  source_surface: string;
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
  'game_slug', 'game_type', 'locale', 'provider', 'merchant', 'product_slug', 'product_name', 'guide_slug', 'category', 'page_type', 'link_position', 'destination_type', 'timer_seconds', 'timer_mode', 'classroom_section', 'hub_id', 'parent_category', 'filter_id', 'page_number', 'source_surface'
]);
const pendingEvents: Array<{ name: AnalyticsEventName; parameters: Record<string, string | number> }> = [];

function safeParameters(parameters: AnalyticsParameters) {
  const result: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(parameters)) {
    if (!safeParameterKeys.has(key as keyof AnalyticsParameters)) continue;
    if (key === 'timer_seconds' || key === 'page_number') {
      if (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 359999) result[key] = value;
      continue;
    }
    if (typeof value !== 'string') continue;
    const normalized = value.trim().slice(0, 100);
    if (!normalized) continue;
    if (key === 'game_slug' && !/^[a-z0-9-]+$/.test(normalized)) continue;
    if (key === 'game_type' && normalized !== 'original' && normalized !== 'select') continue;
    if (key === 'locale' && !/^[a-z]{2}(?:-[A-Z]{2})?$/.test(normalized)) continue;
    if (key === 'provider' && !['gr8', 'gamepix', 'gamemonetize'].includes(normalized)) continue;
    if (key === 'merchant' && normalized !== 'razer') continue;
    if (key === 'page_type' && !['hub', 'category', 'guide', 'comparison', 'product'].includes(normalized)) continue;
    if (['product_slug', 'guide_slug', 'category', 'link_position'].includes(key) && !/^[a-z0-9_-]+$/.test(normalized)) continue;
    if (key === 'destination_type' && normalized !== 'merchant_product') continue;
    if (key === 'timer_mode' && !['standard', 'calm'].includes(normalized)) continue;
    if (key === 'classroom_section' && !/^[a-z0-9_-]+$/.test(normalized)) continue;
    if (['hub_id', 'parent_category', 'filter_id', 'source_surface'].includes(key) && !/^[a-z0-9_-]+$/.test(normalized)) continue;
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
