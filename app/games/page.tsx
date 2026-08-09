import Link from 'next/link';
import GameFilters from '@/components/GameFilters';
import RegistryGameCard from '@/components/RegistryGameCard';
import { getAllGames } from '@/lib/games';
import { canonical, gameCountLabel } from '@/lib/features';
import { getRegistryCategories, getRegistryControlHubs, searchRegistryGames } from '@/lib/gameRegistry';

export const metadata = {
  title: 'Games',
  description: 'Browse every original GR8 GAMZ browser game by search, category, controls and difficulty.',
  alternates: { canonical: canonical('/games') }
};

type GamesPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function sanitizeQuery(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  return String(raw || '').trim().slice(0, 80);
}

function sanitizePage(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(String(raw || '1'), 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export default async function GamesPage({ searchParams }: GamesPageProps) {
  const params = await searchParams;
  const query = sanitizeQuery(params?.q);
  const requestedPage = sanitizePage(params?.page);
  const games = getAllGames();
  const categories = getRegistryCategories();
  const controls = getRegistryControlHubs();
  const searchResults = query ? searchRegistryGames(query, requestedPage, 48) : null;
  const queryCopy = query ? `Showing results for "${query}" across GR8 Originals and GR8 Select.` : 'Search the original GR8 GAMZ library. Every result has touch-friendly controls and a stable play screen.';
  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">Original games</span>
        <h1>{gameCountLabel(games.length)} ready to play.</h1>
        <p>{queryCopy}</p>
      </section>
      {searchResults ? (
        <section className="game-browser" aria-labelledby="game-browser-title">
          <form className="filter-panel" action="/games" method="get" role="search">
            <div>
              <h2 id="game-browser-title">Find your next game</h2>
              <p>{gameCountLabel(searchResults.totalGames)} found.</p>
            </div>
            <label>
              Search
              <input type="search" name="q" defaultValue={query} maxLength={80} placeholder="Snake, racing, puzzle..." />
            </label>
            <button className="cta" type="submit">Search</button>
          </form>
          <div className="game-grid" aria-live="polite">
            {searchResults.games.map((game, index) => <RegistryGameCard key={game.id} game={game} priority={index < 8} />)}
          </div>
          {searchResults.totalPages > 1 ? (
            <nav className="pagination-nav" aria-label="Search result pages">
              {searchResults.page > 1 ? <Link className="secondary-cta" href={`/games?q=${encodeURIComponent(query)}&page=${searchResults.page - 1}`}>Previous</Link> : <span />}
              <span>Page {searchResults.page} of {searchResults.totalPages}</span>
              {searchResults.page < searchResults.totalPages ? <Link className="cta" href={`/games?q=${encodeURIComponent(query)}&page=${searchResults.page + 1}`}>Next</Link> : <span />}
            </nav>
          ) : null}
        </section>
      ) : <GameFilters games={games} />}
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
