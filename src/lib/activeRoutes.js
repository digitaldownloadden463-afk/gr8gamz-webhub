export const ACTIVE_STATIC_ROUTES = Object.freeze([
  '/',
  '/games',
  '/top-games',
  '/more-free-games',
  '/gamepix-games',
  '/gamemonetize-games',
  '/community',
  '/passport',
  '/my-arcade',
  '/daily-challenge',
  '/live',
  '/profile',
  '/privacy',
  '/terms',
  '/community-guidelines',
  '/support',
  '/report'
]);

function uniquePaths(paths) {
  return Array.from(new Set(paths.filter((path) => typeof path === 'string' && path.startsWith('/'))));
}

export function buildOriginalGameRoutes(games = []) {
  return uniquePaths(
    games
      .map((game) => String(game?.slug || game?.id || '').trim())
      .filter(Boolean)
      .map((slug) => `/arcade/${slug}`)
  );
}

export function buildPartnerProfileRoutes(profiles = []) {
  return uniquePaths(profiles.map((profile) => profile?.path));
}

export function buildPartnerClusterRoutes(clusterRoutes = []) {
  return uniquePaths(clusterRoutes);
}

export function buildCmsGameRoutes(games = []) {
  return uniquePaths(
    games
      .map((game) => String(game?.slug || '').trim())
      .filter(Boolean)
      .map((slug) => `/gamemonetize-games/${slug}`)
  );
}

export function buildActiveIndexableRoutes({ games = [], profiles = [], clusterRoutes = [] } = {}) {
  return uniquePaths([
    ...ACTIVE_STATIC_ROUTES,
    ...buildOriginalGameRoutes(games),
    ...buildPartnerProfileRoutes(profiles),
    ...buildPartnerClusterRoutes(clusterRoutes)
  ]);
}
