import Link from 'next/link';
import JsonLd from '../../components/JsonLd';
import { getAllContentCollections, getGamesForContentCollection } from '../../lib/content';
import { buildPageMetadata, collectionPageJsonLd } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Curated Free Browser Game Collections',
  description: 'Browse curated GR8 GAMZ game collections for mobile games, quick games, arcade games, neon games and selection-lab games.',
  path: '/collections'
});

export default function CollectionsPage() {
  const collections = getAllContentCollections();

  return (
    <main>
      <JsonLd data={collectionPageJsonLd({
        name: 'GR8 GAMZ Collections',
        description: 'Curated browser game collections and search-friendly game guides.',
        path: '/collections',
        games: []
      })} />

      <div className="page-title">
        <span className="eyebrow">Collection engine</span>
        <h1>Curated GR8 GAMZ game collections.</h1>
        <p>
          Search-focused and player-friendly collections that help people find the right game by mood, device, control type and replay style.
        </p>
      </div>

      <div className="collection-grid">
        {collections.map((collection) => {
          const games = getGamesForContentCollection(collection);
          return (
            <Link href={`/collections/${collection.slug}`} className="collection-card" key={collection.slug}>
              <span>{games.length} games</span>
              <h2>{collection.title}</h2>
              <p>{collection.description}</p>
              <strong>Open collection →</strong>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
