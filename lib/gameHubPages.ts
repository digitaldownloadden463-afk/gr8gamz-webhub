import type { Metadata } from 'next';
import { canonical } from '@/lib/features';
import { gameHubPath, getGameHubDefinition, getGameHubGames, type GameHubDefinition } from '@/lib/gameHubs';

export const gameHubPageSize = 48;

export function parseGameHubPageNumber(value: string) {
  if (!/^[1-9]\d*$/.test(value)) return null;
  const page = Number(value);
  return Number.isSafeInteger(page) ? page : null;
}

export function getGameHubPageData(slug: string, page = 1) {
  const hub = getGameHubDefinition(slug);
  if (!hub || !Number.isInteger(page) || page < 1) return null;
  const allGames = getGameHubGames(slug);
  const totalPages = Math.max(1, Math.ceil(allGames.length / gameHubPageSize));
  if (page > totalPages) return null;
  const start = (page - 1) * gameHubPageSize;
  return {
    hub,
    games: allGames.slice(start, start + gameHubPageSize),
    count: allGames.length,
    page,
    totalPages,
    path: gameHubPath(slug, page)
  };
}

export type GameHubPageData = NonNullable<ReturnType<typeof getGameHubPageData>>;

export function gameHubMetadata(data: GameHubPageData): Metadata {
  const { hub, page, totalPages, path } = data;
  const title = page === 1 ? hub.title : `${hub.label} - Page ${page} of ${totalPages}`;
  const description = page === 1
    ? hub.description
    : `Browse ${hub.label.toLowerCase()} on page ${page} of ${totalPages}, with direct links to every game profile shown.`;
  const url = canonical(path);
  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: [{ url: '/og/gr8gamz-og.png', width: 1200, height: 630, alt: `${hub.label} on GR8 GAMZ` }]
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/og/gr8gamz-og.png'] }
  };
}

export function gameHubStructuredData(data: GameHubPageData) {
  const { hub, games, page, path } = data;
  const url = canonical(path);
  const breadcrumbs = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: canonical('/') },
    { '@type': 'ListItem', position: 2, name: 'Games', item: canonical('/games') },
    { '@type': 'ListItem', position: 3, name: hub.label, item: canonical(gameHubPath(hub.slug)) }
  ];
  if (page > 1) breadcrumbs.push({ '@type': 'ListItem', position: 4, name: `Page ${page}`, item: url });
  return [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: breadcrumbs },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: page === 1 ? hub.label : `${hub.label} - Page ${page}`,
      url,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: games.length,
        itemListElement: games.map((game, index) => ({
          '@type': 'ListItem',
          position: (page - 1) * gameHubPageSize + index + 1,
          name: game.title,
          url: canonical(game.url)
        }))
      }
    }
  ];
}

export function gameHubParentPath(hub: GameHubDefinition) {
  return `/categories/${hub.parentCategory}`;
}
