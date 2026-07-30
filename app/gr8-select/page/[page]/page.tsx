import { notFound } from 'next/navigation';
import PartnerCatalogueGrid from '@/components/PartnerCatalogueGrid';
import { canonical } from '@/lib/features';
import { getPartnerCataloguePage } from '@/src/data/partnerGameProfiles';

type PageProps = { params: Promise<{ page: string }> };

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps) {
  const { page } = await params;
  const pageNumber = Number.parseInt(page, 10);
  const catalogue = getPartnerCataloguePage(pageNumber);
  if (!Number.isFinite(pageNumber) || pageNumber < 2 || pageNumber > catalogue.totalPages) return {};
  return {
    title: `GR8 Select Games - Page ${catalogue.page}`,
    description: `Browse page ${catalogue.page} of the GR8 Select catalogue with checked free browser game profiles.`,
    alternates: { canonical: canonical(`/gr8-select/page/${catalogue.page}`) }
  };
}

export default async function Gr8SelectPagedPage({ params }: PageProps) {
  const { page } = await params;
  const pageNumber = Number.parseInt(page, 10);
  const catalogue = getPartnerCataloguePage(pageNumber);
  if (!Number.isFinite(pageNumber) || pageNumber < 2 || pageNumber > catalogue.totalPages) notFound();

  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">GR8 Select</span>
        <h1>More GR8 Select games.</h1>
        <p>Keep browsing unique game profiles with clean artwork, clear categories and a deliberate Play step.</p>
      </section>
      <PartnerCatalogueGrid page={catalogue.page} />
    </main>
  );
}
