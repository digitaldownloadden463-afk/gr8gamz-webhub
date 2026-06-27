import AdSlot from '../../components/ads/AdSlot';
import { adPlacements } from '../../lib/ads';
import { buildPageMetadata } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Advertise With GR8 GAMZ',
  description: 'Brand-safe gaming ad placements, sponsored game slots and direct campaign inventory for GR8 GAMZ.',
  path: '/advertise'
});

export default function AdvertisePage() {
  return (
    <main>
      <div className="page-title">
        <span className="eyebrow">Clickable ad monetisation</span>
        <h1>Premium ad inventory for gaming audiences.</h1>
        <p>
          GR8 GAMZ is prepared for direct sponsorship, affiliate placements and future ad-network integration with clear labelling and safe spacing around gameplay.
        </p>
      </div>

      <div className="advertise-grid">
        <article className="advertise-card">
          <h2>Homepage takeover</h2>
          <p>Leaderboard banners, in-feed placements and sponsored game cards across the discovery hub.</p>
        </article>
        <article className="advertise-card">
          <h2>Game-page inventory</h2>
          <p>Above-game, sidebar and post-game ads designed away from active game controls.</p>
        </article>
        <article className="advertise-card">
          <h2>Partner campaigns</h2>
          <p>Slots for gaming brands, accessories, newsletters, launches, affiliates and direct-sold campaigns.</p>
        </article>
      </div>

      <section className="content-panel">
        <h2>Example placements</h2>
        <p>
          These are house-ad placeholders. Replace them with Google AdSense, Google Ad Manager, affiliate creative or direct-sold banner code once the account and publisher IDs are ready.
        </p>
        <AdSlot placement={adPlacements.homeTop} />
      </section>
    </main>
  );
}
