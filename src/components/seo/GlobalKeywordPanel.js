import Link from 'next/link';
import { globalKeywordClusters, globalSearchPriorityPages } from '../../data/globalSeo';

export default function GlobalKeywordPanel({ active = [], compact = false }) {
  const clusters = active.length
    ? globalKeywordClusters.filter((cluster) => active.includes(cluster.id))
    : globalKeywordClusters.slice(0, compact ? 3 : 6);

  return (
    <section className={`content-panel global-keyword-panel ${compact ? 'compact-global-keywords' : ''}`}>
      <div className="section-heading compact">
        <span>Worldwide game discovery</span>
        <h2>Built for global free-game searches.</h2>
        <p>
          GR8 GAMZ is positioned for players worldwide: instant free online games, browser games, mobile games and no-download game discovery.
        </p>
      </div>
      <div className="global-keyword-grid">
        {clusters.map((cluster) => (
          <article key={cluster.id} className="global-keyword-card">
            <strong>{cluster.label}</strong>
            <small>{cluster.intent}</small>
            <p>{cluster.phrases.join(' · ')}</p>
          </article>
        ))}
      </div>
      {!compact ? (
        <div className="global-priority-links">
          {globalSearchPriorityPages.slice(0, 6).map((page) => (
            <Link href={page.path} key={page.path} className="soft-link">
              {page.title}
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}
