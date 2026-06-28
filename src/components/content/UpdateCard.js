import Link from 'next/link';

export default function UpdateCard({ post }) {
  return (
    <article className="update-card">
      <Link href={`/updates/${post.slug}`} aria-label={`Read ${post.title}`}>
        <div className="update-card-top">
          <span>{post.category}</span>
          <time dateTime={post.date}>{post.date}</time>
        </div>
        <h3>{post.title}</h3>
        <p>{post.description}</p>
        <div className="mini-tag-row">
          {(post.tags || []).slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <strong className="read-more">Read update →</strong>
      </Link>
    </article>
  );
}
