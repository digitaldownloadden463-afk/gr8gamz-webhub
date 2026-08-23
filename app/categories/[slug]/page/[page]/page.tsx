import { notFound } from 'next/navigation';
import CategoryDirectory from '@/components/CategoryDirectory';
import { categoryPageMetadata, categoryPageStructuredData, getCategoryPageData, parseCategoryPageNumber } from '@/lib/categoryPages';

type PageProps = { params: Promise<{ slug: string; page: string }> };

export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, page } = await params;
  const pageNumber = parseCategoryPageNumber(page);
  if (pageNumber === null) return {};
  const data = getCategoryPageData(slug, pageNumber);
  return data && pageNumber >= 2 ? categoryPageMetadata(data) : {};
}

export default async function CategoryPagedPage({ params }: PageProps) {
  const { slug, page } = await params;
  const pageNumber = parseCategoryPageNumber(page);
  if (pageNumber === null) notFound();
  const data = getCategoryPageData(slug, pageNumber);
  if (!data || pageNumber < 2) notFound();
  const jsonLd = categoryPageStructuredData(data);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CategoryDirectory category={data.category} games={data.games} page={data.page} totalPages={data.totalPages} />
    </main>
  );
}
