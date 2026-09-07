import { notFound } from 'next/navigation';
import PseoIntentDirectory from '@/components/PseoIntentDirectory';
import { getActivePseoIntents } from '@/lib/pseoIntents';
import { getPseoPageData, pseoMetadata, pseoStructuredData } from '@/lib/pseoPages';

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getActivePseoIntents().map((intent) => ({ slug: intent.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const data = getPseoPageData(slug, 1);
  return data ? pseoMetadata(data) : {};
}

export default async function PseoIntentPage({ params }: PageProps) {
  const { slug } = await params;
  const data = getPseoPageData(slug, 1);
  if (!data) notFound();
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pseoStructuredData(data)) }} />
      <PseoIntentDirectory data={data} />
    </main>
  );
}
