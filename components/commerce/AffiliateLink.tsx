'use client';

import type { ReactNode } from 'react';
import { trackEvent } from '@/lib/analytics';
import type { CommercePageType, CommerceProduct } from '@/lib/commerce/types';

export default function AffiliateLink({ href, product, pageType, pageSlug, position, className, children }: {
  href: string | null;
  product: CommerceProduct;
  pageType: CommercePageType;
  pageSlug: string;
  position: string;
  className?: string;
  children: ReactNode;
}) {
  if (!href) return <span className={`${className || ''} affiliate-link--disabled`} aria-disabled="true" title="Affiliate link awaiting approved configuration">Affiliate link pending</span>;
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className={className}
      onClick={() => trackEvent('affiliate_click', {
        merchant: product.merchant,
        locale: document.documentElement.lang || 'en',
        product_slug: product.slug,
        product_name: product.name,
        guide_slug: pageType === 'guide' || pageType === 'comparison' ? pageSlug : undefined,
        category: product.category,
        page_type: pageType,
        link_position: position,
        destination_type: 'merchant_product'
      })}
    >
      {children}
    </a>
  );
}
