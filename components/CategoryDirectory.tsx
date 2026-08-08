import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import RegistryGameCard from '@/components/RegistryGameCard';
import type { RegistryGame } from '@/lib/gameRegistry';

type CategoryDirectoryProps = {
  category: { slug: string; name: string; count: number };
  games: RegistryGame[];
  page: number;
  totalPages: number;
};

export default function CategoryDirectory({ category, games, page, totalPages }: CategoryDirectoryProps) {
  const basePath = `/categories/${category.slug}`;
  const pagePath = (value: number) => value === 1 ? basePath : `${basePath}/page/${value}`;

  return (
    <>
      <section className="page-title">
        <span className="eyebrow">Category</span>
        <h1>{category.name} games.</h1>
        <p>Play {category.count.toLocaleString()} {category.name.toLowerCase()} games from GR8 Originals and GR8 Select.</p>
      </section>
      <section className="game-grid">
        {games.map((game, index) => <RegistryGameCard key={game.id} game={game} priority={index < 8} />)}
      </section>
      <nav className="pagination-nav" aria-label={`${category.name} game pages`}>
        {page > 1 ? <Link className="secondary-cta" href={pagePath(page - 1)}><ArrowLeft size={18} aria-hidden="true" /> Previous</Link> : <span />}
        <span>Page {page} of {totalPages}</span>
        {page < totalPages ? <Link className="cta" href={pagePath(page + 1)}>Next <ArrowRight size={18} aria-hidden="true" /></Link> : <span />}
      </nav>
      <nav className="pagination-list" aria-label={`All ${category.name} catalogue pages`}>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
          pageNumber === page
            ? <span key={pageNumber} aria-current="page">{pageNumber}</span>
            : <Link key={pageNumber} href={pagePath(pageNumber)}>{pageNumber}</Link>
        ))}
      </nav>
    </>
  );
}
