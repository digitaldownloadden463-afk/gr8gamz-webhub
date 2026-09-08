import type { CommercePageType, CommerceProduct } from '@/lib/commerce/types';

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
  const template = process.env.GADGETHYPER_AFFILIATE_URL_TEMPLATE?.trim();
  if (!template || !template.includes('{destination}')) return null;
  const result = template
    .replaceAll('{destination}', encodeURIComponent(product.destinationUrl))
    .replaceAll('{source}', encodeURIComponent(safeId(pageId)))
    .replaceAll('{product}', encodeURIComponent(safeId(product.slug)))
    .replaceAll('{placement}', encodeURIComponent(safeId(placement)));
  try {
    const url = new URL(result);
    if (url.protocol !== 'https:') return null;
    return url.toString();
  } catch {
    return null;
  }
}
