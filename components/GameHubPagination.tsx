'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

export default function GameHubPagination({ hubId, currentPage, totalPages, previousHref, nextHref }: { hubId: string; currentPage: number; totalPages: number; previousHref?: string; nextHref?: string }) {
  if (totalPages <= 1) return null;
  const record = (pageNumber: number) => trackEvent('game_hub_pagination_used', { hub_id: hubId, page_number: pageNumber, source_surface: 'hub-pagination' });
  return (
    <nav className="pagination-nav compact-pagination" aria-label={`${hubId} game pages`}>
      <div className="pagination-nav__previous">
        {previousHref ? <Link className="secondary-cta" href={previousHref} aria-label={`Previous, page ${currentPage - 1}`} onClick={() => record(currentPage - 1)}><ArrowLeft className="pagination-arrow" size={18} aria-hidden="true" /> Previous</Link> : <span className="pagination-nav__disabled" aria-disabled="true"><ArrowLeft className="pagination-arrow" size={18} aria-hidden="true" /> Previous</span>}
      </div>
      <span className="pagination-nav__status" aria-current="page">Page {currentPage} of {totalPages}</span>
      <div className="pagination-nav__next">
        {nextHref ? <Link className="cta" href={nextHref} aria-label={`Next, page ${currentPage + 1}`} onClick={() => record(currentPage + 1)}>Next <ArrowRight className="pagination-arrow" size={18} aria-hidden="true" /></Link> : <span className="pagination-nav__disabled" aria-disabled="true">Next <ArrowRight className="pagination-arrow" size={18} aria-hidden="true" /></span>}
      </div>
    </nav>
  );
}
