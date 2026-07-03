export const dynamic = 'force-static';

export function GET() {
  return Response.json({
    ok: true,
    version: 'v33',
    product: 'GR8 Control Room',
    mode: 'in-house-admin-moderation-foundation',
    storageNow: 'on-device-local-storage-workflow',
    databaseReady: true,
    noThirdPartyLiveChat: true,
    noThirdPartyForum: true,
    noThirdPartyAccountPlatform: true,
    features: [
      'admin-control-room',
      'clubhouse-moderation-queue',
      'support-inbox-foundation',
      'report-centre',
      'public-room-starter-prompts',
      'moderation-status-workflow',
      'database-schema-ready'
    ],
    next: 'Connect the Control Room workflow to the GR8-owned database, secure admin roles and persistent moderation records.'
  }, {
    headers: {
      'cache-control': 'public, max-age=1800'
    }
  });
}
