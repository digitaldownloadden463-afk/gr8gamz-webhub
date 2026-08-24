import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

type CompactPaginationProps = {
  currentPage: number;
  totalPages: number;
  previousHref?: string;
  nextHref?: string;
  previousLabel?: string;
  nextLabel?: string;
  pageLabel?: string;
  ofLabel?: string;
  ariaLabel: string;
};

export default function CompactPagination({
  currentPage,
  totalPages,
  previousHref,
  nextHref,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  pageLabel = 'Page',
  ofLabel = 'of',
  ariaLabel
}: CompactPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination-nav compact-pagination" aria-label={ariaLabel}>
      <div className="pagination-nav__previous">
        {previousHref ? (
          <Link className="secondary-cta" href={previousHref} aria-label={`${previousLabel}, ${pageLabel} ${currentPage - 1}`}>
            <ArrowLeft className="pagination-arrow" size={18} aria-hidden="true" /> {previousLabel}
          </Link>
        ) : (
          <span className="pagination-nav__disabled" aria-disabled="true"><ArrowLeft className="pagination-arrow" size={18} aria-hidden="true" /> {previousLabel}</span>
        )}
      </div>
      <span className="pagination-nav__status" aria-current="page">{pageLabel} {currentPage} {ofLabel} {totalPages}</span>
      <div className="pagination-nav__next">
        {nextHref ? (
          <Link className="cta" href={nextHref} aria-label={`${nextLabel}, ${pageLabel} ${currentPage + 1}`}>
            {nextLabel} <ArrowRight className="pagination-arrow" size={18} aria-hidden="true" />
          </Link>
        ) : (
          <span className="pagination-nav__disabled" aria-disabled="true">{nextLabel} <ArrowRight className="pagination-arrow" size={18} aria-hidden="true" /></span>
        )}
      </div>
    </nav>
  );
}
