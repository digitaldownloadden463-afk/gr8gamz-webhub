import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import RegistryGameCard from '@/components/RegistryGameCard';
import type { RegistryGame } from '@/lib/gameRegistry';

type ControlDirectoryProps = {
  hub: { slug: string; name: string; count: number };
  games: RegistryGame[];
  page: number;
  totalPages: number;
};

export default function ControlDirectory({ hub, games, page, totalPages }: ControlDirectoryProps) {
  const basePath = `/controls/${hub.slug}`;
  const pagePath = (value: number) => value === 1 ? basePath : `${basePath}/page/${value}`;
  return (
    <>
      <section className="page-title">
        <span className="eyebrow">Controls</span>
        <h1>{hub.name} games.</h1>
        <p>{hub.count.toLocaleString()} games that work with {hub.name.toLowerCase()} controls, from quick originals to GR8 Select picks.</p>
      </section>
      <section className="game-grid">
        {games.map((game, index) => <RegistryGameCard key={game.id} game={game} priority={index < 8} />)}
      </section>
      <nav className="pagination-nav" aria-label={`${hub.name} game pages`}>
        {page > 1 ? <Link className="secondary-cta" href={pagePath(page - 1)}><ArrowLeft size={18} aria-hidden="true" /> Previous</Link> : <span />}
        <span>Page {page} of {totalPages}</span>
        {page < totalPages ? <Link className="cta" href={pagePath(page + 1)}>Next <ArrowRight size={18} aria-hidden="true" /></Link> : <span />}
      </nav>
      <nav className="pagination-list" aria-label={`All ${hub.name} catalogue pages`}>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
          pageNumber === page
            ? <span key={pageNumber} aria-current="page">{pageNumber}</span>
            : <Link key={pageNumber} href={pagePath(pageNumber)}>{pageNumber}</Link>
        ))}
      </nav>
    </>
  );
}
