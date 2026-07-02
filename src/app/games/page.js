export const dynamic = 'force-dynamic';
import Link from 'next/link';
import GameGrid from '../../components/GameGrid';
import JsonLd from '../../components/JsonLd';
import GlobalKeywordPanel from '../../components/seo/GlobalKeywordPanel';
import { siteConfig } from '../../data/site';
import { filterGames, getAllTags } from '../../lib/games';
import { buildPageMetadata, itemListJsonLd } from '../../lib/seo';

export function generateMetadata({ searchParams }) {
  const hasFilters = Boolean(searchParams?.q || searchParams?.category || searchParams?.platform || searchParams?.control || searchParams?.difficulty || (searchParams?.sort && searchParams.sort !== 'launch'));
  return buildPageMetadata({
    title: hasFilters ? 'Filtered Game Results' : 'Free Online Games | Play Browser Games Instantly',
    description: 'Play free online games worldwide on GR8 GAMZ. Browse instant browser games, mobile games, no-download arcade games and quick games by category, controls and difficulty.',
    path: '/games',
    noIndex: hasFilters
  });
}

function makeHref(params) {
  const entries = Object.entries(params).filter(([, value]) => value);
  const query = new URLSearchParams(entries).toString();
  return query ? `/games?${query}` : '/games';
}

export default function GamesPage({ searchParams }) {
  const filters = {
    sort: searchParams?.sort || 'launch',
    category: searchParams?.category || '',
    platform: searchParams?.platform || '',
    control: searchParams?.control || '',
    difficulty: searchParams?.difficulty || '',
    query: searchParams?.q || ''
  };
  const games = filterGames(filters);
  const tags = getAllTags().slice(0, 24);

  return (
    <main>
      <JsonLd data={itemListJsonLd(games, '/games')} />
      <div className="page-title">
        <span className="eyebrow">Free online games</span>
        <h1>Play free online games instantly, wherever you are.</h1>
        <p>
          Browse the GR8 GAMZ worldwide game catalogue: free browser games, mobile games, no-download arcade games, quick games and original neon games built for fast play.
        </p>
      </div>

      <GlobalKeywordPanel active={['free-online-games', 'browser-games', 'no-download-games']} compact />

      <section className="content-panel filter-panel">
        <form className="search-form" action="/games">
          <input name="q" defaultValue={filters.query} placeholder="Search games, controls, tags..." />
          <button className="cta" type="submit">Search games</button>
        </form>

        <div className="filter-groups" aria-label="Game filters">
          <div>
            <strong>Sort</strong>
            <nav className="sort-bar compact-sort">
              <Link href={makeHref({ ...filters, sort: 'launch' })} className={filters.sort === 'launch' ? 'active' : ''}>Launch</Link>
              <Link href={makeHref({ ...filters, sort: 'popular' })} className={filters.sort === 'popular' ? 'active' : ''}>Popular</Link>
              <Link href={makeHref({ ...filters, sort: 'new' })} className={filters.sort === 'new' ? 'active' : ''}>New</Link>
              <Link href={makeHref({ ...filters, sort: 'az' })} className={filters.sort === 'az' ? 'active' : ''}>A-Z</Link>
            </nav>
          </div>

          <div>
            <strong>Category</strong>
            <nav className="sort-bar compact-sort">
              <Link href={makeHref({ ...filters, category: '' })} className={!filters.category ? 'active' : ''}>All</Link>
              {siteConfig.categories.map((category) => (
                <Link key={category.id} href={makeHref({ ...filters, category: category.id })} className={filters.category === category.id ? 'active' : ''}>
                  {category.emoji} {category.id}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <strong>Control type</strong>
            <nav className="sort-bar compact-sort">
              <Link href={makeHref({ ...filters, control: '' })} className={!filters.control ? 'active' : ''}>All</Link>
              {siteConfig.controlTypes.map((control) => (
                <Link key={control.id} href={makeHref({ ...filters, control: control.id })} className={filters.control === control.id ? 'active' : ''}>
                  {control.emoji} {control.id}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <strong>Difficulty</strong>
            <nav className="sort-bar compact-sort">
              <Link href={makeHref({ ...filters, difficulty: '' })} className={!filters.difficulty ? 'active' : ''}>All</Link>
              {siteConfig.difficulties.map((difficulty) => (
                <Link key={difficulty.id} href={makeHref({ ...filters, difficulty: difficulty.id })} className={filters.difficulty === difficulty.id ? 'active' : ''}>
                  {difficulty.emoji} {difficulty.id}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="filter-summary">
          <strong>{games.length}</strong>
          <span>{games.length === 1 ? 'game matched' : 'games matched'} your filter path.</span>
          <Link href="/games" className="secondary-cta">Reset filters</Link>
        </div>
      </section>

      <GameGrid games={games} />

      <section className="content-panel">
        <div className="section-heading compact">
          <span>Browse deeper</span>
          <h2>Game discovery paths.</h2>
        </div>
        <div className="quick-link-grid">
          {siteConfig.categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.id}`} className="quick-link-card">
              <strong>{category.emoji} {category.name}</strong>
              <small>{category.description}</small>
            </Link>
          ))}
          {siteConfig.controlTypes.map((control) => (
            <Link key={control.id} href={`/controls/${control.id}`} className="quick-link-card">
              <strong>{control.emoji} {control.name}</strong>
              <small>{control.description}</small>
            </Link>
          ))}
          {siteConfig.difficulties.map((difficulty) => (
            <Link key={difficulty.id} href={`/difficulty/${difficulty.id}`} className="quick-link-card">
              <strong>{difficulty.emoji} {difficulty.name}</strong>
              <small>{difficulty.description}</small>
            </Link>
          ))}
        </div>
        <div className="tag-list large-tags" style={{ marginTop: 18 }}>
          {tags.map((tag) => <Link key={tag} href={`/tags/${tag}`}><span>#{tag}</span></Link>)}
        </div>
      </section>
    </main>
  );
}
