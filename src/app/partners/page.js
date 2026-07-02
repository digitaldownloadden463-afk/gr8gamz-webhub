import Link from 'next/link';
import JsonLd from '../../components/JsonLd';
import { affiliateNetworks, getFeaturedBuyerGuides } from '../../data/affiliateGuides';
import { breadcrumbJsonLd, buildPageMetadata } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Partner With GR8 GAMZ',
  description: 'Affiliate, retail and sponsorship partner information for GR8 GAMZ, a free online gaming network.',
  path: '/partners'
});

export default function PartnersPage() {
  const guides = getFeaturedBuyerGuides(6);
  return (
    <main>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Partner With GR8 GAMZ', path: '/partners' }
      ])} />

      <div className="page-title">
        <span className="eyebrow">Affiliate and brand partnerships</span>
        <h1>GR8 GAMZ is ready for gaming brand partnerships.</h1>
        <p>
          GR8 GAMZ is a free browser gaming network with original games, partner-powered game discovery, mobile-first gameplay and gaming buyer guides for accessories, gifts and setup upgrades.
        </p>
      </div>

      <section className="content-panel media-kit-panel">
        <span className="eyebrow">Publisher positioning</span>
        <h2>Why brands fit this audience.</h2>
        <div className="media-kit-grid">
          <article><strong>Audience intent</strong><span>Players visit to play free browser games and discover more games.</span></article>
          <article><strong>Commercial fit</strong><span>Controllers, headsets, mice, keyboards, mobile accessories and gamer gifts.</span></article>
          <article><strong>Brand safety</strong><span>Clear disclosures, labelled ad zones and gameplay-first layouts.</span></article>
          <article><strong>Growth channels</strong><span>Search Console, sitemaps, IndexNow, partner profiles and global keyword pages.</span></article>
        </div>
      </section>

      <section className="content-panel">
        <div className="section-heading compact">
          <span>Affiliate targets</span>
          <h2>Best-fit programme categories.</h2>
        </div>
        <div className="buyer-product-grid">
          {affiliateNetworks.map((network) => (
            <article className="buyer-product-card" key={network.name}>
              <span className="buyer-product-type">{network.status}</span>
              <h3>{network.name}</h3>
              <p>{network.fit}</p>
              <small>{network.applicationNote}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="content-panel">
        <div className="section-heading compact">
          <span>Application proof pages</span>
          <h2>Buyer guides ready for affiliate review.</h2>
        </div>
        <div className="quick-link-grid network-mini-links">
          {guides.map((guide) => (
            <Link href={guide.path} className="quick-link-card" key={guide.slug}>
              <strong>{guide.title}</strong>
              <small>{guide.primaryKeyword}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="content-panel">
        <Link href="/advertise" className="cta">Advertise with GR8 GAMZ</Link>
        <Link href="/contact" className="secondary-cta" style={{ marginLeft: 10 }}>Contact</Link>
      </section>
    </main>
  );
}
