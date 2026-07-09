export const dynamic = 'force-dynamic';

export function GET() {
  const key = process.env.INDEXNOW_KEY || 'replace-with-your-indexnow-key';
  return new Response(key, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600'
    }
  });
}
