export type AdDensity = 'none' | 'low' | 'low-medium' | 'medium' | 'medium-high';
export type AdFormat = 'in-page' | 'side-rail' | 'anchor' | 'vignette' | 'multiplex';
export type AdPageType =
  | 'home'
  | 'discovery'
  | 'game-profile'
  | 'play'
  | 'gaming-gear-hub'
  | 'buying-guide'
  | 'product'
  | 'legal';

export type AdPolicy = {
  pageType: AdPageType;
  adDensity: AdDensity;
  autoAdsAllowed: boolean;
  allowedFormats: readonly AdFormat[];
  manualSlots: readonly string[];
};

const policies: Record<AdPageType, AdPolicy> = {
  home: {
    pageType: 'home',
    adDensity: 'medium',
    autoAdsAllowed: true,
    allowedFormats: ['in-page', 'side-rail'],
    manualSlots: ['after-early-section', 'deep-content']
  },
  discovery: {
    pageType: 'discovery',
    adDensity: 'medium-high',
    autoAdsAllowed: true,
    allowedFormats: ['in-page', 'side-rail'],
    manualSlots: ['after-game-row', 'deep-content']
  },
  'game-profile': {
    pageType: 'game-profile',
    adDensity: 'medium',
    autoAdsAllowed: true,
    allowedFormats: ['in-page', 'side-rail'],
    manualSlots: ['after-game-information']
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
    adDensity: 'medium',
    autoAdsAllowed: true,
    allowedFormats: ['in-page', 'side-rail'],
    manualSlots: ['between-editorial-sections']
  },
  'buying-guide': {
    pageType: 'buying-guide',
    adDensity: 'low-medium',
    autoAdsAllowed: true,
    allowedFormats: ['in-page', 'side-rail'],
    manualSlots: ['between-editorial-sections']
  },
  product: {
    pageType: 'product',
    adDensity: 'low',
    autoAdsAllowed: false,
    allowedFormats: ['in-page'],
    manualSlots: ['after-product-information']
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

function withoutLocale(pathname: string) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] && /^(?:es|pt-BR|fr|de|it|pl|tr|id|ja|ko|hi|ar)$/.test(parts[0])) parts.shift();
  return `/${parts.join('/')}` || '/';
}

export function getAdPolicy(pathname: string): AdPolicy {
  const route = withoutLocale(pathname);
  if (route === '/') return policies.home;
  if (legalRoutes.has(route) || route.startsWith('/challenge/')) return policies.legal;
  if (route.startsWith('/arcade/') || /^\/more-free-games\/[^/]+\/play\/?$/.test(route)) return policies.play;
  if (route.startsWith('/gaming-gear/products/')) return policies.product;
  if (route === '/gaming-gear') return policies['gaming-gear-hub'];
  if (route.startsWith('/gaming-gear/')) return policies['buying-guide'];
  if (/^\/more-free-games\/[^/]+\/?$/.test(route)) return policies['game-profile'];
  return policies.discovery;
}

export const adPolicies = policies;
