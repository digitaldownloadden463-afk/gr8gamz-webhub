import GameCard from '@/components/GameCard';
import { getTopGames } from '@/lib/games';
import { canonical } from '@/lib/features';

export const metadata = {
  title: 'Top Games',
  description: 'A curated list of standout original GR8 GAMZ browser games.',
  alternates: { canonical: canonical('/top-games') }
};

export default function TopGamesPage() {
  const games = getTopGames();
  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">Top picks</span>
        <h1>Standout original games.</h1>
        <p>These are curated original games from the GR8 GAMZ library, chosen for clarity, replay value and mobile controls.</p>
      </section>
      <section className="game-grid">
        {games.map((game, index) => (
          <GameCard
            key={game.id}
            id={game.id}
            title={game.name}
            category={game.category || game.genre || 'Arcade'}
            imageUrl={game.thumbnail || '/placeholder.png'}
            url={`/arcade/${game.slug || game.id}`}
            dateAdded={game.dateAdded}
            controls={game.shortControls || game.controls?.[0]}
            difficulty={game.difficulty}
            priority={index < 4}
          />
        ))}
      </section>
    </main>
  );
}
