import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdSlot from '../../../../components/ads/AdSlot';
import JsonLd from '../../../../components/JsonLd';
import ProgressionPanel from '../../../../components/engagement/ProgressionPanel';
import LeaderboardTerminal from '../../../../components/engagement/LeaderboardTerminal';
import { siteConfig } from '../../../../data/site';
import { adPlacements } from '../../../../lib/ads';
import { getAllGames, getGameBySlug, getGameTranslation, isValidLocale } from '../../../../lib/games';
import { breadcrumbJsonLd, buildPageMetadata, gameJsonLd } from '../../../../lib/seo';

export function generateStaticParams() {
  return siteConfig.locales
    .filter((locale) => locale !== siteConfig.defaultLocale)
    .flatMap((locale) => getAllGames().map((game) => ({ locale, slug: game.id })));
}

export function generateMetadata({ params }) {
  const baseGame = getGameBySlug(params.slug);
  if (!isValidLocale(params.locale) || !baseGame) {
    return buildPageMetadata({ title: 'Game not found', path: `/${params.locale}/arcade/${params.slug}`, noIndex: true });
  }
  const game = getGameTranslation(baseGame, params.locale);
  return buildPageMetadata({
    title: `${game.name} Online`,
    description: game.description,
    path: `/${params.locale}/arcade/${game.id}`
  });
}

export default function LocalisedGamePage({ params }) {
  if (!isValidLocale(params.locale) || params.locale === siteConfig.defaultLocale) notFound();
  const baseGame = getGameBySlug(params.slug);
  if (!baseGame) notFound();

  const game = getGameTranslation(baseGame, params.locale);
  const path = `/${params.locale}/arcade/${game.id}`;

  return (
    <main>
      <JsonLd data={gameJsonLd(game, path)} />
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: `/${params.locale}` }, { name: game.name, path }])} />
      <div className="page-title">
        <span className="eyebrow">{siteConfig.localeNames[params.locale]} · {game.genre}</span>
        <h1>{game.name}</h1>
        <p>{game.description}</p>
      </div>
      <AdSlot placement={adPlacements.gameTop} />
      <section className="game-layout" style={{ marginTop: 18 }}>
        <article className="game-page-main">
          <div className="game-topbar">
            <div>
              <h1>{game.name}</h1>
              <p>{game.playStyle} · {game.difficulty}</p>
            </div>
            <Link href={`/${params.locale}`} className="secondary-cta">Back to hub</Link>
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
            <p>{game.baseTrivia}</p>
          </div>
        </article>
        <aside className="game-sidebar">
          <ProgressionPanel gameName={game.name} awardOnMount />
          <AdSlot placement={adPlacements.gameSide} />
          <LeaderboardTerminal />
        </aside>
      </section>
    </main>
  );
}
