import GameCard from '@/components/GameCard';
import { canonical } from '@/lib/features';
import { getAllGames } from '@/lib/games';

export const metadata = {
  title: 'Quick Games',
  description: 'Short-session GR8 GAMZ browser games for fast starts and one-more-run play.',
  alternates: { canonical: canonical('/quick-games') }
};

export default function QuickGamesPage() {
  const games = getAllGames().filter((game) => /quick|easy|short|tap|arcade/i.test(`${game.difficulty} ${game.playStyle} ${game.shortControls} ${game.category}`));
  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">Quick Games</span>
        <h1>Pick a game. Play a run. Go again.</h1>
        <p>Fast GR8 Originals for short breaks on phone, tablet or desktop.</p>
      </section>
      <section className="game-grid">
        {games.map((game, index) => (
          <GameCard key={game.id} id={game.id} title={game.name} category={game.category || game.genre || 'Arcade'} imageUrl={game.thumbnail || '/placeholder.png'} url={`/arcade/${game.slug || game.id}`} dateAdded={game.dateAdded} controls={game.shortControls || game.controls?.[0]} difficulty={game.difficulty} priority={index < 6} />
        ))}
      </section>
    </main>
  );
}
