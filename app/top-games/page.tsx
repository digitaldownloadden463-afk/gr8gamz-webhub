import GameCard from '@/components/GameCard';
import { games } from '@/lib/games';

export default function TopGamesPage() {
  const ordered = [...games].sort((a, b) => Number(Boolean(b.isFeatured || b.featured)) - Number(Boolean(a.isFeatured || a.featured)) || Number(b.plays || 0) - Number(a.plays || 0));
  return (
    <main>
      <section className="page-title">
        <h1>Top games</h1>
        <p>Featured and high-replay games in the GR8 arcade.</p>
      </section>
      <section className="game-grid">
        {ordered.map((game) => <GameCard key={game.id} game={game} />)}
      </section>
    </main>
  );
}
