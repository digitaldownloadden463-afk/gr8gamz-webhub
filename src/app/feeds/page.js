import Link from 'next/link';
import { buildPageMetadata } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'GR8 GAMZ Feeds and Crawl Endpoints',
  description: 'RSS, JSON feed, grouped sitemaps and IndexNow endpoints for GR8 GAMZ discovery automation.',
  path: '/feeds'
});

const endpoints = [
  { href: '/rss.xml', title: 'RSS feed', desc: 'Fresh update posts in RSS format.' },
  { href: '/feed.json', title: 'JSON feed', desc: 'Fresh update posts in JSON Feed format.' },
  { href: '/sitemap-index.xml', title: 'Sitemap index', desc: 'Grouped sitemap index for easier crawler discovery.' },
  { href: '/sitemap-games.xml', title: 'Games sitemap', desc: 'Playable game URLs grouped together.' },
  { href: '/sitemap-content.xml', title: 'Content sitemap', desc: 'Updates, collections and fresh content pages.' },
  { href: '/sitemap-discovery.xml', title: 'Discovery sitemap', desc: 'Core, category, tag, control and difficulty routes.' },
  { href: '/indexnow-urls.json', title: 'IndexNow URL list', desc: 'Machine-readable URL list for IndexNow submissions.' },
  { href: '/api/indexnow/bulk?scope=content&dryRun=1', title: 'IndexNow dry run', desc: 'Preview the next content submission payload.' }
];

export default function FeedsPage() {
  return (
    <main>
      <div className="page-title">
        <span className="eyebrow">Growth automation</span>
        <h1>Feeds, sitemaps and crawl endpoints.</h1>
        <p>
          These routes help search engines, AI discovery systems and future publishing workflows find fresh GR8 GAMZ content quickly.
        </p>
      </div>

      <section className="collection-grid">
        {endpoints.map((endpoint) => (
          <Link key={endpoint.href} href={endpoint.href} className="collection-card">
            <span>Endpoint</span>
            <h2>{endpoint.title}</h2>
            <p>{endpoint.desc}</p>
            <strong>Open {endpoint.href} →</strong>
          </Link>
        ))}
      </section>
    </main>
  );
}
