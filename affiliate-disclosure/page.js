import Link from 'next/link';
import JsonLd from '../../components/JsonLd';
import AffiliateDisclosureBlock from '../../components/affiliate/AffiliateDisclosureBlock';
import { affiliateDisclosure } from '../../data/affiliateGuides';
import { breadcrumbJsonLd, buildPageMetadata } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Affiliate Disclosure',
  description: 'How GR8 GAMZ handles affiliate links, sponsored links and commercial recommendations.',
  path: '/affiliate-disclosure'
});

export default function AffiliateDisclosurePage() {
  return (
    <main>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Affiliate Disclosure', path: '/affiliate-disclosure' }
      ])} />

      <div className="page-title">
        <span className="eyebrow">Commercial transparency</span>
        <h1>Affiliate disclosure.</h1>
        <p>{affiliateDisclosure.long}</p>
      </div>

      <section className="content-panel">
        <h2>How affiliate links work</h2>
        <p>
          Some GR8 GAMZ pages may include links to retailers, affiliate networks or brand partners. These links may use tracking so a retailer can credit GR8 GAMZ if a visitor makes a qualifying purchase.
        </p>
        <p>
          Affiliate links do not change the price paid by the visitor. GR8 GAMZ keeps affiliate sections labelled and keeps gameplay pages focused on play first.
        </p>
      </section>

      <section className="content-panel">
        <h2>How we keep recommendations useful</h2>
        <ul className="authority-list">
          <li>We avoid fake reviews and do not claim hands-on testing unless a product has actually been tested.</li>
          <li>We focus on practical buying criteria such as compatibility, comfort, value and device support.</li>
          <li>Commercial links should use safe outbound handling such as sponsored/nofollow attributes.</li>
          <li>Game pages should remain playable and not be overwhelmed by product promotions.</li>
        </ul>
      </section>

      <AffiliateDisclosureBlock />

      <section className="content-panel">
        <Link href="/gaming-deals" className="cta">Browse Gaming Deals</Link>
        <Link href="/contact" className="secondary-cta" style={{ marginLeft: 10 }}>Contact GR8 GAMZ</Link>
      </section>
    </main>
  );
}
