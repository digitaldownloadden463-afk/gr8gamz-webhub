import GameGrid from '../../components/GameGrid';
import { searchGames } from '../../lib/games';
import { buildPageMetadata } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Search Free Online Games',
  description: 'Search GR8 GAMZ for mobile-first arcade, racing, sports, action and skill browser games.',
  path: '/search'
});

export default function SearchPage({ searchParams }) {
  const q = searchParams?.q || '';
  const games = searchGames(q);
  return (
    <main>
      <div className="page-title">
        <span className="eyebrow">Search games</span>
        <h1>{q ? `Search results for “${q}”` : 'Search GR8 GAMZ.'}</h1>
        <p>Use the search box to find games by title, genre, tag, control type or play style.</p>
      </div>
      <form className="search-form" action="/search">
        <input name="q" placeholder="Search snake, racing, football, tap..." defaultValue={q} aria-label="Search games" />
        <button className="cta" type="submit">Search</button>
      </form>
      <GameGrid games={games} />
    </main>
  );
}
