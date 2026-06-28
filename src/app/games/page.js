import Link from 'next/link';
import GameGrid from '../../components/GameGrid';
import JsonLd from '../../components/JsonLd';
import { siteConfig } from '../../data/site';
import { filterGames, getAllTags } from '../../lib/games';
import { buildPageMetadata, itemListJsonLd } from '../../lib/seo';

export function generateMetadata({ searchParams }) {
  const hasFilters = Boolean(searchParams?.q || searchParams?.category || searchParams?.platform || searchParams?.control || searchParams?.difficulty || (searchParams?.sort && searchParams.sort !== 'launch'));
  return buildPageMetadata({
    title: hasFilters ? 'Filtered Game Results' : 'All Free Online Games',
    description: 'Browse and filter all GR8 GAMZ mobile-first browser games by category, control type, difficulty and popularity.',
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
        <span className="eyebrow">Game catalogue engine</span>
        <h1>Find your next run.</h1>
        <p>
          Filter the GR8 GAMZ library by play style, category, difficulty and control type. This turns the site from a simple list into a real game discovery system.
        </p>
      </div>

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
          <span>game{games.length === 1 ? '' : 's'} matched your filter path.</span>
          <Link href="/games" className="secondary-cta">Reset filters</Link>
        </div>
      </section>

      <GameGrid games={games} />

      <section className="content-panel">
        <div className="section-heading compact">
          <span>Browse deeper</span>
          <h2>SEO-ready discovery paths.</h2>
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
