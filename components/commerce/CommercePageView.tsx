'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';
import type { CommercePageType } from '@/lib/commerce/types';
import { useConsentChoice } from '@/lib/consentPreferences';

export default function CommercePageView({ pageType, pageSlug, category, productSlug, productName }: {
  pageType: CommercePageType;
  pageSlug: string;
  category?: string;
  productSlug?: string;
  productName?: string;
}) {
  const consent = useConsentChoice();
  const trackedKey = useRef('');

  useEffect(() => {
    if (consent !== 'accepted') return;
    const key = `${pageType}:${pageSlug}`;
    if (trackedKey.current === key) return;
    const eventName = pageType === 'product'
      ? 'product_view'
      : pageType === 'guide' || pageType === 'comparison'
        ? 'affiliate_guide_view'
        : 'affiliate_catalogue_view';
    if (!trackEvent(eventName, {
      merchant: 'gadgethyper',
      locale: document.documentElement.lang || 'en',
      page_type: pageType,
      category,
      product_slug: productSlug,
      product_name: productName,
      guide_slug: pageType === 'guide' || pageType === 'comparison' ? pageSlug : undefined
    })) return;
    trackedKey.current = key;
  }, [category, consent, pageSlug, pageType, productName, productSlug]);
  return null;
}
