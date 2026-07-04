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
    description: game?.description || `Play ${title} on GR8 GAMZ.`,
    robots: { index: true, follow: true }
  };
}

export default function ArcadeGamePage({ params }: PageProps) {
  const game = getGameBySlug(params.slug);

  if (!game) {
    return (
      <main style={{ padding: '48px 0' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
          <span style={{ color: '#35ff8d', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.08em' }}>GR8 GAMZ</span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', lineHeight: .9, margin: '14px 0' }}>Game not found.</h1>
          <p style={{ color: '#a1a1aa' }}>This arcade page could not find a matching game slug.</p>
          <Link href="/games" style={{ color: '#35ff8d', fontWeight: 900 }}>Browse games</Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: '24px 0 48px' }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 18 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
          <Link href="/games" style={{ color: '#a1a1aa', textDecoration: 'none' }}>← Back to games</Link>
          <h1 style={{ fontSize: 'clamp(2.4rem, 7vw, 5.4rem)', lineHeight: .9, letterSpacing: '-.08em', margin: '14px 0 10px' }}>{game.emoji || '🎮'} {game.name || game.title}</h1>
          <p style={{ color: '#a1a1aa', maxWidth: 760, lineHeight: 1.55 }}>{game.description || 'Play this free GR8 GAMZ browser game.'}</p>
          <GameActions game={game} />
          <GamePlayerFrame game={game} />
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 18, marginTop: 18 }}>
            <ActivityFeed />
            <GameComments slug={params.slug} game={game} />
          </div>
        </div>
      </section>
    </main>
  );
}
