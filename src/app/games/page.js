import Link from 'next/link';
import GameGrid from '../../components/GameGrid';
import JsonLd from '../../components/JsonLd';
import { siteConfig } from '../../data/site';
import { getAllGames, getGamesAlphabetical, getNewGames, getPopularGames, getAllTags } from '../../lib/games';
import { buildPageMetadata, itemListJsonLd } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'All Free Online Games',
  description: 'Browse all GR8 GAMZ mobile-first browser games. Play arcade, racing, sports, skill and action games instantly online.',
  path: '/games'
});

export default function GamesPage({ searchParams }) {
  const sort = searchParams?.sort || 'launch';
  const games = sort === 'az' ? getGamesAlphabetical() : sort === 'new' ? getNewGames() : sort === 'popular' ? getPopularGames() : getAllGames();
  const tags = getAllTags().slice(0, 24);

  return (
    <main>
      <JsonLd data={itemListJsonLd(games, '/games')} />
      <div className="page-title">
        <span className="eyebrow">Game catalogue</span>
        <h1>All GR8 GAMZ games.</h1>
        <p>Browse the launch library by popularity, latest games, A-Z sorting, categories, platforms and tags.</p>
      </div>

      <nav className="sort-bar" aria-label="Game sorting">
        <Link href="/games" className={sort === 'launch' ? 'active' : ''}>Launch order</Link>
        <Link href="/games?sort=popular" className={sort === 'popular' ? 'active' : ''}>Popular</Link>
        <Link href="/games?sort=new" className={sort === 'new' ? 'active' : ''}>New</Link>
        <Link href="/games?sort=az" className={sort === 'az' ? 'active' : ''}>A-Z</Link>
        <Link href="/search">Search</Link>
      </nav>

      <GameGrid games={games} />

      <section className="content-panel">
        <div className="section-heading compact">
          <span>Browse deeper</span>
          <h2>Categories, platforms and tags.</h2>
        </div>
        <div className="quick-link-grid">
          {siteConfig.categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.id}`} className="quick-link-card">
              <strong>{category.emoji} {category.name}</strong>
              <small>{category.description}</small>
            </Link>
          ))}
          {siteConfig.platforms.map((platform) => (
            <Link key={platform.id} href={`/platforms/${platform.id}`} className="quick-link-card">
              <strong>{platform.emoji} {platform.name}</strong>
              <small>{platform.description}</small>
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
