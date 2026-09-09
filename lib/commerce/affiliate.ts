import type { CommercePageType, CommerceProduct } from '@/lib/commerce/types';
import { gadgetHyperAffiliateRef } from '@/lib/commerce/gadgethyperConfig';

const merchantHosts = new Set(['gadgethyper.com', 'www.gadgethyper.com']);

function safeId(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9_-]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 64);
}

export function isApprovedGadgetHyperDestination(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && merchantHosts.has(url.hostname) && url.pathname.startsWith('/products/');
  } catch {
    return false;
  }
}

export function commercePageId(pageType: CommercePageType, slug: string) {
  return safeId(`${pageType}_${slug}`);
}

export function buildAffiliateUrl(product: CommerceProduct, pageId: string, placement: string) {
  if (!isApprovedGadgetHyperDestination(product.destinationUrl)) throw new Error(`Unapproved GadgetHyper destination for ${product.slug}`);
  void pageId;
  void placement;
  try {
    const destination = new URL(product.destinationUrl);
    destination.searchParams.set('ref', gadgetHyperAffiliateRef);
    const url = new URL(destination.toString());
    if (!isApprovedGadgetHyperDestination(url.toString()) || url.searchParams.get('ref') !== gadgetHyperAffiliateRef) return null;
    return url.toString();
  } catch {
    return null;
  }
}
