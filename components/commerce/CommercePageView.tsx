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
    if (pageType !== 'product' && pageType !== 'guide' && pageType !== 'comparison') return;
    const key = `${pageType}:${pageSlug}`;
    if (trackedKey.current === key) return;
    if (!trackEvent(pageType === 'product' ? 'product_view' : 'affiliate_guide_view', {
      merchant: 'razer',
      locale: 'en',
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
