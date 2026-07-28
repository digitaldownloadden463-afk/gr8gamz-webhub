import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import LivePartnerCatalogue from '@/components/LivePartnerCatalogue';
import PartnerGameCard from '@/components/PartnerGameCard';
import PartnerCatalogueGrid from '@/components/PartnerCatalogueGrid';
import { canonical } from '@/lib/features';
import { getFeaturedPartnerGameProfiles, partnerCatalogueReport } from '@/src/data/partnerGameProfiles';

export const metadata = {
  title: 'GR8 Select',
  description: 'Browse the GR8 Select catalogue of checked free browser games with real artwork and clear load choices.',
  alternates: { canonical: canonical('/gr8-select') }
};

export default function Gr8SelectPage() {
  const featured = getFeaturedPartnerGameProfiles(8);

  return (
    <main>
      <section className="page-title">
        <span className="eyebrow"><Sparkles size={18} aria-hidden="true" /> GR8 Select</span>
        <h1>{partnerCatalogueReport.totals.verifiedIndexable.toLocaleString()} checked games with real artwork up front.</h1>
        <p>Browse action, puzzle, racing, sports, arcade and adventure picks. Each game opens only after you choose to load it, so players stay in control.</p>
      </section>

      <PartnerCatalogueGrid page={1} />

      <LivePartnerCatalogue />

      <section className="game-section" aria-label="Featured GR8 Select games">
        <div className="section-heading">
          <span className="eyebrow">Featured Select picks</span>
          <h2>Start with games that have extra GR8 notes.</h2>
          <Link href="/partner-disclosure">How external games load <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
        <div className="partner-grid partner-grid--large">
          {featured.map((profile, index) => <PartnerGameCard key={profile.slug} profile={profile} priority={index < 4} />)}
        </div>
      </section>
    </main>
  );
}
