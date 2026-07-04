import Link from 'next/link';
import ActivityFeed from '@/components/ActivityFeed';
import GameActions from '@/components/GameActions';
import GameComments from '@/components/GameComments';
import GamePlayerFrame from '@/components/GamePlayerFrame';
import { getAllGames, getGameBySlug } from '@/lib/games';

type PageProps = { params: { slug: string } };

export function generateStaticParams() {
  return getAllGames().map((game) => ({ slug: game.slug || game.id }));
}

export function generateMetadata({ params }: PageProps) {
  const game = getGameBySlug(params.slug);
  const title = game?.name || game?.title || 'GR8 Game';
  return {
    title: `${title} | GR8 GAMZ`,
    description: game?.description || `Play ${title} on GR8 GAMZ.`
  };
}

export default function ArcadeGamePage({ params }: PageProps) {
  const game = getGameBySlug(params.slug);
  if (!game) {
    return (
      <main>
        <section className="page-title">
          <h1>Game not found</h1>
          <p>This arcade page could not find a matching game slug.</p>
          <Link href="/games" className="cta">Browse games</Link>
        </section>
      </main>
    );
  }
  return (
    <main>
      <Link href="/games" className="secondary-cta">← Back to games</Link>
      <section className="page-title" style={{ marginTop: 18 }}>
        <h1>{game.emoji || '🎮'} {game.name || game.title}</h1>
        <p>{game.description || 'Play this free GR8 GAMZ browser game.'}</p>
      </section>
      <GameActions game={game} />
      <GamePlayerFrame game={game} />
      <section className="home-grid" style={{ marginTop: 18 }}>
        <ActivityFeed />
        <GameComments slug={params.slug} game={game} />
      </section>
    </main>
  );
}
