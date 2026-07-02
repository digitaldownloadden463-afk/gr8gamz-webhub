import Link from 'next/link';
import JsonLd from '../JsonLd';
import AffiliateButton from './AffiliateButton';
import AffiliateDisclosureBlock from './AffiliateDisclosureBlock';
import { getFeaturedBuyerGuides } from '../../data/affiliateGuides';
import { absoluteUrl, breadcrumbJsonLd, faqJsonLd } from '../../lib/seo';

function buyerGuideJsonLd(guide) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    url: absoluteUrl(guide.path),
    author: {
      '@type': 'Organization',
      name: 'GR8 GAMZ'
    },
    publisher: {
      '@type': 'Organization',
      name: 'GR8 GAMZ'
    },
    image: absoluteUrl('/og/gr8gamz-og.png'),
    keywords: [guide.primaryKeyword, ...(guide.secondaryKeywords || [])].join(', '),
    mainEntityOfPage: absoluteUrl(guide.path)
  };
}

function itemListJsonLd(guide) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${guide.title} shortlist`,
    url: absoluteUrl(guide.path),
    numberOfItems: guide.productSlots.length,
    itemListElement: guide.productSlots.map((slot, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: slot.type,
      description: slot.angle
    }))
  };
}

export default function BuyerGuideTemplate({ guide }) {
  const relatedGuides = getFeaturedBuyerGuides(10).filter((item) => item.slug !== guide.slug).slice(0, 4);

  return (
    <main>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Gaming Deals', path: '/gaming-deals' },
        { name: guide.title, path: guide.path }
      ])} />
      <JsonLd data={buyerGuideJsonLd(guide)} />
      <JsonLd data={itemListJsonLd(guide)} />
      <JsonLd data={faqJsonLd(guide.faqs || [])} />

      <section className="buyer-hero">
        <div>
          <span className="eyebrow">GR8 Gaming Deals</span>
          <h1>{guide.title}</h1>
          <p>{guide.description}</p>
          <div className="buyer-keywords">
            {[guide.primaryKeyword, ...(guide.secondaryKeywords || []).slice(0, 4)].map((keyword) => (
              <span key={keyword}>{keyword}</span>
            ))}
          </div>
        </div>
        <AffiliateDisclosureBlock />
      </section>

      <section className="content-panel buyer-intro-panel">
        <span className="eyebrow">Buyer intent</span>
        <h2>{guide.intent}</h2>
        <p>{guide.intro}</p>
        <div className="quick-link-grid network-mini-links">
          {guide.relatedGamePaths.map((path) => (
            <Link href={path} key={path} className="quick-link-card">
              <strong>{path.replace(/\//g, ' ').trim() || 'GR8 GAMZ'}</strong>
              <small>Related play path</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="content-panel buyer-shortlist-panel">
        <div className="section-heading compact">
          <span>Shortlist slots</span>
          <h2>What to compare before buying.</h2>
          <p>These are editorial buying slots prepared for approved affiliate partners. They avoid fake reviews and can be connected to live merchant links once accounts are approved.</p>
        </div>
        <div className="buyer-product-grid">
          {guide.productSlots.map((slot) => (
            <article className="buyer-product-card" key={slot.type}>
              <span className="buyer-product-type">{slot.type}</span>
              <h3>{slot.bestFor}</h3>
              <p>{slot.angle}</p>
              <AffiliateButton guide={guide.slug} merchant={slot.type} />
            </article>
          ))}
        </div>
      </section>

      <section className="content-panel buyer-table-panel">
        <div className="section-heading compact">
          <span>Comparison checklist</span>
          <h2>Key buying checks for {guide.title.toLowerCase()}.</h2>
        </div>
        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Check</th>
                <th>Why it matters</th>
              </tr>
            </thead>
            <tbody>
              {guide.buyingCriteria.map((criterion) => (
                <tr key={criterion}>
                  <td>{criterion}</td>
                  <td>Use this as a quick filter before clicking through to a retailer or affiliate partner.</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="content-panel buyer-category-panel">
        <span className="eyebrow">Useful categories</span>
        <h2>Best categories to compare.</h2>
        <div className="tag-list large-tags">
          {guide.categories.map((category) => <span key={category}>{category}</span>)}
        </div>
      </section>

      <section className="content-panel faq-panel">
        <div className="section-heading compact">
          <span>Buyer questions</span>
          <h2>{guide.title} FAQs.</h2>
        </div>
        <div className="faq-grid">
          {(guide.faqs || []).map((faq) => (
            <article key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-panel related-guides-panel">
        <div className="section-heading compact">
          <span>More GR8 buyer guides</span>
          <h2>Build the revenue path carefully.</h2>
        </div>
        <div className="quick-link-grid network-mini-links">
          {relatedGuides.map((item) => (
            <Link href={item.path} key={item.slug} className="quick-link-card">
              <strong>{item.title}</strong>
              <small>{item.primaryKeyword}</small>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
