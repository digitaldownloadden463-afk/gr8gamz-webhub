import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Database, Play, Search, Sparkles } from 'lucide-react';
import {
  getFeaturedGameMonetizeCmsGames,
  getGameMonetizeCmsCategories,
  getGameMonetizeCmsGames,
  getGameMonetizeCmsStats
} from '@/src/data/gamemonetizeCms';

export const metadata = {
  title: 'GameMonetize Games | GR8 GAMZ',
  description:
    'Explore the GR8 GAMZ GameMonetize arcade catalogue with thousands of partner-powered HTML5 browser games ready for global players.'
};

type PageProps = {
  searchParams?: {
    category?: string;
    q?: string;
    page?: string;
  };
};

export default function GameMonetizeGamesPage({ searchParams }: PageProps) {
  const stats = getGameMonetizeCmsStats();
  const categories = getGameMonetizeCmsCategories();
  const category = searchParams?.category || '';
  const query = searchParams?.q || '';
  const page = Number(searchParams?.page || 1) || 1;
  const featured = getFeaturedGameMonetizeCmsGames(8);
  const listing = getGameMonetizeCmsGames({ category, query, page, pageSize: 48 });

  return (
    <main>
      <section className="hero network-hero">
        <span className="eyebrow">
          <Database size={18} aria-hidden="true" /> GameMonetize CMS imported
        </span>
        <h1>{stats.games.toLocaleString()} GameMonetize games restored for global discovery.</h1>
        <p>
          The PHP CMS archive has been converted into a Vercel-friendly GR8 GAMZ catalogue, keeping the revenue
          partner data visible without replacing the modern Next site.
        </p>
        <div className="cta-row">
          <Link href={featured[0] ? `/gamemonetize-games/${featured[0].slug}/play` : '/gamemonetize-games'} className="cta">
            <Play size={20} aria-hidden="true" /> Play CMS pick
          </Link>
          <Link href="/more-free-games" className="secondary-cta">
            Partner network
          </Link>
        </div>
      </section>

      <section className="arcade-strip" aria-label="GameMonetize CMS snapshot">
        <div>
          <strong>{stats.games.toLocaleString()}</strong>
          <span>CMS games</span>
        </div>
        <div>
          <strong>{stats.categories}</strong>
          <span>CMS categories</span>
        </div>
        <Link href="/gamepix-games">
          <strong>GamePix</strong>
          <span>partner feed</span>
        </Link>
      </section>

      <section className="section-heading">
        <span className="eyebrow">
          <Sparkles size={18} aria-hidden="true" /> Featured GameMonetize picks
        </span>
        <h2>Keep revenue games in the player journey.</h2>
      </section>
      <section className="partner-grid">
        {featured.map((game, index) => (
          <article className="partner-card" key={game.slug}>
            <Link href={`/gamemonetize-games/${game.slug}`} className="partner-card__image">
              <Image src={game.image} alt={`${game.title} artwork`} width={640} height={360} priority={index < 2} />
              <span>{game.category}</span>
            </Link>
            <div className="partner-card__body">
              <span className="game-card__kicker">GameMonetize CMS</span>
              <h3>
                <Link href={`/gamemonetize-games/${game.slug}`}>{game.title}</Link>
              </h3>
              <p>{game.description}</p>
              <div className="partner-card__actions">
                <Link href={`/gamemonetize-games/${game.slug}/play`} className="cta">
                  <Play size={18} aria-hidden="true" /> Play Now
                </Link>
                <Link href={`/gamemonetize-games/${game.slug}`} className="secondary-cta">
                  Details <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="game-section">
        <div className="section-heading">
          <span className="eyebrow">
            <Search size={18} aria-hidden="true" /> CMS categories
          </span>
          <h2>Browse the imported GameMonetize catalogue.</h2>
        </div>
        <div className="partner-mini-row">
          {categories.map((item) => (
            <Link href={`/gamemonetize-games?category=${item.slug}`} key={item.slug}>
              <span>{item.totalGames.toLocaleString()} games</span>
              <strong>{item.name}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-heading">
        <span className="eyebrow">{listing.total.toLocaleString()} matching games</span>
        <h2>{category ? category.replaceAll('-', ' ') : query ? `Search: ${query}` : 'Latest imported CMS games'}</h2>
      </section>
      <section className="partner-grid">
        {listing.items.map((game) => (
          <article className="partner-card" key={game.slug}>
            <Link href={`/gamemonetize-games/${game.slug}`} className="partner-card__image">
              <Image src={game.image} alt={`${game.title} artwork`} width={640} height={360} />
              <span>{game.category}</span>
            </Link>
            <div className="partner-card__body">
              <span className="game-card__kicker">GameMonetize</span>
              <h3>
                <Link href={`/gamemonetize-games/${game.slug}`}>{game.title}</Link>
              </h3>
              <p>{game.description}</p>
              <div className="partner-card__actions">
                <Link href={`/gamemonetize-games/${game.slug}/play`} className="cta">
                  <Play size={18} aria-hidden="true" /> Play Now
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="pagination-row">
        {listing.page > 1 ? (
          <Link href={`/gamemonetize-games?category=${category}&q=${query}&page=${listing.page - 1}`} className="secondary-cta">
            Previous
          </Link>
        ) : null}
        <span>
          Page {listing.page.toLocaleString()} of {listing.pageCount.toLocaleString()}
        </span>
        {listing.page < listing.pageCount ? (
          <Link href={`/gamemonetize-games?category=${category}&q=${query}&page=${listing.page + 1}`} className="secondary-cta">
            Next
          </Link>
        ) : null}
      </section>
    </main>
  );
}
