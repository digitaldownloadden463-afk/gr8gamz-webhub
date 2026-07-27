import Link from 'next/link';
import GameGrid from '../../components/GameGrid';
import PartnerProfileGrid from '../../components/partner/PartnerProfileGrid';
import JsonLd from '../../components/JsonLd';
import AiSummaryBox from '../../components/seo/AiSummaryBox';
import { getFeaturedGames, getNewGames, getPopularGames } from '../../lib/games';
import { getFeaturedPartnerGameProfiles } from '../../data/partnerGameProfiles';
import { buildPageMetadata, itemListJsonLd, breadcrumbJsonLd } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Hot Picks | Free Online Games Trending on GR8 GAMZ',
  description: 'Play GR8 GAMZ Hot Picks: featured free online games, browser games, mobile games, new games and quick arcade picks for players worldwide.',
  path: '/hot-picks'
});

export default function HotPicksPage() {
  const hot = getPopularGames(9);
  const newest = getNewGames(6);
  const featured = getFeaturedGames(6);
  const partnerProfiles = getFeaturedPartnerGameProfiles(8);
  return (
    <main>
      <JsonLd data={itemListJsonLd([...hot, ...newest], '/hot-picks')} />
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Hot Picks', path: '/hot-picks' }
      ])} />
      <div className="page-title page-title-network">
        <span className="eyebrow">Featured now</span>
        <h1>Hot picks from the GR8 GAMZ free online games network.</h1>
        <p>
          A worldwide discovery page for featured free online games, popular browser games, new mobile games and quick-play routes. As analytics grows, this can become a live trending page.
        </p>
      </div>
      <AiSummaryBox
        title="Hot Picks summary"
        bullets={[
          'Hot Picks gives returning players an obvious place to start.',
          'The page links to real playable games and wider network areas.',
          'Future analytics can power truly trending games once enough data exists.'
        ]}
      />
      <section>
        <div className="section-heading section-heading-primary">
          <div><span>Popular right now</span><h2>Start with these hot picks.</h2></div>
          <Link href="/more-free-games" className="secondary-cta">More free games</Link>
        </div>
        <GameGrid games={hot} />
      </section>
      <section>
        <div className="section-heading">
          <div><span>Fresh drops</span><h2>New games to try next.</h2></div>
          <Link href="/new" className="secondary-cta">All new games</Link>
        </div>
        <GameGrid games={newest} showAd={false} />
      </section>
      <PartnerProfileGrid
        profiles={partnerProfiles}
        eyebrow="Network hot picks"
        title="GR8-branded partner profiles to explore."
        description="These selected game profiles help turn partner-feed games into crawlable, branded GR8 GAMZ discovery assets."
      />
      <section className="content-panel compact-panel">
        <div className="quick-link-grid">
          <Link href="/original-games" className="quick-link-card"><strong>GR8 Originals</strong><small>Brand-owned games</small></Link>
          <Link href="/more-free-games" className="quick-link-card"><strong>More Free Games</strong><small>Partner-powered network</small></Link>
          <Link href="/gaming-deals" className="quick-link-card"><strong>Gaming Deals</strong><small>Revenue hub</small></Link>
        </div>
      </section>
    </main>
  );
}
