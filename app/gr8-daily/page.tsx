import Link from 'next/link';
import { ArrowRight, CalendarDays } from 'lucide-react';
import GameCard from '@/components/GameCard';
import { canonical } from '@/lib/features';
import { getAllGames } from '@/lib/games';

export const revalidate = 3600;

export const metadata = {
  title: 'GR8 Daily',
  description: 'A fresh daily GR8 GAMZ browser game pick with more quick games to play next.',
  alternates: { canonical: canonical('/gr8-daily') }
};

function getDailyIndex(count: number) {
  const now = new Date();
  const utcDay = Math.floor(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 86400000);
  return count > 0 ? utcDay % count : 0;
}

function getWeeklyIndex(count: number) {
  const now = new Date();
  const utcWeek = Math.floor(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / (86400000 * 7));
  return count > 0 ? (utcWeek * 7 + 3) % count : 0;
}

export default function Gr8DailyPage() {
  const games = getAllGames();
  const dailyGame = games[getDailyIndex(games.length)];
  const weeklyGame = games[getWeeklyIndex(games.length)];
  const nextGames = games.filter((game) => game.id !== dailyGame?.id && game.id !== weeklyGame?.id).slice(0, 6);

  return (
    <main>
      <section className="page-title">
        <span className="eyebrow"><CalendarDays size={18} aria-hidden="true" /> GR8 Daily</span>
        <h1>Today&apos;s quick-play challenge.</h1>
        <p>One original GR8 GAMZ game gets the spotlight each day, with more fast starts ready when you want another run.</p>
      </section>

      {dailyGame ? (
        <section className="daily-feature" aria-label={`Today&apos;s pick: ${dailyGame.name}`}>
          <GameCard
            id={dailyGame.id}
            title={dailyGame.name}
            category={dailyGame.category || dailyGame.genre || 'Arcade'}
            imageUrl={dailyGame.thumbnail || '/placeholder.png'}
            url={`/arcade/${dailyGame.slug || dailyGame.id}`}
            dateAdded={dailyGame.dateAdded}
            controls={dailyGame.shortControls || dailyGame.controls?.[0]}
            difficulty={dailyGame.difficulty}
            priority
          />
          <div className="content-panel">
            <span className="eyebrow">Daily pick</span>
            <h2>{dailyGame.name}</h2>
            <p>{dailyGame.description || dailyGame.longDescription || 'Jump into a fast original browser game built for GR8 GAMZ players.'}</p>
            <Link href={`/arcade/${dailyGame.slug || dailyGame.id}`} className="cta">Play today&apos;s pick <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
        </section>
      ) : null}

      {weeklyGame ? (
        <section className="content-panel">
          <span className="eyebrow">Weekly run</span>
          <h2>{weeklyGame.name}</h2>
          <p>A stable weekly GR8 Original for return visits. Try it once, save it locally and come back for another run when you want.</p>
          <Link href={`/arcade/${weeklyGame.slug || weeklyGame.id}`} className="secondary-cta">Play weekly pick <ArrowRight size={18} aria-hidden="true" /></Link>
        </section>
      ) : null}

      <section className="game-section">
        <div className="section-heading">
          <span className="eyebrow">Play next</span>
          <h2>More quick GR8 Originals.</h2>
          <Link href="/gr8-originals">All originals <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
        <div className="game-grid">
          {nextGames.map((game) => (
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
            />
          ))}
        </div>
      </section>
    </main>
  );
}
