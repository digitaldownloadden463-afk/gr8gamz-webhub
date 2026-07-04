import { ActivityFeed } from "@/components/ActivityFeed";
import { GameCard } from "@/components/GameCard";
import { PlayerPanel } from "@/components/PlayerPanel";
import { categories, games, getFeaturedGames } from "@/lib/games";

export default function HomePage() {
  const featuredGames = getFeaturedGames();

  return (
    <div className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Phase 3 live</p>
          <h1>Free online games with player profiles, favourites and live activity.</h1>
          <p>
            GR8 GAMZ is now moving from a simple arcade directory into a proper player community. This phase adds
            profile creation, favourites, likes, play tracking, recent games, comments and a live activity feed.
          </p>
          <div className="hero-actions">
            <a href="#featured" className="primary-button large">
              Play featured games
            </a>
            <a href="/community" className="secondary-button large">
              View community
            </a>
          </div>
        </div>
        <div className="hero-card-stack" aria-label="GR8 GAMZ highlights">
          <div className="floating-card top">
            <strong>🎮 Player profiles</strong>
            <span>Local sign-up shell ready for backend accounts</span>
          </div>
          <div className="floating-card middle">
            <strong>🔥 Live action feed</strong>
            <span>Plays, likes, favourites and comments feel active</span>
          </div>
          <div className="floating-card bottom">
            <strong>📱 Mobile-first controls</strong>
            <span>Tap, swipe and big button friendly pages</span>
          </div>
        </div>
      </section>

      <section className="home-grid">
        <PlayerPanel />
        <ActivityFeed compact />
      </section>

      <section className="category-strip" aria-label="Game categories">
        {categories.map((category) => (
          <span key={category}>{category}</span>
        ))}
      </section>

      <section id="featured" className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Featured games</p>
          <h2>Start with the games that should get the most clicks</h2>
        </div>
        <div className="game-grid">
          {featuredGames.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">All games</p>
          <h2>Arcade library</h2>
        </div>
        <div className="game-grid">
          {games.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      </section>
    </div>
  );
}
