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
      <section className="hero hero-premium">
        <div className="hero-copy hero-copy-premium">
          <span className="eyebrow">Instant mobile arcade</span>
          <h1>Welcome to the neon world players want to come back to.</h1>
          <p>
            GR8 GAMZ is a premium browser-game hub built for fast dopamine loops, memorable visuals and instant touchscreen play.
            Jump into original neon games, selection labs, garage pickers and quick-play sessions with no app download.
          </p>
          <div className="hero-actions">
            <Link href="/games" className="cta">Browse games</Link>
            <Link href="/popular" className="secondary-cta">Popular now</Link>
            <Link href="/platforms/originals" className="secondary-cta">Original games</Link>
          </div>
          <div className="hero-support-grid" aria-label="GR8 GAMZ launch highlights">
            <div className="hero-support-card">
              <strong>Premium launch games</strong>
              <span>Five polished originals, each with its own replay hook and control style.</span>
            </div>
            <div className="hero-support-card">
              <strong>Selection labs live</strong>
              <span>Garages, hangars, lockers and snake labs create variety and replay value.</span>
            </div>
            <div className="hero-support-card">
              <strong>Built for quick returns</strong>
              <span>Fast restarts, meaningful choices and memorable visuals keep players inside the loop.</span>
            </div>
          </div>
        </div>
        <aside className="hero-visual" aria-label="GR8 GAMZ visual showcase and live platform panel">
          <div className="hero-art-card">
            <img
              src="/art/homepage-hero-arena.png"
              alt="Epic GR8 GAMZ neon arcade montage with racing, sports, space and digital action"
            />
            <div className="hero-floating-badge hero-floating-badge-top">Original neon arcade universe</div>
            <div className="hero-floating-badge hero-floating-badge-bottom">Fast play • sharp visuals • mobile first</div>
          </div>
          <div className="hero-visual-stack">
            <div className="pulse-card hero-pulse-card">
              <strong>{featured.length}</strong>
              <span>premium launch games now live and tuned for mobile-first play.</span>
            </div>
            <div className="hero-mini-panels">
              <div>
                <strong>5</strong>
                <span>selection menus live</span>
              </div>
              <div>
                <strong>90</strong>
                <span>routes generated</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>instant browser access</span>
              </div>
            </div>
            <AdSlot placement={adPlacements.homeTop} compact />
          </div>
        </aside>
      </section>

      <section className="launch-strip" aria-label="Launch readiness promises">
        <div><strong>5 premium games live</strong><span>Mobile-first controls, instant play and polished replay loops.</span></div>
        <div><strong>Ad-safe layout</strong><span>Clear labelled ad zones away from touch controls.</span></div>
        <div><strong>Search-ready structure</strong><span>Game, category, tag, platform and sitemap routes prepared.</span></div>
      </section>

      <section className="immersive-banner" aria-label="GR8 GAMZ world building banner">
        <div className="immersive-banner-copy">
          <span className="eyebrow">Built to be memorable</span>
          <h2>More than a game list — this is a neon arcade world.</h2>
          <p>
            The homepage now leads with cinematic branded artwork so GR8 GAMZ feels like a destination. Expect original visuals,
            touch-friendly games, sharper discovery pages and a universe that grows with every launch.
          </p>
        </div>
        <div className="immersive-banner-actions">
          <Link href="/games" className="cta">Enter the arcade</Link>
          <Link href="/tags/mobile" className="secondary-cta">Touchscreen picks</Link>
        </div>
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
