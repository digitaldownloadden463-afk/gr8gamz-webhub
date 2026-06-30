import Link from 'next/link';
import GameGrid from '../GameGrid';
import PartnerProfileGrid from '../partner/PartnerProfileGrid';
import JsonLd from '../JsonLd';
import AiSummaryBox from './AiSummaryBox';
import { filterGames, getAllGames } from '../../lib/games';
import { getFeaturedPartnerGameProfiles } from '../../data/partnerGameProfiles';
import { collectionPageJsonLd, itemListJsonLd, faqJsonLd } from '../../lib/seo';

export default function SeoHubTemplate({ hub }) {
  const filtered = hub.filter ? filterGames(hub.filter) : getAllGames();
  const games = filtered.length ? filtered.slice(0, hub.limit || 18) : getAllGames().slice(0, hub.limit || 18);
  const partnerProfiles = getFeaturedPartnerGameProfiles(6);
  const faqs = hub.faqs || [
    { question: `Are ${hub.title.toLowerCase()} free on GR8 GAMZ?`, answer: 'Yes. GR8 GAMZ is built around free browser play with no app download required.' },
    { question: 'Can I play on mobile?', answer: 'Yes. The key GR8 GAMZ pages are built for phones, tablets and desktop browsers.' }
  ];

  return (
    <main>
      <JsonLd data={itemListJsonLd(games, hub.path)} />
      <JsonLd data={collectionPageJsonLd({ name: hub.title, description: hub.description, path: hub.path, games })} />
      <JsonLd data={faqJsonLd(faqs)} />

      <div className="page-title page-title-network">
        <span className="eyebrow">{hub.eyebrow}</span>
        <h1>{hub.headline}</h1>
        <p>{hub.description}</p>
      </div>

      <AiSummaryBox
        title={`${hub.title} quick summary`}
        bullets={[
          `${hub.title} is part of the GR8 GAMZ Google content engine.`,
          'The page links to real playable game pages and related discovery routes.',
          'The layout avoids thin content by combining game cards, context, FAQs and internal links.',
          `Current featured games: ${games.length}.`
        ]}
      />

      <section>
        <div className="section-heading section-heading-primary">
          <div>
            <span>Playable picks</span>
            <h2>{hub.gameSectionTitle || 'Start with these games.'}</h2>
          </div>
          <p>{hub.gameSectionCopy || 'Each card links to a real playable GR8 GAMZ arcade page.'}</p>
        </div>
        <GameGrid games={games} />
      </section>

      <PartnerProfileGrid
        profiles={partnerProfiles}
        eyebrow="More game profiles"
        title="GR8-branded game profiles connected to this topic."
        description="Selected partner-powered games are now supported by richer GR8 GAMZ profile pages, branded images and search-friendly context."
      />

      <section className="content-panel seo-detail-panel">
        <span className="eyebrow">Why this page exists</span>
        <h2>{hub.detailTitle || 'Built for players and search engines.'}</h2>
        <p>{hub.seoCopy}</p>
        <p>
          GR8 GAMZ uses focused hub pages to help players find the right game faster and to give search engines a cleaner understanding of the arcade network.
        </p>
        <div className="quick-link-grid network-mini-links">
          <Link href="/original-games" className="quick-link-card"><strong>GR8 Originals</strong><small>Self-hosted original games</small></Link>
          <Link href="/more-free-games" className="quick-link-card"><strong>More Free Games</strong><small>Partner-powered game network</small></Link>
          <Link href="/hot-picks" className="quick-link-card"><strong>Hot Picks</strong><small>Featured now and new this week</small></Link>
          <Link href="/gaming-deals" className="quick-link-card"><strong>Gaming Deals</strong><small>Future revenue pages</small></Link>
        </div>
      </section>

      <section className="content-panel faq-panel">
        <div className="section-heading compact">
          <span>Player questions</span>
          <h2>Quick answers.</h2>
        </div>
        <div className="faq-grid">
          {faqs.map((faq) => (
            <article key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
