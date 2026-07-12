import Link from 'next/link';
import JsonLd from '../JsonLd';
import PartnerProfileGrid from './PartnerProfileGrid';
import PartnerRetentionPanel from './PartnerRetentionPanel';
import { breadcrumbJsonLd, faqJsonLd } from '../../lib/seo';
import { getPartnerNetworkClusters } from '../../data/partnerGameProfiles';

function partnerItemList(profiles, path) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'GR8 Game Network partner picks',
    url: path,
    numberOfItems: profiles.length,
    itemListElement: profiles.map((profile, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: profile.title,
      url: profile.path
    }))
  };
}

export default function PartnerCollectionPageTemplate({ eyebrow, title, description, path, profiles = [], faqs = [], clusterMode = false }) {
  const clusters = getPartnerNetworkClusters();
  const fallbackFaqs = faqs.length ? faqs : [
    { question: `Are the games on ${title} free to play?`, answer: 'Yes. These pages organise free browser-game discovery under the GR8 GAMZ brand with no app-store installation required.' },
    { question: 'Why use GR8 game profile pages?', answer: 'The profile pages add GR8-branded context, play routes, related picks and internal links instead of leaving games buried inside raw supplier feeds.' }
  ];

  return (
    <main>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'More Free Games', path: '/more-free-games' },
        { name: title, path }
      ])} />
      <JsonLd data={partnerItemList(profiles, path)} />
      <JsonLd data={faqJsonLd(fallbackFaqs)} />

      <div className="page-title page-title-network">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <section className="content-panel network-cluster-panel">
        <div>
          <span className="eyebrow">GR8 discovery system</span>
          <h2>Built to keep players moving.</h2>
          <p>
            This page groups playable partner profiles into a clear GR8-branded route, with Play Now buttons, profile pages, internal links and crawlable structure.
          </p>
        </div>
        <div className="quick-link-grid network-mini-links">
          <Link href="/more-free-games/trending" className="quick-link-card"><strong>Trending</strong><small>Strong network picks</small></Link>
          <Link href="/more-free-games/popular" className="quick-link-card"><strong>Popular</strong><small>Featured profile pages</small></Link>
          <Link href="/more-free-games/new" className="quick-link-card"><strong>New</strong><small>Fresh profile routes</small></Link>
          <Link href="/play-next" className="quick-link-card"><strong>Play Next</strong><small>One more game loop</small></Link>
        </div>
      </section>

      {clusterMode ? (
        <section className="content-panel network-category-index">
          <div className="section-heading compact">
            <span>Network categories</span>
            <h2>Browse more free games by intent.</h2>
          </div>
          <div className="quick-link-grid network-mini-links">
            {clusters.map((cluster) => (
              <Link key={cluster.slug} href={`/more-free-games/categories/${cluster.slug}`} className="quick-link-card">
                <strong>{cluster.title}</strong>
                <small>{cluster.intent}</small>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <PartnerProfileGrid
        profiles={profiles}
        eyebrow="Playable network picks"
        title="Open a GR8-branded profile or play now."
        description="Each card gives the player a clear path into a branded profile page and then into the live game route."
      />

      <PartnerRetentionPanel
        title="Continue your GR8 run."
        description="Recently viewed and saved games appear here once a player starts exploring."
        maxItems={4}
      />

      <section className="content-panel faq-panel">
        <div className="section-heading compact"><span>Player questions</span><h2>{title} FAQs.</h2></div>
        <div className="faq-grid">
          {fallbackFaqs.map((faq) => <article key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></article>)}
        </div>
      </section>
    </main>
  );
}
