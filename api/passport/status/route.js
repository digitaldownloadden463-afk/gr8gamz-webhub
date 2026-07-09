export const dynamic = 'force-static';

export function GET() {
  return Response.json({
    ok: true,
    version: 'v33',
    product: 'GR8 Passport + Control Room',
    mode: 'in-house-foundation',
    storage: 'on-device-local-storage-now',
    backendReady: true,
    thirdPartyAccountPlatform: false,
    thirdPartyForumPlatform: false,
    thirdPartyLiveChatPlatform: false,
    features: [
      'passport-profile-shell',
      'saved-games',
      'recently-played',
      'xp-and-levels',
      'daily-rewards',
      'badges',
      'community-hub-foundation',
      'clubhouse-moderation-queue',
      'support-inbox-foundation',
      'report-centre',
      'database-schema-ready'
    ],
    next: 'Connect the included schema to a GR8-owned database layer for cross-device accounts, moderated community posting, support messages and admin roles.'
  }, {
    headers: {
      'cache-control': 'public, max-age=1800'
    }
  });
}
