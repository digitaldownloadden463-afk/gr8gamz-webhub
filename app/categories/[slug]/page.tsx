import { notFound } from 'next/navigation';
import CategoryDirectory from '@/components/CategoryDirectory';
import { categoryEditorialReviewedAt } from '@/lib/categoryEditorial';
import { categoryPageMetadata, categoryPageStructuredData, getCategoryPageData } from '@/lib/categoryPages';
import { getRegistryCategories } from '@/lib/gameRegistry';

type PageProps = { params: Promise<{ slug: string }> };

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return getRegistryCategories(1).map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const data = getCategoryPageData(slug);
  return data ? categoryPageMetadata(data) : {};
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const data = getCategoryPageData(slug);
  if (!data) notFound();
  const jsonLd = categoryPageStructuredData(data);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CategoryDirectory
        category={data.category}
        games={data.games}
        page={data.page}
        totalPages={data.totalPages}
        editorial={data.editorial}
        reviewedAt={categoryEditorialReviewedAt}
      />
    </main>
  );
}
