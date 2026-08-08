import { notFound } from 'next/navigation';
import CategoryDirectory from '@/components/CategoryDirectory';
import { canonical } from '@/lib/features';
import { getRegistryCategories, getRegistryGamesByCategory } from '@/lib/gameRegistry';

type PageProps = { params: Promise<{ slug: string; page: string }> };
const pageSize = 48;

export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, page } = await params;
  const pageNumber = Number.parseInt(page, 10);
  const category = getRegistryCategories(1).find((item) => item.slug === slug);
  const totalPages = category ? Math.max(1, Math.ceil(category.count / pageSize)) : 0;
  if (!category || !Number.isInteger(pageNumber) || pageNumber < 2 || pageNumber > totalPages) return {};
  return {
    title: `${category.name} Games - Page ${pageNumber}`,
    description: `Browse page ${pageNumber} of ${category.name.toLowerCase()} games on GR8 GAMZ.`,
    alternates: { canonical: canonical(`/categories/${category.slug}/page/${pageNumber}`) }
  };
}

export default async function CategoryPagedPage({ params }: PageProps) {
  const { slug, page } = await params;
  const pageNumber = Number.parseInt(page, 10);
  const category = getRegistryCategories(1).find((item) => item.slug === slug);
  const allGames = category ? getRegistryGamesByCategory(slug) : [];
  const totalPages = Math.max(1, Math.ceil(allGames.length / pageSize));
  if (!category || !Number.isInteger(pageNumber) || pageNumber < 2 || pageNumber > totalPages) notFound();
  const games = allGames.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

  return (
    <main>
      <CategoryDirectory category={category} games={games} page={pageNumber} totalPages={totalPages} />
    </main>
  );
}
