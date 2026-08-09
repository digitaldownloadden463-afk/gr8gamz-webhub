import { getPartnerCatalog } from '@/lib/partnerCatalog';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const url = new URL(request.url);
  const category = url.searchParams.get('category') || 'All GR8 Select';
  const page = url.searchParams.get('page') || '1';
  const pageSize = url.searchParams.get('pageSize') || '24';

  try {
    const payload = await getPartnerCatalog({ category, page, pageSize });
    return Response.json(payload, {
      headers: {
        'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600',
        'X-Robots-Tag': 'noindex, follow'
      }
    });
  } catch (error) {
    if (error instanceof RangeError) {
      return Response.json(
        { error: 'Unsupported category' },
        { status: 400, headers: { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, follow' } }
      );
    }
    return Response.json(
      { provider: 'gr8-select', category, page: Number.parseInt(page, 10) || 1, pageSize: 24, totalEstimate: null, hasMore: false, categoryCounts: [], items: [] },
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
