import { getPartnerCatalog } from '@/lib/partnerCatalog';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || '1';
  const pageSize = url.searchParams.get('pageSize') || '24';

  try {
    const payload = await getPartnerCatalog({ page, pageSize });
    return Response.json(payload, {
      headers: {
        'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600',
        'X-Robots-Tag': 'noindex, follow'
      }
    });
  } catch {
    return Response.json(
      { provider: 'gr8-select', page: Number.parseInt(page, 10) || 1, pageSize: 24, totalEstimate: null, hasMore: false, items: [] },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60',
          'X-Robots-Tag': 'noindex, follow'
        }
      }
    );
  }
}
