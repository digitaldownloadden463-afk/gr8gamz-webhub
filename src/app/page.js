import Link from 'next/link';
import GameGrid from '../components/GameGrid';
import CategoryPill from '../components/CategoryPill';
import DailyChallenge from '../components/engagement/DailyChallenge';
import LeaderboardTerminal from '../components/engagement/LeaderboardTerminal';
import RecentlyPlayed from '../components/player/RecentlyPlayed';
import DailyReward from '../components/player/DailyReward';
import AchievementBadges from '../components/player/AchievementBadges';
import DiscoveryRail from '../components/player/DiscoveryRail';
import ContentRail from '../components/content/ContentRail';
import JsonLd from '../components/JsonLd';
import LivePreviewScreens from '../components/LivePreviewScreens';
import NetworkMegaPanel from '../components/NetworkMegaPanel';
import { siteConfig } from '../data/site';
import { getFeaturedGames, getNewGames, getPopularGames, getAllTags, getQuickPlayGames, getHardModeGames } from '../lib/games';
import { getFeaturedUpdatePosts } from '../lib/content';
import { itemListJsonLd } from '../lib/seo';

export default function HomePage() {
  const featured = getFeaturedGames(12);
  const popular = getPopularGames(8);
  const newest = getNewGames(10);
  const tags = getAllTags().slice(0, 18);
  const quickPlay = getQuickPlayGames(6);
  const hardMode = getHardModeGames(6);
  const latestPosts = getFeaturedUpdatePosts(3);

  return (
    <main>
      <JsonLd data={itemListJsonLd(featured, '/')} />
      <section className="hero hero-premium hero-network-v23">
        <div className="hero-copy hero-copy-premium">
          <span className="eyebrow">GR8 Game Network • free browser games</span>
          <h1>Originals. Hot picks. More free games. One GR8 arcade.</h1>
          <p>
            GR8 GAMZ is now shaped as a full browser gaming network: original self-hosted games, live-style preview screens, partner-powered game discovery, gaming deals and search-ready content hubs built to grow into the market.
          </p>
          <div className="hero-actions">
            <Link href="/original-games" className="cta">Play GR8 Originals</Link>
            <Link href="/more-free-games" className="secondary-cta">More Free Games</Link>
            <Link href="/hot-picks" className="secondary-cta">Hot Picks</Link>
          </div>
          <div className="hero-support-grid" aria-label="GR8 GAMZ network highlights">
            <div className="hero-support-card">
              <strong>Brand-first network</strong>
              <span>Partner catalogues are presented as More Free Games, keeping GR8 GAMZ as the main brand.</span>
            </div>
            <div className="hero-support-card">
              <strong>Google content engine</strong>
              <span>More crawlable hub pages, collections, update posts, schema and sitemap routes.</span>
            </div>
            <div className="hero-support-card">
              <strong>Live arcade feel</strong>
              <span>Animated preview screens make the homepage feel active without loading heavy background iframes.</span>
            </div>
          </div>
        </div>
        <aside className="hero-visual hero-live-preview" aria-label="GR8 GAMZ live demo screens">
          <LivePreviewScreens />
        </aside>
      </section>

      <section className="launch-strip network-strip" aria-label="Network positioning promises">
        <div><strong>GR8 Originals</strong><span>Self-hosted games with mobile controls, XP hooks and replay loops.</span></div>
        <div><strong>More Free Games</strong><span>Partner-powered catalogues presented under the GR8 Game Network.</span></div>
        <div><strong>Google-ready footprint</strong><span>Helpful hub pages, rich schema, feeds, sitemaps and IndexNow routes.</span></div>
      </section>

      <NetworkMegaPanel />

      <DailyReward />

      <section id="games">
        <div className="section-heading section-heading-primary">
          <div>
            <span>Start here</span>
            <h2>GR8 original games with the strongest replay loops.</h2>
          </div>
          <p>
            These self-hosted games are the brand-owned core of GR8 GAMZ. They keep the arcade distinctive while the wider game network adds scale.
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
        href="/one-tap-games"
      />

      <DiscoveryRail
        eyebrow="Skill climb"
        title="Harder runs to master."
        description="Push players into tougher loops once they are warmed up and ready for a bigger challenge."
        games={hardMode}
        href="/difficulty/medium"
      />

      <AchievementBadges />

      <section className="immersive-banner" aria-label="GR8 GAMZ market growth banner">
        <div className="immersive-banner-copy">
          <span className="eyebrow">Built to outgrow a simple game list</span>
          <h2>A premium neon arcade brand with a serious search footprint.</h2>
          <p>
            The next stage is about scale with quality: more useful pages, stronger internal links, clear branding, live-feeling discovery and a revenue path that does not damage the player experience.
          </p>
        </div>
        <div className="immersive-banner-actions">
          <Link href="/free-online-games" className="cta">Free online games</Link>
          <Link href="/gaming-deals" className="secondary-cta">Gaming deals</Link>
        </div>
      </section>

      <section aria-label="Growth shortcuts" className="content-panel compact-panel">
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
            <span>Featured now</span>
            <h2>Hot picks for repeat players.</h2>
          </div>
          <Link href="/hot-picks" className="secondary-cta">View hot picks</Link>
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

      <section className="content-panel compact-panel">
        <div className="section-heading compact">
          <span>Growth automation</span>
          <h2>Fresh routes for crawlers and players.</h2>
        </div>
        <div className="quick-link-grid">
          <Link href="/latest" className="quick-link-card">
            <strong>Latest changed pages</strong>
            <small>Fresh crawl map for new updates, games and collections</small>
          </Link>
          <Link href="/feeds" className="quick-link-card">
            <strong>Feeds and sitemaps</strong>
            <small>RSS, JSON Feed, grouped sitemaps and IndexNow URL list</small>
          </Link>
          <Link href="/seo-status" className="quick-link-card">
            <strong>SEO status</strong>
            <small>Operational checklist for indexing and discovery</small>
          </Link>
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
