'use client';

import type { ReactNode } from 'react';
import { trackEvent } from '@/lib/analytics';
import type { CommercePageType, CommerceProduct } from '@/lib/commerce/types';
import { buildAffiliateUrl, commercePageId } from '@/lib/commerce/affiliate';

export default function AffiliateLink({ product, pageType, pageSlug, position, className, children }: {
  product: CommerceProduct;
  pageType: CommercePageType;
  pageSlug: string;
  position: string;
  className?: string;
  children: ReactNode;
}) {
  const href = buildAffiliateUrl(product, commercePageId(pageType, pageSlug), position);
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener"
      className={className}
      onClick={() => trackEvent('affiliate_click', {
        merchant: product.merchant,
        product_id: product.id,
        product_name: product.name,
        category: product.category,
        page_type: pageType,
        cta_position: position
      })}
    >
      {children}
    </a>
  );
}
