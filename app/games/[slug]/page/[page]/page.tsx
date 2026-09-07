import { notFound } from 'next/navigation';
import PseoIntentDirectory from '@/components/PseoIntentDirectory';
import { getPseoPageData, pseoMetadata, pseoStructuredData } from '@/lib/pseoPages';

type PageProps = { params: Promise<{ slug: string; page: string }> };

function parsePage(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 1 ? parsed : null;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, page } = await params;
  const pageNumber = parsePage(page);
  if (!pageNumber) return {};
  const data = getPseoPageData(slug, pageNumber);
  return data ? pseoMetadata(data) : {};
}

export default async function PseoIntentPaginationPage({ params }: PageProps) {
  const { slug, page } = await params;
  const pageNumber = parsePage(page);
  if (!pageNumber) notFound();
  const data = getPseoPageData(slug, pageNumber);
  if (!data) notFound();
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pseoStructuredData(data)) }} />
      <PseoIntentDirectory data={data} />
    </main>
  );
}
