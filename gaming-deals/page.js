import Link from 'next/link';
import JsonLd from '../../components/JsonLd';
import AffiliateDisclosureBlock from '../../components/affiliate/AffiliateDisclosureBlock';
import { getBuyerGuides, getFeaturedBuyerGuides } from '../../data/affiliateGuides';
import { breadcrumbJsonLd, buildPageMetadata, faqJsonLd } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Gaming Deals, Accessories and Buyer Guides',
  description: 'Gaming accessory buyer guides for controllers, headsets, mobile gaming gear, gifts and browser-game setup upgrades.',
  path: '/gaming-deals'
});

const faqs = [
  {
    question: 'Does GR8 GAMZ use affiliate links?',
    answer: 'Some gaming deal pages may include affiliate links or sponsored links. GR8 GAMZ labels commercial sections clearly and explains this in the affiliate disclosure.'
  },
  {
    question: 'Are the guides only for expensive gaming products?',
    answer: 'No. GR8 GAMZ covers budget, mid-range and premium accessories so players can find useful setup ideas at different price points.'
  },
  {
    question: 'Do I need gaming accessories to play GR8 GAMZ?',
    answer: 'No. GR8 GAMZ games are free browser games. Accessories are optional upgrades for comfort, control and longer sessions.'
  }
];

export default function GamingDealsPage() {
  const featured = getFeaturedBuyerGuides(6);
  const allGuides = getBuyerGuides();

  return (
    <main>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Gaming Deals', path: '/gaming-deals' }
      ])} />
      <JsonLd data={faqJsonLd(faqs)} />

      <section className="buyer-hero gaming-deals-hero">
        <div>
          <span className="eyebrow">GR8 Gaming Deals</span>
          <h1>Gaming deals, accessories and setup guides for players.</h1>
          <p>
            GR8 GAMZ is building a trusted gaming deals hub for players who want better controls, comfort, audio and setup upgrades while enjoying free online games.
          </p>
          <div className="hero-actions compact-actions">
            <Link href="/best-gaming-accessories" className="cta">Best Gaming Accessories</Link>
            <Link href="/best-mobile-game-controllers" className="secondary-cta">Mobile Controllers</Link>
            <Link href="/affiliate-disclosure" className="secondary-cta">Affiliate Disclosure</Link>
          </div>
        </div>
        <AffiliateDisclosureBlock />
      </section>

      <section className="content-panel buyer-intro-panel">
        <span className="eyebrow">Revenue-ready, player-first</span>
        <h2>Built for useful recommendations, not spammy product dumping.</h2>
        <p>
          These guides are designed to support affiliate applications and future product links while staying useful for players. Each guide explains what to compare before buying, who the accessory is for, and how it connects to browser, mobile or desktop play.
        </p>
        <div className="quick-link-grid network-mini-links">
          <Link href="/games" className="quick-link-card"><strong>Play games first</strong><small>Keep revenue after trust</small></Link>
          <Link href="/mobile-games" className="quick-link-card"><strong>Mobile game gear</strong><small>Controllers, grips and stands</small></Link>
          <Link href="/action-games" className="quick-link-card"><strong>Action setup</strong><small>Headsets, mice and controls</small></Link>
          <Link href="/partners" className="quick-link-card"><strong>Partner with GR8</strong><small>Brand and affiliate page</small></Link>
        </div>
      </section>

      <section className="content-panel">
        <div className="section-heading compact">
          <span>Featured buyer guides</span>
          <h2>Start with the highest-fit gaming revenue pages.</h2>
          <p>These are the strongest pages for affiliate applications, product-card testing and search visibility.</p>
        </div>
        <div className="buyer-guide-grid">
          {featured.map((guide) => (
            <Link href={guide.path} className="buyer-guide-card" key={guide.slug}>
              <span>{guide.primaryKeyword}</span>
              <h3>{guide.title}</h3>
              <p>{guide.description}</p>
              <strong>Open guide →</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="content-panel">
        <div className="section-heading compact">
          <span>All revenue guides</span>
          <h2>Gaming accessory and gift pages.</h2>
        </div>
        <div className="quick-link-grid network-mini-links">
          {allGuides.map((guide) => (
            <Link href={guide.path} key={guide.slug} className="quick-link-card">
              <strong>{guide.title}</strong>
              <small>{guide.primaryKeyword}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="content-panel faq-panel">
        <div className="section-heading compact">
          <span>Commercial transparency</span>
          <h2>Gaming deals FAQs.</h2>
        </div>
        <div className="faq-grid">
          {faqs.map((faq) => <article key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></article>)}
        </div>
      </section>
    </main>
  );
}
