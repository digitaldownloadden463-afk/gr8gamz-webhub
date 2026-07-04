import GameCard from '@/components/GameCard';
import { getAllGames } from '@/lib/games';

export default function GamesPage() {
  return (
    <main>
      <section className="page-title">
        <h1>All GR8 games</h1>
        <p>Browse the stabilised GR8 GAMZ arcade.</p>
      </section>
      <section className="game-grid">
        {getAllGames().map((game) => <GameCard key={game.id} game={game} />)}
      </section>
    </main>
  );
}
