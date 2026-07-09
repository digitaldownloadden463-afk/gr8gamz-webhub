import Link from 'next/link';
import { notFound } from 'next/navigation';
import GameGrid from '../../../components/GameGrid';
import JsonLd from '../../../components/JsonLd';
import AiSummaryBox from '../../../components/seo/AiSummaryBox';
import { getAllUpdatePosts, getRelatedGamesForPost, getUpdatePostBySlug } from '../../../lib/content';
import { articleJsonLd, breadcrumbJsonLd, buildPageMetadata, faqJsonLd } from '../../../lib/seo';

export function generateStaticParams() {
  return getAllUpdatePosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }) {
  const post = getUpdatePostBySlug(params.slug);
  if (!post) return buildPageMetadata({ title: 'Update not found', path: `/updates/${params.slug}`, noIndex: true });

  return buildPageMetadata({
    title: post.title,
    description: post.description,
    path: `/updates/${post.slug}`
  });
}

export default function UpdatePostPage({ params }) {
  const post = getUpdatePostBySlug(params.slug);
  if (!post) notFound();
  const relatedGames = getRelatedGamesForPost(post);

  return (
    <main>
      <JsonLd data={articleJsonLd(post, `/updates/${post.slug}`)} />
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Updates', path: '/updates' },
        { name: post.title, path: `/updates/${post.slug}` }
      ])} />
      <JsonLd data={faqJsonLd(post.faqs || [])} />

      <article className="article-shell">
        <div className="page-title article-title">
          <span className="eyebrow">{post.category} · {post.date}</span>
          <h1>{post.title}</h1>
          <p>{post.description}</p>
        </div>

        <AiSummaryBox
          title="Quick page summary"
          bullets={post.summary || []}
        />

        <div className="article-body">
          {(post.sections || []).map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </section>
          ))}

          {post.faqs?.length ? (
            <section>
              <h2>Quick answers</h2>
              <div className="faq-stack">
                {post.faqs.map((faq) => (
                  <details key={faq.question} open>
                    <summary>{faq.question}</summary>
                    <p>{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <div className="tag-list large-tags">
          {(post.tags || []).map((tag) => <Link key={tag} href={`/tags/${tag}`}><span>#{tag}</span></Link>)}
        </div>
      </article>

      {relatedGames.length ? (
        <section>
          <div className="section-heading">
            <div>
              <span>Related play path</span>
              <h2>Games mentioned in this update.</h2>
            </div>
          </div>
          <GameGrid games={relatedGames} showAd={false} />
        </section>
      ) : null}

      <section className="content-panel">
        <Link href="/updates" className="secondary-cta">← Back to all updates</Link>
        <Link href="/collections" className="cta" style={{ marginLeft: 10 }}>Browse collections</Link>
      </section>
    </main>
  );
}
