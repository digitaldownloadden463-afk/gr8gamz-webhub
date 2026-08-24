import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PartnerGameCard from '@/components/PartnerGameCard';
import AdSensePlacement from '@/components/ads/AdSensePlacement';
import CompactPagination from '@/components/CompactPagination';
import { getPartnerCataloguePage } from '@/src/data/partnerGameProfiles';

export function PartnerCatalogueGrid({ page = 1 }: { page?: number }) {
  const catalogue = getPartnerCataloguePage(page);
  const supportsThreeAds = catalogue.games.length >= 12;
  const splitIndex = Math.min(24, Math.ceil(catalogue.games.length / 2));
  const firstGames = catalogue.games.slice(0, splitIndex);
  const remainingGames = catalogue.games.slice(splitIndex);

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
      {supportsThreeAds ? <AdSensePlacement placement="discovery-upper-content" /> : null}
      <div className="partner-grid partner-grid--large">
        {firstGames.map((profile) => <PartnerGameCard key={profile.slug} profile={profile} priority />)}
      </div>
      {supportsThreeAds ? <AdSensePlacement placement="discovery-mid-content" /> : null}
      {remainingGames.length ? <div className="partner-grid partner-grid--large">{remainingGames.map((profile) => <PartnerGameCard key={profile.slug} profile={profile} />)}</div> : null}
      {supportsThreeAds ? <AdSensePlacement placement="discovery-lower-content" /> : null}
      <CompactPagination currentPage={catalogue.page} totalPages={catalogue.totalPages} previousHref={catalogue.previousPath || undefined} nextHref={catalogue.nextPath || undefined} ariaLabel="GR8 Select pages" />
    </section>
  );
}

export default PartnerCatalogueGrid;
