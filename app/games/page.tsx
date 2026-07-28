import Link from 'next/link';
import GameFilters from '@/components/GameFilters';
import { getAllGames } from '@/lib/games';
import { canonical, gameCountLabel } from '@/lib/features';
import { getRegistryCategories, getRegistryControlHubs } from '@/lib/gameRegistry';

export const metadata = {
  title: 'Games',
  description: 'Browse every original GR8 GAMZ browser game by search, category, controls and difficulty.',
  alternates: { canonical: canonical('/games') }
};

type GamesPageProps = {
  searchParams?: Promise<{ q?: string }>;
};

export default async function GamesPage({ searchParams }: GamesPageProps) {
  const games = getAllGames();
  const params = await searchParams;
  const query = String(params?.q || '').slice(0, 80);
  const categories = getRegistryCategories();
  const controls = getRegistryControlHubs();
  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">Original games</span>
        <h1>{gameCountLabel(games.length)} ready to play.</h1>
        <p>{query ? `Showing results for "${query}".` : 'Search the original GR8 GAMZ library. Every result has touch-friendly controls and a stable play screen.'}</p>
      </section>
      <GameFilters games={games} initialQuery={query} />
      <section className="content-panel" aria-label="Browse by category">
        <span className="eyebrow">Browse by style</span>
        <h2>Find a game by category.</h2>
        <div className="compact-link-list">
          {categories.map((category) => (
            <Link key={category.slug} href={`/categories/${category.slug}`}>
              <strong>{category.name}</strong>
              <span>{category.count} games</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="content-panel" aria-label="Browse by controls">
        <span className="eyebrow">Browse by controls</span>
        <h2>Pick the way you want to play.</h2>
        <div className="compact-link-list">
          {controls.map((control) => (
            <Link key={control.slug} href={`/controls/${control.slug}`}>
              <strong>{control.name}</strong>
              <span>{control.count} games</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
