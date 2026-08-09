'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';
import type { CommercePageType } from '@/lib/commerce/types';

export default function CommercePageView({ pageType, category, productId, productName }: {
  pageType: CommercePageType;
  category?: string;
  productId?: string;
  productName?: string;
}) {
  useEffect(() => {
    trackEvent(pageType === 'product' ? 'product_view' : 'affiliate_guide_view', {
      merchant: 'razer', page_type: pageType, category, product_id: productId, product_name: productName
    });
  }, [pageType, category, productId, productName]);
  return null;
}
