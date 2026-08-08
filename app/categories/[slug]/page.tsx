import { notFound } from 'next/navigation';
import CategoryDirectory from '@/components/CategoryDirectory';
import { canonical } from '@/lib/features';
import { getRegistryCategories, getRegistryGamesByCategory } from '@/lib/gameRegistry';

type PageProps = { params: Promise<{ slug: string }> };

export const dynamic = 'force-static';
export const dynamicParams = false;
const pageSize = 48;

export function generateStaticParams() {
  return getRegistryCategories(1).map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const category = getRegistryCategories(1).find((item) => item.slug === slug);
  if (!category) return {};
  return {
    title: `${category.name} Games`,
    description: `Play ${category.count} ${category.name.toLowerCase()} games on GR8 GAMZ.`,
    alternates: { canonical: canonical(`/categories/${category.slug}`) },
    openGraph: {
      title: `${category.name} Games`,
      description: `Pick a ${category.name.toLowerCase()} game and start playing on GR8 GAMZ.`,
      url: canonical(`/categories/${category.slug}`),
      images: ['/og/gr8gamz-og.png']
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} Games`,
      description: `Play ${category.name.toLowerCase()} games on GR8 GAMZ.`,
      images: ['/og/gr8gamz-og.png']
    }
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getRegistryCategories(1).find((item) => item.slug === slug);
  if (!category) notFound();
  const games = getRegistryGamesByCategory(slug);
  const pageGames = games.slice(0, pageSize);
  const totalPages = Math.max(1, Math.ceil(games.length / pageSize));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} Games`,
    url: canonical(`/categories/${category.slug}`),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: games.length,
      itemListElement: games.slice(0, 24).map((game, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: canonical(game.url),
        name: game.title
      }))
    }
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CategoryDirectory category={category} games={pageGames} page={1} totalPages={totalPages} />
    </main>
  );
}
