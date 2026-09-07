import type { Metadata } from 'next';
import { canonical } from '@/lib/features';
import { getPseoIntent, getPseoIntentGames, pseoIntentPath, type PseoIntentDefinition } from '@/lib/pseoIntents';
import type { RegistryGame } from '@/lib/gameRegistry';

export const pseoPageSize = 48;

export type PseoPageData = {
  intent: PseoIntentDefinition;
  games: RegistryGame[];
  count: number;
  page: number;
  totalPages: number;
};

/** Resolve one pSEO collection page while preserving the frozen quality-approved inventory. */
export function getPseoPageData(slug: string, page = 1): PseoPageData | null {
  const intent = getPseoIntent(slug);
  if (!intent) return null;
  const allGames = getPseoIntentGames(slug);
  const count = allGames.length;
  const totalPages = Math.max(1, Math.ceil(count / pseoPageSize));
  if (!Number.isInteger(page) || page < 1 || page > totalPages) return null;
  const start = (page - 1) * pseoPageSize;
  return { intent, games: allGames.slice(start, start + pseoPageSize), count, page, totalPages };
}

/** Generate canonical metadata; pagination pages are deliberately noindex/follow. */
export function pseoMetadata(data: PseoPageData): Metadata {
  const { intent, page, totalPages } = data;
  const canonicalPath = pseoIntentPath(intent.slug, page);
  if (page === 1) {
    return {
      title: intent.title,
      description: intent.description,
      alternates: { canonical: canonical(canonicalPath) },
      robots: { index: true, follow: true },
      openGraph: {
        title: intent.title,
        description: intent.description,
        url: canonical(canonicalPath),
        images: ['/og/gr8gamz-og.png'],
      },
      twitter: {
        card: 'summary_large_image',
        title: intent.title,
        description: intent.description,
        images: ['/og/gr8gamz-og.png'],
      },
    };
  }
  const title = `${intent.primaryKeyword} - page ${page} of ${totalPages}`;
  return {
    title,
    description: `Continue browsing ${intent.primaryKeyword}, page ${page} of ${totalPages}.`,
    alternates: { canonical: canonical(canonicalPath) },
    robots: { index: false, follow: true },
  };
}

/** Build BreadcrumbList, CollectionPage and ItemList structured data for the visible inventory. */
export function pseoStructuredData(data: PseoPageData) {
  const { intent, games, page } = data;
  const collectionUrl = canonical(pseoIntentPath(intent.slug, page));
  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: canonical('/') },
    { '@type': 'ListItem', position: 2, name: 'Games', item: canonical('/games') },
    { '@type': 'ListItem', position: 3, name: intent.primaryKeyword, item: canonical(pseoIntentPath(intent.slug)) },
  ];
  if (page > 1) {
    breadcrumbItems.push({ '@type': 'ListItem', position: 4, name: `Page ${page}`, item: collectionUrl });
  }
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: page === 1 ? intent.h1 : `${intent.primaryKeyword} - page ${page}`,
      description: page === 1 ? intent.description : `More ${intent.primaryKeyword} from the same verified collection.`,
      url: collectionUrl,
      isPartOf: { '@type': 'WebSite', name: 'GR8 GAMZ', url: canonical('/') },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: page === 1 ? intent.primaryKeyword : `${intent.primaryKeyword} page ${page}`,
      numberOfItems: games.length,
      itemListElement: games.map((game, index) => ({
        '@type': 'ListItem',
        position: (page - 1) * pseoPageSize + index + 1,
        name: game.title,
        url: canonical(game.url),
      })),
    },
  ];
}
