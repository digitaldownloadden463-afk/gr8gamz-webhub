import Link from 'next/link';
import JsonLd from '../../components/JsonLd';
import UpdateCard from '../../components/content/UpdateCard';
import { getAllUpdatePosts, getAllContentCollections } from '../../lib/content';
import { blogJsonLd, buildPageMetadata } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'GR8 GAMZ Updates, Game Guides and Developer Notes',
  description: 'Fresh GR8 GAMZ updates, game guides, developer notes, search-friendly collections and platform news.',
  path: '/updates'
});

export default function UpdatesPage() {
  const posts = getAllUpdatePosts();
  const collections = getAllContentCollections();

  return (
    <main>
      <JsonLd data={blogJsonLd(posts, '/updates')} />
      <div className="page-title">
        <span className="eyebrow">Authority engine</span>
        <h1>GR8 GAMZ updates, guides and developer notes.</h1>
        <p>
          Fresh crawlable content for players, search engines and AI discovery systems. This hub explains what is new, what to play next and how the platform is evolving.
        </p>
      </div>

      <section className="update-grid">
        {posts.map((post) => <UpdateCard key={post.slug} post={post} />)}
      </section>

      <section className="content-panel">
        <div className="section-heading compact">
          <span>Curated collections</span>
          <h2>Browse search-focused game guides.</h2>
        </div>
        <div className="quick-link-grid">
          {collections.map((collection) => (
            <Link key={collection.slug} href={`/collections/${collection.slug}`} className="quick-link-card">
              <strong>{collection.title}</strong>
              <small>{collection.description}</small>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
