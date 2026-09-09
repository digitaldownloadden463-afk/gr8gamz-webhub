export const legacyCommerceRedirects = new Map<string, string>([
  ['/gaming-gear/gaming-mice', '/gaming-gear/mice'],
  ['/gaming-gear/gaming-headsets', '/gaming-gear/audio'],
  ['/gaming-gear/gaming-keyboards', '/gaming-gear/keyboards'],
  ['/gaming-gear/gaming-controllers', '/gaming-gear/controllers'],
  ['/gaming-gear/mobile-gaming', '/gaming-gear/controllers'],
  ['/gaming-gear/mobile-gaming/best-mobile-gaming-controller', '/gaming-gear/controllers/best-mobile-gaming-controllers'],
  ['/gaming-gear/mobile-gaming/best-controller-for-android-phone', '/gaming-gear/controllers/best-mobile-gaming-controllers'],
  ['/gaming-gear/mobile-gaming/best-controller-for-mobile-cloud-gaming', '/gaming-gear/controllers/best-mobile-gaming-controllers']
]);

const retiredGenericPaths = new Set([
  '/gaming-gear/gaming-mice/best-lightweight-gaming-mouse',
  '/gaming-gear/gaming-mice/best-gaming-mouse-for-fps',
  '/gaming-gear/gaming-mice/best-ergonomic-gaming-mouse',
  '/gaming-gear/gaming-mice/best-mmo-gaming-mouse',
  '/gaming-gear/gaming-headsets/best-gaming-headset',
  '/gaming-gear/gaming-headsets/best-wireless-gaming-headset',
  '/gaming-gear/gaming-headsets/best-gaming-headset-for-pc',
  '/gaming-gear/gaming-laptops',
  '/gaming-gear/gaming-chairs'
]);

export function isRetiredCommercePath(pathname: string) {
  return retiredGenericPaths.has(pathname) || pathname.startsWith('/gaming-gear/products/razer-') || /\/gaming-gear\/[^/]+\/razer-/.test(pathname) || /\/best-razer-/.test(pathname);
}
