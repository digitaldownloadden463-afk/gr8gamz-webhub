import type { CommerceProduct, CommercePageType } from '@/lib/commerce/types';

const RAZER_TRACKING_BASE = 'https://razer.a9yw.net/c/7589251/642901/10229';
const RAZER_DESTINATION_HOST = 'www.razer.com';

function safeSubId(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9_]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 64);
}

export function isApprovedRazerDestination(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === RAZER_DESTINATION_HOST && url.pathname.startsWith('/gb-en/');
  } catch {
    return false;
  }
}

export function buildAffiliateUrl(product: CommerceProduct, pageId: string, ctaPosition: string) {
  if (!isApprovedRazerDestination(product.destinationUrl)) throw new Error(`Unapproved Razer destination for ${product.slug}`);
  const url = new URL(RAZER_TRACKING_BASE);
  url.searchParams.set('u', product.destinationUrl);
  url.searchParams.set('subId1', safeSubId(`gr8_${pageId}`));
  url.searchParams.set('subId2', safeSubId(product.slug));
  url.searchParams.set('subId3', safeSubId(ctaPosition));
  return url.toString();
}

export function commercePageId(pageType: CommercePageType, slug: string) {
  return safeSubId(`${pageType}_${slug}`);
}

export const razerAffiliateProgramme = {
  network: 'Impact',
  programme: 'Razer Affiliate Program',
  programmeId: '10229',
  accountId: '7589251',
  attributionWindowDays: 14,
  attributionModel: 'last click',
  standardCommission: '5%',
  bladeCommission: '2.5%',
  trackingBase: RAZER_TRACKING_BASE
} as const;
