import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import PartnerGameCard from '@/components/PartnerGameCard';
import { getPartnerCataloguePage, partnerCatalogueReport } from '@/src/data/partnerGameProfiles';

export function PartnerCatalogueGrid({ page = 1 }: { page?: number }) {
  const catalogue = getPartnerCataloguePage(page);

  return (
    <section className="game-section" aria-label="GR8 Select catalogue pages">
      <div className="section-heading">
        <span className="eyebrow">GR8 Select catalogue</span>
        <h2>{catalogue.totalGames.toLocaleString()} checked games, page {catalogue.page} of {catalogue.totalPages}.</h2>
        <Link href="/partner-disclosure">How game loading works <ArrowRight size={18} aria-hidden="true" /></Link>
      </div>
      <p className="section-copy">
        Every game in this shelf has a unique profile, a checked artwork URL, a safe play route and crawlable links from GR8 GAMZ.
      </p>
      <div className="partner-grid partner-grid--large">
        {catalogue.games.map((profile) => <PartnerGameCard key={profile.slug} profile={profile} priority />)}
      </div>
      <nav className="pagination-nav" aria-label="GR8 Select pages">
        {catalogue.previousPath ? <Link className="secondary-cta" href={catalogue.previousPath}><ArrowLeft size={18} aria-hidden="true" /> Previous</Link> : <span />}
        <span>{partnerCatalogueReport.totals.verifiedIndexable.toLocaleString()} verified profiles</span>
        {catalogue.nextPath ? <Link className="cta" href={catalogue.nextPath}>Next <ArrowRight size={18} aria-hidden="true" /></Link> : <span />}
      </nav>
    </section>
  );
}

export default PartnerCatalogueGrid;
