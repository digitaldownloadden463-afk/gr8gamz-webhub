import Link from 'next/link';
import CompactPagination from '@/components/CompactPagination';
import GameFilters from '@/components/GameFilters';
import RegistryGameCard from '@/components/RegistryGameCard';
import { getAllGames } from '@/lib/games';
import { canonical, gameCountLabel } from '@/lib/features';
import { getRegistryCategories, getRegistryControlHubs, searchRegistryGames } from '@/lib/gameRegistry';
import { gameHubPath, getActiveGameHubs, getGameHubGames } from '@/lib/gameHubs';

const gamesMetadata = {
  title: 'Free Games Online - Browse the GR8 GAMZ Directory',
  description: 'Browse free games online across GR8 Originals and GR8 Select, with categories, controls, specialist collections and catalogue-wide search.',
  alternates: { canonical: canonical('/games') }
};

type GamesPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: GamesPageProps) {
  const params = await searchParams;
  const query = sanitizeQuery(params?.q);
  return query ? { ...gamesMetadata, robots: { index: false, follow: true } } : gamesMetadata;
}

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
  const hubs = getActiveGameHubs();
  const searchResults = query ? searchRegistryGames(query, requestedPage, 48) : null;
  const queryCopy = query
    ? `Showing results for "${query}" across GR8 Originals and GR8 Select.`
    : 'Search across GR8 Originals and GR8 Select. Each result opens a profile with controls and device guidance before play.';
  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">Game directory</span>
        <h1>Find free games online across GR8 GAMZ.</h1>
        <p>{queryCopy}</p>
      </section>
      <section className="content-panel" aria-label="Explore specialist game collections">
        <span className="eyebrow">Explore collections</span>
        <h2>Browse by a more specific play style.</h2>
        <div className="compact-link-list">
          {hubs.map((hub) => (
            <Link key={hub.id} href={gameHubPath(hub.slug)}>
              <strong>{hub.label}</strong>
              <span>{getGameHubGames(hub.slug).length.toLocaleString()} games</span>
            </Link>
          ))}
        </div>
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
          <CompactPagination
            currentPage={searchResults.page}
            totalPages={searchResults.totalPages}
            previousHref={searchResults.page > 1 ? `/games?q=${encodeURIComponent(query)}&page=${searchResults.page - 1}` : undefined}
            nextHref={searchResults.page < searchResults.totalPages ? `/games?q=${encodeURIComponent(query)}&page=${searchResults.page + 1}` : undefined}
            ariaLabel="Search result pages"
          />
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
