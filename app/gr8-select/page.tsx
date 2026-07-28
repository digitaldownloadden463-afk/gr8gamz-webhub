import { Sparkles } from 'lucide-react';
import PartnerCatalogueGrid from '@/components/PartnerCatalogueGrid';
import { canonical } from '@/lib/features';
import { partnerCatalogueReport } from '@/src/data/partnerGameProfiles';

export const metadata = {
  title: 'GR8 Select',
  description: 'Browse the GR8 Select catalogue of checked free browser games with real artwork and clear load choices.',
  alternates: { canonical: canonical('/gr8-select') }
};

export default function Gr8SelectPage() {
  return (
    <main>
      <section className="page-title">
        <span className="eyebrow"><Sparkles size={18} aria-hidden="true" /> GR8 Select</span>
        <h1>{partnerCatalogueReport.totals.verifiedIndexable.toLocaleString()} checked games with real artwork up front.</h1>
        <p>Browse action, puzzle, racing, sports, arcade and adventure picks. Each game opens only after you choose to load it, so players stay in control.</p>
      </section>

      <PartnerCatalogueGrid page={1} />
    </main>
  );
}
