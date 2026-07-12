import Link from 'next/link';
import { notFound } from 'next/navigation';
import ActivityFeed from '@/components/ActivityFeed';
import GameActions from '@/components/GameActions';
import GameComments from '@/components/GameComments';
import GamePlayerFrame from '@/components/GamePlayerFrame';
import { getAllGames, getGameBySlug } from '@/lib/games';

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllGames().map((game) => ({ slug: game.slug || game.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) notFound();
  const name = game.name || game.title || 'GR8 Game';
  const title = game.seoTitle || `${name} | GR8 GAMZ`;
  const description = game.seoDescription || game.description || `Play ${name} on GR8 GAMZ.`;
  const canonical = `/arcade/${game.slug || game.id}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: game.thumbnail ? [{ url: game.thumbnail, alt: game.thumbnailAlt || `${name} artwork` }] : undefined
    }
  };
}

export default async function ArcadeGamePage({ params }: PageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) notFound();
  return (
    <main>
      <Link href="/games" className="secondary-cta">← Back to games</Link>
      <section className="page-title" style={{ marginTop: 18 }}>
        <h1>{game.emoji || '🎮'} {game.name || game.title}</h1>
        <p>{game.description || 'Play this free GR8 GAMZ browser game.'}</p>
      </section>
      <GameActions game={game} />
      <GamePlayerFrame game={game} />
      <section className="content-panel" style={{ marginTop: 18 }}>
        <span className="eyebrow">Game guide</span>
        <h2>How to play {game.name || game.title}</h2>
        <p>{game.longDescription || game.description}</p>
        {game.controls?.length ? (
          <div className="home-grid" style={{ marginTop: 16 }}>
            <article>
              <h3>Controls</h3>
              <ul>
                {game.controls.map((control) => <li key={control}>{control}</li>)}
              </ul>
            </article>
            {game.engagementHooks?.length ? (
              <article>
                <h3>Why play another round</h3>
                <ul>
                  {game.engagementHooks.map((hook) => <li key={hook}>{hook}</li>)}
                </ul>
              </article>
            ) : null}
          </div>
        ) : null}
        {game.baseTrivia ? <p><strong>Did you know?</strong> {game.baseTrivia}</p> : null}
      </section>
      <section className="home-grid" style={{ marginTop: 18 }}>
        <ActivityFeed />
        <GameComments slug={slug} game={game} />
      </section>
    </main>
  );
}
