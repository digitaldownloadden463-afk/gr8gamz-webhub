import Link from 'next/link';
import { ActivityFeed } from '@/components/ActivityFeed';
import GameCard from '@/components/GameCard';
import PlayerPanel from '@/components/PlayerPanel';
import { categories, getFeaturedGames } from '@/lib/games';

export default function HomePage() {
  const featured = getFeaturedGames(6);
  return (
    <main>
      <section className="hero">
        <span style={{ color: '#35ff8d', fontWeight: 950, textTransform: 'uppercase', letterSpacing: '.08em' }}>GR8 GAMZ</span>
        <h1>Free online games. Fast arcade action.</h1>
        <p>Play instant browser games, save favourites, build your GR8 Passport and explore the Clubhouse.</p>
        <div className="cta-row">
          <Link href="/games" className="cta">Play games</Link>
          <Link href="/auth" className="secondary-cta">GR8 Passport</Link>
          <Link href="/community" className="secondary-cta">Clubhouse</Link>
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

      <section className="game-grid">
        {featured.map((game) => <GameCard key={game.id} game={game} />)}
      </section>
    </main>
  );
}
