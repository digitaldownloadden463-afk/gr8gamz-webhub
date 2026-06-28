import Link from 'next/link';
import GameGrid from '../components/GameGrid';
import CategoryPill from '../components/CategoryPill';
import DailyChallenge from '../components/engagement/DailyChallenge';
import LeaderboardTerminal from '../components/engagement/LeaderboardTerminal';
import ProgressionPanel from '../components/engagement/ProgressionPanel';
import RecentlyPlayed from '../components/player/RecentlyPlayed';
import AdSlot from '../components/ads/AdSlot';
import JsonLd from '../components/JsonLd';
import { siteConfig } from '../data/site';
import { adPlacements } from '../lib/ads';
import { getFeaturedGames, getNewGames, getPopularGames, getAllTags } from '../lib/games';
import { itemListJsonLd } from '../lib/seo';

export default function HomePage() {
  const featured = getFeaturedGames();
  const popular = getPopularGames(5);
  const newest = getNewGames(5);
  const tags = getAllTags().slice(0, 18);

  return (
    <main>
      <JsonLd data={itemListJsonLd(featured, '/')} />
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Instant mobile arcade</span>
          <h1>Play fast. Retry faster. Chase the next run.</h1>
          <p>
            GR8 GAMZ is a neon browser-game hub built mobile-first: tap, swipe, hold and play instantly with no app download.
          </p>
          <div className="hero-actions">
            <Link href="/games" className="cta">Browse games</Link>
            <Link href="/popular" className="secondary-cta">Popular now</Link>
            <Link href="/platforms/mobile" className="secondary-cta">Mobile games</Link>
          </div>
        </div>
        <aside className="hero-panel" aria-label="GR8 GAMZ player stats and advertising">
          <div className="pulse-card">
            <strong>{featured.length}</strong>
            <span>launch games live now — designed for touchscreen play.</span>
          </div>
          <ProgressionPanel />
          <AdSlot placement={adPlacements.homeTop} compact />
        </aside>
      </section>

      <section className="launch-strip" aria-label="Launch readiness promises">
        <div><strong>5 premium games live</strong><span>Mobile-first controls, instant play and polished replay loops.</span></div>
        <div><strong>Ad-safe layout</strong><span>Clear labelled ad zones away from touch controls.</span></div>
        <div><strong>Search-ready structure</strong><span>Game, category, tag, platform and sitemap routes prepared.</span></div>
      </section>

      <section aria-label="Launch shortcuts" className="content-panel compact-panel">
        <div className="quick-link-grid">
          {siteConfig.launchLinks.map((link) => (
            <Link href={link.href} key={link.href} className="quick-link-card">
              <strong>{link.label}</strong>
              <small>Open collection</small>
            </Link>
          ))}
        </div>
      </section>

      <RecentlyPlayed />

      <section aria-label="Game categories">
        <div className="category-row">
          {siteConfig.categories.map((category) => (
            <CategoryPill key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section id="games">
        <div className="section-heading">
          <div>
            <span>Curated launch library</span>
            <h2>Pick a game and trigger the loop.</h2>
          </div>
          <p>
            The launch build now has proper game discovery pages, popular/new/A-Z routes, tags, platform hubs and mobile-first game controls.
          </p>
        </div>
        <GameGrid games={featured} />
      </section>

      <section>
        <div className="section-heading">
          <div>
            <span>Player pull</span>
            <h2>Popular right now.</h2>
          </div>
          <Link href="/popular" className="secondary-cta">View all popular</Link>
        </div>
        <GameGrid games={popular} showAd={false} />
      </section>

      <section>
        <div className="section-heading">
          <div>
            <span>Fresh drops</span>
            <h2>New GR8 games.</h2>
          </div>
          <Link href="/new" className="secondary-cta">View new games</Link>
        </div>
        <GameGrid games={newest} showAd={false} />
      </section>

      <section className="content-panel">
        <div className="section-heading compact">
          <span>Discovery tags</span>
          <h2>Find your next quick-play habit.</h2>
        </div>
        <div className="tag-list large-tags">
          {tags.map((tag) => (
            <Link key={tag} href={`/tags/${tag}`}><span>#{tag}</span></Link>
          ))}
        </div>
      </section>

      <DailyChallenge />

      <section className="section-heading">
        <div>
          <span>Competition layer</span>
          <h2>Give players a target.</h2>
        </div>
        <p>
          Leaderboards, streaks and rewards give every session a reason to continue while keeping the experience honest and advertiser-safe.
        </p>
      </section>
      <LeaderboardTerminal />
    </main>
  );
}
