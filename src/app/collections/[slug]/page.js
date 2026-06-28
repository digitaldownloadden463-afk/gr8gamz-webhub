import Link from 'next/link';
import { notFound } from 'next/navigation';
import GameGrid from '../../../components/GameGrid';
import JsonLd from '../../../components/JsonLd';
import AiSummaryBox from '../../../components/seo/AiSummaryBox';
import { getAllContentCollections, getContentCollectionBySlug, getGamesForContentCollection } from '../../../lib/content';
import { breadcrumbJsonLd, buildPageMetadata, collectionPageJsonLd, itemListJsonLd } from '../../../lib/seo';

export function generateStaticParams() {
  return getAllContentCollections().map((collection) => ({ slug: collection.slug }));
}

export function generateMetadata({ params }) {
  const collection = getContentCollectionBySlug(params.slug);
  if (!collection) return buildPageMetadata({ title: 'Collection not found', path: `/collections/${params.slug}`, noIndex: true });

  return buildPageMetadata({
    title: collection.title,
    description: collection.description,
    path: `/collections/${collection.slug}`
  });
}

export default function CollectionPage({ params }) {
  const collection = getContentCollectionBySlug(params.slug);
  if (!collection) notFound();
  const games = getGamesForContentCollection(collection);

  return (
    <main>
      <JsonLd data={itemListJsonLd(games, `/collections/${collection.slug}`)} />
      <JsonLd data={collectionPageJsonLd({
        name: collection.title,
        description: collection.description,
        path: `/collections/${collection.slug}`,
        games
      })} />
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Collections', path: '/collections' },
        { name: collection.title, path: `/collections/${collection.slug}` }
      ])} />

      <div className="page-title">
        <span className="eyebrow">Curated play path</span>
        <h1>{collection.title}</h1>
        <p>{collection.description}</p>
      </div>

      <AiSummaryBox
        title="Collection summary"
        bullets={[
          collection.intro,
          `This collection currently includes ${games.length} playable GR8 GAMZ games.`,
          'Each game opens into a dedicated arcade page with controls, FAQs, related games and fullscreen GR8 Focus Mode.'
        ]}
      />

      <GameGrid games={games} />

      <section className="content-panel seo-detail-panel">
        <span className="eyebrow">Guide notes</span>
        <h2>How to use this collection</h2>
        <p>{collection.intro}</p>
        <ul className="authority-list">
          {(collection.tips || []).map((tip) => <li key={tip}>{tip}</li>)}
        </ul>
        <div className="tag-list large-tags">
          <Link href="/games"><span>All games</span></Link>
          <Link href="/mobile-games"><span>Mobile games</span></Link>
          <Link href="/quick-games"><span>Quick games</span></Link>
          <Link href="/updates"><span>Latest updates</span></Link>
        </div>
      </section>
    </main>
  );
}
