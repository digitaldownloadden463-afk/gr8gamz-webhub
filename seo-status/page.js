import Link from 'next/link';
import { buildPageMetadata } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'GR8 GAMZ SEO Status and Search Setup Checklist',
  description: 'A practical SEO status hub for GR8 GAMZ covering sitemap, robots, feeds, IndexNow, Google and Bing discovery.',
  path: '/seo-status'
});

const checks = [
  ['Domain live', 'https://www.gr8gamz.com is the public canonical domain.'],
  ['Google verified', 'Google Search Console verification has been completed.'],
  ['Bing indexing active', 'Initial URLs have been submitted in Bing Webmaster Tools.'],
  ['Sitemap live', '/sitemap.xml and grouped sitemaps are available.'],
  ['Robots live', '/robots.txt points crawlers to the sitemap.'],
  ['AI summary live', '/llms.txt describes the platform and important routes.'],
  ['RSS + JSON feed live', '/rss.xml and /feed.json expose update posts.'],
  ['IndexNow ready', 'Root key file and IndexNow endpoints are available.'],
  ['Fresh content hub live', '/updates, /collections, /new-this-week and /latest are crawlable.']
];

export default function SeoStatusPage() {
  return (
    <main>
      <div className="page-title">
        <span className="eyebrow">Search status</span>
        <h1>SEO and discovery status.</h1>
        <p>
          A simple operational checklist for GR8 GAMZ search visibility, indexing, feeds and content freshness.
        </p>
      </div>

      <section className="content-panel">
        <div className="status-grid">
          {checks.map(([title, desc]) => (
            <div className="status-card" key={title}>
              <strong>✅ {title}</strong>
              <span>{desc}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="content-panel">
        <div className="section-heading compact">
          <span>Useful links</span>
          <h2>Search engine submission paths.</h2>
        </div>
        <div className="tag-list large-tags">
          <Link href="/sitemap.xml"><span>Main sitemap</span></Link>
          <Link href="/sitemap-index.xml"><span>Sitemap index</span></Link>
          <Link href="/rss.xml"><span>RSS feed</span></Link>
          <Link href="/feed.json"><span>JSON feed</span></Link>
          <Link href="/indexnow-urls.json"><span>IndexNow URLs</span></Link>
          <Link href="/latest"><span>Latest changed pages</span></Link>
        </div>
      </section>
    </main>
  );
}
