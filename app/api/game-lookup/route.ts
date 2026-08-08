import { getRegistryGamesBySlugs } from '@/lib/gameRegistry';

export const dynamic = 'force-dynamic';

export function GET(request: Request) {
  const url = new URL(request.url);
  const slugs = [...new Set((url.searchParams.get('slugs') || '').split(',').map((slug) => slug.trim()).filter((slug) => /^[a-z0-9-]{1,96}$/.test(slug)))].slice(0, 50);
  if (!slugs.length) return Response.json({ games: [] }, { headers: { 'cache-control': 'private, no-store' } });
  const games = getRegistryGamesBySlugs(slugs).map((game) => ({
    id: game.slug,
    slug: game.slug,
    name: game.title,
    category: game.category,
    kind: game.source === 'gr8-originals' ? 'original' : 'select',
    path: game.url
  }));
  return Response.json({ games }, { headers: { 'cache-control': 'private, no-store' } });
}
