import type { AdPlacementId } from './placements';

export type AdDensity = 'none' | 'low' | 'low-medium' | 'medium' | 'medium-high';
export type AdFormat = 'in-page' | 'side-rail' | 'anchor' | 'vignette' | 'multiplex';
export type AdPageType =
  | 'home'
  | 'discovery'
  | 'game-profile'
  | 'play'
  | 'gaming-gear-hub'
  | 'buying-guide'
  | 'classroom-hub'
  | 'classroom-tool'
  | 'product'
  | 'legal';

export type AdPolicy = {
  pageType: AdPageType;
  adDensity: AdDensity;
  autoAdsAllowed: boolean;
  allowedFormats: readonly AdFormat[];
  manualSlots: readonly AdPlacementId[];
};

const policies: Record<AdPageType, AdPolicy> = {
  home: {
    pageType: 'home',
    adDensity: 'low',
    autoAdsAllowed: false,
    allowedFormats: ['in-page'],
    manualSlots: ['home-upper-content', 'home-mid-content', 'home-lower-content']
  },
  discovery: {
    pageType: 'discovery',
    adDensity: 'low',
    autoAdsAllowed: false,
    allowedFormats: ['in-page'],
    manualSlots: ['discovery-upper-content', 'discovery-mid-content', 'discovery-lower-content']
  },
  'game-profile': {
    pageType: 'game-profile',
    adDensity: 'none',
    autoAdsAllowed: false,
    allowedFormats: [],
    manualSlots: []
  },
  play: {
    pageType: 'play',
    adDensity: 'none',
    autoAdsAllowed: false,
    allowedFormats: [],
    manualSlots: []
  },
  'gaming-gear-hub': {
    pageType: 'gaming-gear-hub',
    adDensity: 'low',
    autoAdsAllowed: false,
    allowedFormats: ['in-page'],
    manualSlots: ['editorial-upper-content', 'editorial-mid-content', 'editorial-lower-content']
  },
  'buying-guide': {
    pageType: 'buying-guide',
    adDensity: 'low',
    autoAdsAllowed: false,
    allowedFormats: ['in-page'],
    manualSlots: ['editorial-upper-content', 'editorial-mid-content', 'editorial-lower-content']
  },
  'classroom-hub': {
    pageType: 'classroom-hub',
    adDensity: 'low',
    autoAdsAllowed: false,
    allowedFormats: ['in-page'],
    manualSlots: ['classroom-upper-content', 'classroom-mid-content', 'classroom-lower-content']
  },
  'classroom-tool': {
    pageType: 'classroom-tool',
    adDensity: 'low',
    autoAdsAllowed: false,
    allowedFormats: ['in-page'],
    manualSlots: ['classroom-tool-lower-content']
  },
  product: {
    pageType: 'product',
    adDensity: 'none',
    autoAdsAllowed: false,
    allowedFormats: [],
    manualSlots: []
  },
  legal: {
    pageType: 'legal',
    adDensity: 'none',
    autoAdsAllowed: false,
    allowedFormats: [],
    manualSlots: []
  }
};

const legalRoutes = new Set([
  '/about',
  '/accessibility',
  '/affiliate-disclosure',
  '/child-safety',
  '/contact',
  '/cookie-policy',
  '/copyright',
  '/editorial-policy',
  '/partner-disclosure',
  '/privacy',
  '/privacy-choices',
  '/report-a-game',
  '/terms'
]);

const interactionRoutes = new Set([
  '/games',
  '/my-arcade'
]);

function withoutLocale(pathname: string) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] && /^(?:es|pt-BR|fr|de|it|pl|tr|id|ja|ko|hi|ar)$/.test(parts[0])) parts.shift();
  return `/${parts.join('/')}` || '/';
}

export function getAdPolicy(pathname: string): AdPolicy {
  const route = withoutLocale(pathname);
  if (route === '/') return policies.home;
  if (legalRoutes.has(route) || interactionRoutes.has(route) || route.startsWith('/challenge/')) return policies.legal;
  if (route.startsWith('/arcade/') || /^\/more-free-games\/[^/]+\/play\/?$/.test(route)) return policies.play;
  if (route.startsWith('/gaming-gear/products/')) return policies.product;
  if (route === '/gaming-gear') return policies['gaming-gear-hub'];
  if (route.startsWith('/gaming-gear/')) return policies['buying-guide'];
  if (route === '/classroom') return policies['classroom-hub'];
  if (route === '/classroom/timer') return policies['classroom-tool'];
  if (/^\/more-free-games\/[^/]+\/?$/.test(route)) return policies['game-profile'];
  return policies.discovery;
}

export const adPolicies = policies;
