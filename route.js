export const dynamic = 'force-static';

export function GET() {
  return new Response('470561d472ec49aca5a704b6d8a3eac0', {
    status: 200,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600'
    }
  });
}
