import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import PartnerGameCard from '@/components/PartnerGameCard';
import { getPartnerCataloguePage } from '@/src/data/partnerGameProfiles';

export function PartnerCatalogueGrid({ page = 1 }: { page?: number }) {
  const catalogue = getPartnerCataloguePage(page);
  const pageLinks = Array.from({ length: catalogue.totalPages }, (_, index) => {
    const pageNumber = index + 1;
    return {
      pageNumber,
      href: pageNumber === 1 ? '/gr8-select' : `/gr8-select/page/${pageNumber}`
    };
  });

  return (
    <section className="game-section" aria-label="GR8 Select catalogue pages">
      <div className="section-heading">
        <span className="eyebrow">GR8 Select catalogue</span>
        <h2>{catalogue.totalGames.toLocaleString()} GR8 Select games, page {catalogue.page} of {catalogue.totalPages}.</h2>
        <Link href="/partner-disclosure">How game loading works <ArrowRight size={18} aria-hidden="true" /></Link>
      </div>
      <p className="section-copy">
        Scroll through real game covers, useful categories and clear Play buttons. Each game opens only when you choose it.
      </p>
      <div className="partner-grid partner-grid--large">
        {catalogue.games.map((profile) => <PartnerGameCard key={profile.slug} profile={profile} priority />)}
      </div>
      <nav className="pagination-nav" aria-label="GR8 Select pages">
        {catalogue.previousPath ? <Link className="secondary-cta" href={catalogue.previousPath}><ArrowLeft size={18} aria-hidden="true" /> Previous</Link> : <span />}
        <span>{catalogue.totalGames.toLocaleString()} GR8 Select games</span>
        {catalogue.nextPath ? <Link className="cta" href={catalogue.nextPath}>Next <ArrowRight size={18} aria-hidden="true" /></Link> : <span />}
      </nav>
      <nav className="pagination-list" aria-label="All GR8 Select catalogue pages">
        {pageLinks.map((item) => (
          item.pageNumber === catalogue.page
            ? <span key={item.pageNumber} aria-current="page">{item.pageNumber}</span>
            : <Link key={item.pageNumber} href={item.href}>{item.pageNumber}</Link>
        ))}
      </nav>
    </section>
  );
}

export default PartnerCatalogueGrid;
