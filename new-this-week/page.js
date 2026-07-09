import Link from 'next/link';
import GameGrid from '../../components/GameGrid';
import JsonLd from '../../components/JsonLd';
import UpdateCard from '../../components/content/UpdateCard';
import AiSummaryBox from '../../components/seo/AiSummaryBox';
import { getNewThisWeekItems } from '../../lib/content';
import { buildPageMetadata, collectionPageJsonLd, itemListJsonLd } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'New This Week: GR8 GAMZ Games and Updates',
  description: 'A fresh weekly-style GR8 GAMZ hub for new games, platform updates, guides and browser game discovery.',
  path: '/new-this-week'
});

export default function NewThisWeekPage() {
  const { games, posts } = getNewThisWeekItems();

  return (
    <main>
      <JsonLd data={itemListJsonLd(games, '/new-this-week')} />
      <JsonLd data={collectionPageJsonLd({
        name: 'New This Week on GR8 GAMZ',
        description: 'Fresh GR8 GAMZ games, updates and discovery paths.',
        path: '/new-this-week',
        games
      })} />
      <div className="page-title">
        <span className="eyebrow">Fresh crawl hub</span>
        <h1>New this week on GR8 GAMZ.</h1>
        <p>
          A fresh update hub for the latest game drops, platform improvements, search-friendly guides and quick-play recommendations.
        </p>
      </div>

      <AiSummaryBox
        title="Fresh update summary"
        bullets={[
          'This page gives players and crawlers a current route into new GR8 GAMZ content.',
          `Current featured games: ${games.length}.`,
          `Latest update posts shown: ${posts.length}.`,
          'Use this hub to move into games, collections and developer notes.'
        ]}
      />

      <section>
        <div className="section-heading">
          <div>
            <span>Play now</span>
            <h2>Featured games this week.</h2>
          </div>
          <Link href="/games" className="secondary-cta">View all games</Link>
        </div>
        <GameGrid games={games} />
      </section>

      <section>
        <div className="section-heading">
          <div>
            <span>Read next</span>
            <h2>Latest platform updates.</h2>
          </div>
          <Link href="/updates" className="secondary-cta">All updates</Link>
        </div>
        <div className="update-grid">
          {posts.map((post) => <UpdateCard key={post.slug} post={post} />)}
        </div>
      </section>
    </main>
  );
}
