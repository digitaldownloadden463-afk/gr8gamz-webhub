import { canonical } from '@/lib/features';
import { getAllGames } from '@/lib/games';

export const revalidate = 86400;

export function GET() {
  const originalGames = getAllGames()
    .filter((game) => game.status === 'Live')
    .map((game) => ({
      id: game.id,
      title: game.name,
      description: game.description || '',
      genre: game.genre || game.category || '',
      playableUrl: canonical(`/arcade/${game.slug || game.id}`),
      thumbnailUrl: game.thumbnail ? canonical(game.thumbnail.split('?')[0]) : null,
      controls: game.controls || [],
      datePublished: game.dateAdded || null
    }));

  return Response.json(
    {
      publisher: 'GR8 GAMZ',
      publisherUrl: canonical('/'),
      editorialInformationUrl: canonical('/publishers'),
      usage: 'Linking to official game pages is welcome. No permission to iframe, host, redistribute or modify game files is granted by this feed.',
      gameCount: originalGames.length,
      games: originalGames
    },
    { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } }
  );
}
