import Link from 'next/link';
import GameGrid from '../components/GameGrid';
import CategoryPill from '../components/CategoryPill';
import DailyChallenge from '../components/engagement/DailyChallenge';
import LeaderboardTerminal from '../components/engagement/LeaderboardTerminal';
import ProgressionPanel from '../components/engagement/ProgressionPanel';
import RecentlyPlayed from '../components/player/RecentlyPlayed';
import DailyReward from '../components/player/DailyReward';
import AchievementBadges from '../components/player/AchievementBadges';
import DiscoveryRail from '../components/player/DiscoveryRail';
import ContentRail from '../components/content/ContentRail';
import AdSlot from '../components/ads/AdSlot';
import JsonLd from '../components/JsonLd';
import { siteConfig } from '../data/site';
import { adPlacements } from '../lib/ads';
import { getFeaturedGames, getNewGames, getPopularGames, getAllTags, getQuickPlayGames, getHardModeGames } from '../lib/games';
import { getFeaturedUpdatePosts } from '../lib/content';
import { itemListJsonLd } from '../lib/seo';

export default function HomePage() {
  const featured = getFeaturedGames(15);
  const popular = getPopularGames(8);
  const newest = getNewGames(10);
  const tags = getAllTags().slice(0, 18);
  const quickPlay = getQuickPlayGames(6);
  const hardMode = getHardModeGames(6);
  const latestPosts = getFeaturedUpdatePosts(3);

  return (
    <main>
      <JsonLd data={itemListJsonLd(featured, '/')} />
      <section className="hero hero-premium">
        <div className="hero-copy hero-copy-premium">
          <span className="eyebrow">Free browser games • mobile-first</span>
          <h1>Play quick. Pick your style. Chase one more run.</h1>
          <p>
            Jump into premium GR8 GAMZ originals with neon visuals, instant restarts, vehicle garages, snake labs, hangars,
            team lockers and touchscreen controls built for fast repeat play.
          </p>
          <div className="hero-actions">
            <Link href="/games" className="cta">Start playing</Link>
            <Link href="/popular" className="secondary-cta">Popular games</Link>
            <Link href="/platforms/mobile" className="secondary-cta">Mobile picks</Link>
          </div>
          <div className="hero-support-grid" aria-label="GR8 GAMZ launch highlights">
            <div className="hero-support-card">
              <strong>Pick before you play</strong>
              <span>Cars, vans, ships, snakes, shot styles and build modes make each run feel different.</span>
            </div>
            <div className="hero-support-card">
              <strong>Fast replay loops</strong>
              <span>Short sessions, strong game-over screens and instant restarts keep the momentum alive.</span>
            </div>
            <div className="hero-support-card">
              <strong>Made for mobile</strong>
              <span>Swipe, tap, hold and drag controls are designed for touchscreen play first.</span>
            </div>
          </div>
        </div>
        <aside className="hero-visual" aria-label="GR8 GAMZ visual showcase and live platform panel">
          <div className="hero-art-card">
            <img
              src="/art/homepage-hero-arena.webp"
              alt="Epic GR8 GAMZ neon arcade montage with racing, sports, space and digital action"
              fetchPriority="high"
              decoding="async"
            />
            <div className="hero-floating-badge hero-floating-badge-top">Original neon arcade universe</div>
            <div className="hero-floating-badge hero-floating-badge-bottom">Fast play • sharp visuals • mobile first</div>
          </div>
          <div className="hero-visual-stack">
            <div className="pulse-card hero-pulse-card">
              <strong>{featured.length}</strong>
              <span>premium launch games live now, with more originals planned.</span>
            </div>
            <div className="hero-mini-panels">
              <div>
                <strong>5</strong>
                <span>selection menus</span>
              </div>
              <div>
                <strong>90</strong>
                <span>search-ready routes</span>
              </div>
              <div>
                <strong>0</strong>
                <span>downloads needed</span>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="launch-strip" aria-label="Launch readiness promises">
        <div><strong>Choose your loadout</strong><span>Garages, labs, hangars and lockers add replay value before each run.</span></div>
        <div><strong>Built for repeat visits</strong><span>Daily challenges, XP panels, popular pages and quick restarts give players a reason to return.</span></div>
        <div><strong>Ad-safe layout</strong><span>Clear labelled ad zones are positioned away from gameplay controls.</span></div>
      </section>

      <DailyReward />

      <section id="games">
        <div className="section-heading section-heading-primary">
          <div>
            <span>Start here</span>
            <h2>Launch games with the strongest replay loops.</h2>
          </div>
          <p>
            Pick a game, choose your style and jump straight into a short high-score run built for mobile.
          </p>
        </div>
        <GameGrid games={featured} />
      </section>

      <RecentlyPlayed />

      <DiscoveryRail
        eyebrow="Recommended next"
        title="Quick 60-second games."
        description="Short sessions, simple controls and fast restarts for players who want instant action."
        games={quickPlay}
        href="/controls/tap"
      />

      <DiscoveryRail
        eyebrow="Skill climb"
        title="Harder runs to master."
        description="Push players into tougher loops once they are warmed up and ready for a bigger challenge."
        games={hardMode}
        href="/difficulty/medium"
      />

      <AchievementBadges />

      <section className="immersive-banner" aria-label="GR8 GAMZ world building banner">
        <div className="immersive-banner-copy">
          <span className="eyebrow">Built to be memorable</span>
          <h2>Not just a game list — a neon arcade world.</h2>
          <p>
            GR8 GAMZ is being shaped into a fast, visual and mobile-first browser-game destination with original games,
            rich discovery pages and a growing universe of categories, tags and challenges.
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

      <section aria-label="Game categories">
        <div className="section-heading">
          <div>
            <span>Browse by mood</span>
            <h2>Choose a category.</h2>
          </div>
        </div>
        <div className="category-row">
          {siteConfig.categories.map((category) => (
            <CategoryPill key={category.id} category={category} />
          ))}
        </div>
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

      <ContentRail posts={latestPosts} eyebrow="Fresh crawl layer" title="Latest GR8 GAMZ updates." />

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
