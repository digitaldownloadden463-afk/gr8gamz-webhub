import Link from 'next/link';
import GameGrid from '../../components/GameGrid';
import JsonLd from '../../components/JsonLd';
import AiSummaryBox from '../../components/seo/AiSummaryBox';
import { siteConfig } from '../../data/site';
import { filterGames } from '../../lib/games';
import { buildPageMetadata, collectionPageJsonLd, itemListJsonLd } from '../../lib/seo';

const hub = siteConfig.seoHubs.find((item) => item.id === 'quick-games');

export const metadata = buildPageMetadata({
  title: hub.title,
  description: hub.description,
  path: hub.path
});

export default function SeoHubPage() {
  const games = filterGames(hub.filter || {});
  return (
    <main>
      <JsonLd data={itemListJsonLd(games, hub.path)} />
      <JsonLd data={collectionPageJsonLd({ name: hub.title, description: hub.description, path: hub.path, games })} />
      <div className="page-title">
        <span className="eyebrow">{hub.eyebrow}</span>
        <h1>{hub.headline}</h1>
        <p>{hub.description}</p>
      </div>

      <AiSummaryBox
        title={`${hub.title} summary`}
        bullets={[
          `${hub.title} on GR8 GAMZ are free to play in a browser.`,
          'The page is curated as a focused search and player discovery landing page.',
          'Games include mobile-first controls, short sessions and fast replay loops.',
          `Current matching games: ${games.length}.`
        ]}
      />

      <GameGrid games={games} />

      <section className="content-panel seo-detail-panel">
        <span className="eyebrow">Search-focused collection</span>
        <h2>Why this page exists</h2>
        <p>{hub.seoCopy}</p>
        <p>
          Use the game cards above to jump into a playable arcade page, or browse deeper through related game paths.
          GR8 GAMZ keeps collection pages clear, useful and connected to real playable games.
        </p>
        <div className="tag-list large-tags">
          <Link href="/games"><span>All games</span></Link>
          <Link href="/platforms/mobile"><span>Mobile platform</span></Link>
          <Link href="/controls/tap"><span>Tap games</span></Link>
          <Link href="/controls/swipe"><span>Swipe games</span></Link>
        </div>
      </section>
    </main>
  );
}
