import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdSlot from '../../../components/ads/AdSlot';
import GameGrid from '../../../components/GameGrid';
import JsonLd from '../../../components/JsonLd';
import GameSessionTools from '../../../components/player/GameSessionTools';
import ImmersiveGameFrame from '../../../components/player/ImmersiveGameFrame';
import GameInstructionPanel from '../../../components/player/GameInstructionPanel';
import AchievementBadges from '../../../components/player/AchievementBadges';
import DiscoveryRail from '../../../components/player/DiscoveryRail';
import GameSeoSections, { buildGameFaq } from '../../../components/seo/GameSeoSections';
import ProgressionPanel from '../../../components/engagement/ProgressionPanel';
import LeaderboardTerminal from '../../../components/engagement/LeaderboardTerminal';
import { adPlacements } from '../../../lib/ads';
import { getAllGames, getGameBySlug, getRelatedGames, getQuickPlayGames } from '../../../lib/games';
import { breadcrumbJsonLd, buildPageMetadata, faqJsonLd, gameJsonLd, imageObjectJsonLd } from '../../../lib/seo';

export function generateStaticParams() {
  return getAllGames().map((game) => ({ slug: game.id }));
}

export function generateMetadata({ params }) {
  const game = getGameBySlug(params.slug);
  if (!game) return buildPageMetadata({ title: 'Game not found', path: `/arcade/${params.slug}`, noIndex: true });

  return buildPageMetadata({
    title: game.seoTitle || `Play ${game.name} Online`,
    description: game.seoDescription || game.description,
    path: `/arcade/${game.id}`,
    image: game.thumbnail || undefined
  });
}

export default function ArcadeGamePage({ params }) {
  const game = getGameBySlug(params.slug);
  if (!game) notFound();

  const related = getRelatedGames(game, 4);
  const quickPlay = getQuickPlayGames(5);
  const controls = game.controls || [];
  const hooks = game.engagementHooks || [];

  return (
    <main className="arcade-fullscreen-play">
      <JsonLd data={gameJsonLd(game, `/arcade/${game.id}`)} />
      <JsonLd data={faqJsonLd(buildGameFaq(game))} />
      <JsonLd data={imageObjectJsonLd({
        name: `${game.name} thumbnail`,
        description: game.thumbnailAlt || `${game.name} game artwork`,
        image: game.thumbnail || '/og/gr8gamz-og.png',
        path: `/arcade/${game.id}`
      })} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Games', path: '/games' },
          { name: game.name, path: `/arcade/${game.id}` }
        ])}
      />

      <div className="page-title game-title-row">
        <div>
          <span className="eyebrow">{game.genre} game · {game.status}</span>
          <h1>{game.name}</h1>
          <p>{game.description}</p>
        </div>
        <div className="rating-card">
          <strong>{game.rating?.toFixed ? game.rating.toFixed(1) : game.rating}</strong>
          <span>GR8 launch score</span>
        </div>
      </div>

      <AdSlot placement={adPlacements.gameTop} />

      <GameInstructionPanel game={game} />

      <section className="game-layout" style={{ marginTop: 18 }}>
        <article className="game-page-main">
          <div className="game-topbar">
            <div>
              <h1>{game.name}</h1>
              <p>{game.playStyle} · {game.difficulty} difficulty · {game.shortControls || 'mobile-ready controls'}</p>
            </div>
            <div className="hero-actions compact-actions"><Link href={`/guides/${game.id}`} className="secondary-cta">Game guide</Link><Link href="/games" className="secondary-cta">All games</Link></div>
          </div>
          <ImmersiveGameFrame game={game} nextGame={related[0]} />
          <div className="game-notes">
            <GameSessionTools game={game} />
            <div className="tag-list">
              {controls.map((control) => <span key={control}>{control}</span>)}
            </div>
            <p>{game.longDescription || game.baseTrivia}</p>
            <div className="tag-list large-tags">
              {(game.tags || []).map((tag) => <Link key={tag} href={`/tags/${tag}`}><span>#{tag}</span></Link>)}
            </div>
          </div>
        </article>

        <aside className="game-sidebar">
          <ProgressionPanel gameName={game.name} awardOnMount />
          <AdSlot placement={adPlacements.gameSide} />
          <LeaderboardTerminal />
        </aside>
      </section>

      <section className="content-panel" style={{ marginTop: 18 }}>
        <h2>Why {game.name} is built for repeat play</h2>
        <p>{game.longDescription || game.baseTrivia}</p>
        <div className="tag-list">
          {hooks.map((hook) => <span key={hook}>{hook}</span>)}
        </div>
      </section>

      <GameSeoSections game={game} related={related} />

      <DiscoveryRail
        eyebrow="Quick next run"
        title="Short games to play after this."
        description="Keep the session alive with a fast restart-style game path."
        games={quickPlay.filter((item) => item.id !== game.id).slice(0, 5)}
        href="/games?control=tap"
      />

      <AchievementBadges />

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
