export const dynamic = 'force-static';

export function GET() {
  return Response.json({
    ok: true,
    version: 'v31',
    product: 'GR8 Passport',
    mode: 'in-house-foundation',
    storage: 'on-device-local-storage-now',
    backendReady: true,
    thirdPartyAccountPlatform: false,
    thirdPartyForumPlatform: false,
    features: [
      'passport-profile-shell',
      'saved-games',
      'recently-played',
      'xp-and-levels',
      'daily-rewards',
      'badges',
      'community-hub-foundation',
      'database-schema-ready'
    ],
    next: 'Connect the included schema to a GR8-owned database layer for cross-device accounts and moderated community posting.'
  }, {
    headers: {
      'cache-control': 'public, max-age=1800'
    }
  });
}
