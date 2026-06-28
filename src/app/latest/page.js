import Link from 'next/link';
import JsonLd from '../../components/JsonLd';
import { getFreshChangedPages } from '../../lib/crawl';
import { buildPageMetadata, collectionPageJsonLd } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Latest Changed Pages and Fresh GR8 GAMZ Content',
  description: 'A fresh crawl hub showing recently changed GR8 GAMZ pages, updates, collections and important game routes.',
  path: '/latest'
});

export default function LatestPage() {
  const pages = getFreshChangedPages(50);

  return (
    <main>
      <JsonLd data={collectionPageJsonLd({
        name: 'Latest GR8 GAMZ changed pages',
        description: 'Fresh changed pages, update posts, collections and important game routes.',
        path: '/latest',
        games: []
      })} />
      <div className="page-title">
        <span className="eyebrow">Fresh crawl map</span>
        <h1>Latest changed pages.</h1>
        <p>
          A clear discovery hub for players, search engines and AI systems to find the newest and most important GR8 GAMZ pages.
        </p>
      </div>

      <section className="content-panel">
        <div className="fresh-table">
          {pages.map((page) => (
            <Link href={page.path} key={page.path} className="fresh-row">
              <span>{page.type}</span>
              <strong>{page.title}</strong>
              <small>{page.reason}</small>
              <time dateTime={page.changed}>{page.changed}</time>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
