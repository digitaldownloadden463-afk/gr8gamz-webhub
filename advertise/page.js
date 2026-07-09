import Link from 'next/link';
import AdSlot from '../../components/ads/AdSlot';
import { adPlacements } from '../../lib/ads';
import { buildPageMetadata } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Advertise With GR8 GAMZ',
  description: 'Brand-safe gaming ad placements, sponsored game slots, affiliate campaigns and direct campaign inventory for GR8 GAMZ.',
  path: '/advertise'
});

export default function AdvertisePage() {
  return (
    <main>
      <div className="page-title">
        <span className="eyebrow">Gaming audience partnerships</span>
        <h1>Advertise with a free online gaming network.</h1>
        <p>
          GR8 GAMZ supports direct sponsorship, affiliate placements, gaming buyer guides and future ad-network integration with clear labelling and safe spacing around gameplay.
        </p>
        <div className="hero-actions compact-actions">
          <Link href="/partners" className="cta">Partner media page</Link>
          <Link href="/gaming-deals" className="secondary-cta">Gaming Deals</Link>
          <Link href="/contact" className="secondary-cta">Contact</Link>
        </div>
      </div>

      <div className="advertise-grid">
        <article className="advertise-card">
          <h2>Homepage and discovery placements</h2>
          <p>Brand panels, in-feed placements and sponsored game cards across the discovery hub.</p>
        </article>
        <article className="advertise-card">
          <h2>Game-page inventory</h2>
          <p>Above-game, sidebar and post-game ad areas designed away from active game controls.</p>
        </article>
        <article className="advertise-card">
          <h2>Affiliate buyer guides</h2>
          <p>Controller, headset, accessory and gamer-gift guide pages built for clearly labelled commercial content.</p>
        </article>
      </div>

      <section className="content-panel media-kit-panel">
        <span className="eyebrow">Brand-safe monetisation</span>
        <h2>Revenue placements should never block gameplay.</h2>
        <p>
          The GR8 GAMZ monetisation model puts gameplay first, then guides users toward relevant accessories, gifts and partner offers after trust is built.
        </p>
        <div className="media-kit-grid">
          <article><strong>Gaming gear</strong><span>Controllers, headsets, keyboards, mice and mobile accessories.</span></article>
          <article><strong>Player intent</strong><span>Free online games, no-download games, mobile games and quick game sessions.</span></article>
          <article><strong>Disclosure</strong><span>Affiliate and sponsored content is clearly labelled.</span></article>
          <article><strong>Tracking</strong><span>Affiliate clicks can push safe analytics events through the data layer.</span></article>
        </div>
      </section>

      <section className="content-panel">
        <h2>Example placement</h2>
        <p>
          This is a house-ad placeholder. Replace it with approved ad network creative, affiliate creative or direct-sold banner code once the campaign is ready.
        </p>
        <AdSlot placement={adPlacements.homeTop} />
      </section>
    </main>
  );
}
