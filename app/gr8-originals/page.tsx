import { Gamepad2 } from 'lucide-react';
import GameCard from '@/components/GameCard';
import { canonical, gameCountLabel } from '@/lib/features';
import { getAllGames } from '@/lib/games';

export const metadata = {
  title: 'GR8 Originals',
  description: 'Play the full GR8 GAMZ original arcade collection on phone, tablet and desktop.',
  alternates: { canonical: canonical('/gr8-originals') }
};

export default function Gr8OriginalsPage() {
  const games = getAllGames();

  return (
    <main>
      <section className="page-title">
        <span className="eyebrow"><Gamepad2 size={18} aria-hidden="true" /> GR8 Originals</span>
        <h1>Original GR8 GAMZ games built for instant play.</h1>
        <p>Play {gameCountLabel(games.length)} browser games with clear controls, mobile-friendly layouts and artwork made for the GR8 GAMZ arcade.</p>
      </section>

      <section className="game-grid" aria-label="GR8 original games">
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
            priority={index < 6}
          />
        ))}
      </section>
    </main>
  );
}
