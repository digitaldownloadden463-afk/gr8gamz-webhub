import type { Metadata } from 'next';
import { getCategoryEditorial } from '@/lib/categoryEditorial';
import { canonical } from '@/lib/features';
import { getRegistryCategories, getRegistryGamesByCategory, type RegistryGame } from '@/lib/gameRegistry';
import { localizedAlternates } from '@/lib/i18n';

export const categoryPageSize = 48;

const categorySearchTitles: Record<string, string> = {
  arcade: 'Free Arcade Games Online - Quick Browser Play'
};

export function parseCategoryPageNumber(value: string) {
  if (!/^[1-9]\d*$/.test(value)) return null;
  const page = Number(value);
  return Number.isSafeInteger(page) ? page : null;
}

export type CategoryPageData = {
  category: { slug: string; name: string; count: number };
  games: RegistryGame[];
  page: number;
  totalPages: number;
  path: string;
  editorial: ReturnType<typeof getCategoryEditorial>;
};

export function categoryPagePath(slug: string, page = 1) {
  return page === 1 ? `/categories/${slug}` : `/categories/${slug}/page/${page}`;
}

export function categoryDisplayName(slug: string, fallback: string) {
  return getCategoryEditorial(slug)?.name || fallback.charAt(0).toUpperCase() + fallback.slice(1);
}

export function getCategoryPageData(slug: string, page = 1): CategoryPageData | null {
  const category = getRegistryCategories(1).find((item) => item.slug === slug);
  if (!category || !Number.isInteger(page) || page < 1) return null;
  const allGames = getRegistryGamesByCategory(slug);
  const totalPages = Math.max(1, Math.ceil(allGames.length / categoryPageSize));
  if (page > totalPages) return null;
  const start = (page - 1) * categoryPageSize;
  return {
    category,
    games: allGames.slice(start, start + categoryPageSize),
    page,
    totalPages,
    path: categoryPagePath(slug, page),
    editorial: getCategoryEditorial(slug)
  };
}

export function categoryPageMetadata(data: CategoryPageData): Metadata {
  const { category, editorial, page, totalPages, path } = data;
  const name = categoryDisplayName(category.slug, category.name);
  const title = page === 1
    ? editorial?.title || categorySearchTitles[category.slug] || `${name} Games`
    : `${name} Games - Page ${page} of ${totalPages}`;
  const description = page === 1
    ? editorial?.description || `Browse ${category.count.toLocaleString('en-GB')} ${name.toLowerCase()} games from GR8 Originals and GR8 Select.`
    : `Browse ${name.toLowerCase()} games on page ${page} of ${totalPages}, with direct links to every game shown in this part of the GR8 GAMZ catalogue.`;
  const url = canonical(path);
  const languages = page === 1 && editorial ? localizedAlternates(path) : undefined;

  return {
    title,
    description,
    robots: { index: page === 1, follow: true },
    alternates: { canonical: url, ...(languages ? { languages } : {}) },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: [{ url: '/og/gr8gamz-og.png', width: 1200, height: 630, alt: `${name} games on GR8 GAMZ` }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og/gr8gamz-og.png']
    }
  };
}

export function categoryPageStructuredData(data: CategoryPageData) {
  const { category, games, page, path } = data;
  const name = categoryDisplayName(category.slug, category.name);
  const url = canonical(path);
  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: canonical('/') },
    { '@type': 'ListItem', position: 2, name: 'Games', item: canonical('/games') },
    { '@type': 'ListItem', position: 3, name: `${name} Games`, item: canonical(categoryPagePath(category.slug)) }
  ];
  if (page > 1) {
    breadcrumbItems.push({ '@type': 'ListItem', position: 4, name: `Page ${page}`, item: url });
  }

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: page === 1 ? `${name} Games` : `${name} Games - Page ${page}`,
      url,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: games.length,
        itemListOrder: 'https://schema.org/ItemListOrderAscending',
        itemListElement: games.map((game, index) => ({
          '@type': 'ListItem',
          position: (page - 1) * categoryPageSize + index + 1,
          url: canonical(game.url),
          name: game.title
        }))
      }
    }
  ];
}
