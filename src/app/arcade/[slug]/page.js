import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdSlot from '../../../components/ads/AdSlot';
import GameGrid from '../../../components/GameGrid';
import JsonLd from '../../../components/JsonLd';
import ProgressionPanel from '../../../components/engagement/ProgressionPanel';
import LeaderboardTerminal from '../../../components/engagement/LeaderboardTerminal';
import { adPlacements } from '../../../lib/ads';
import { getAllGames, getGameBySlug, getGamesByCategory } from '../../../lib/games';
import { breadcrumbJsonLd, buildPageMetadata, gameJsonLd } from '../../../lib/seo';

export function generateStaticParams() {
  return getAllGames().map((game) => ({ slug: game.id }));
}

export function generateMetadata({ params }) {
  const game = getGameBySlug(params.slug);
  if (!game) return buildPageMetadata({ title: 'Game not found', path: `/arcade/${params.slug}`, noIndex: true });

  return buildPageMetadata({
    title: game.seoTitle || `Play ${game.name} Online`,
    description: game.seoDescription || game.description,
    path: `/arcade/${game.id}`
  });
}

export default function ArcadeGamePage({ params }) {
  const game = getGameBySlug(params.slug);
  if (!game) notFound();

  const related = getGamesByCategory(game.category).filter((item) => item.id !== game.id).slice(0, 3);
  const controls = game.controls || [];
  const hooks = game.engagementHooks || [];

  return (
    <main>
      <JsonLd data={gameJsonLd(game, `/arcade/${game.id}`)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Arcade', path: '/#games' },
          { name: game.name, path: `/arcade/${game.id}` }
        ])}
      />

      <div className="page-title">
        <span className="eyebrow">{game.genre} game</span>
        <h1>{game.name}</h1>
        <p>{game.description}</p>
      </div>

      <AdSlot placement={adPlacements.gameTop} />

      <section className="game-layout" style={{ marginTop: 18 }}>
        <article className="game-page-main">
          <div className="game-topbar">
            <div>
              <h1>{game.name}</h1>
              <p>{game.playStyle} · {game.difficulty} difficulty · instant browser play</p>
            </div>
            <Link href="/" className="secondary-cta">Back to hub</Link>
          </div>
          <div className="game-frame-wrap">
            <iframe
              title={`Play ${game.name}`}
              src={game.iframeUrl}
              loading="eager"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            />
          </div>
          <div className="game-notes">
            <div className="tag-list">
              {controls.map((control) => <span key={control}>{control}</span>)}
            </div>
            <p>{game.baseTrivia}</p>
          </div>
        </article>

        <aside className="game-sidebar">
          <ProgressionPanel gameName={game.name} awardOnMount />
          <AdSlot placement={adPlacements.gameSide} />
          <LeaderboardTerminal />
        </aside>
      </section>

      <section className="content-panel" style={{ marginTop: 18 }}>
        <h2>Why players come back to {game.name}</h2>
        <div className="tag-list">
          {hooks.map((hook) => <span key={hook}>{hook}</span>)}
        </div>
        <p>
          The page is structured for future expansion with game FAQs, tips, update notes, multilingual descriptions, related games, schema and safe ad inventory.
        </p>
      </section>

      <AdSlot placement={adPlacements.gameBottom} />

      {related.length ? (
        <section>
          <div className="section-heading">
            <div>
              <span>Next game loop</span>
              <h2>More like {game.name}</h2>
            </div>
          </div>
          <GameGrid games={related} showAd={false} />
        </section>
      ) : null}
    </main>
  );
}
