import UpdateCard from './UpdateCard';

export default function ContentRail({ posts = [], eyebrow = 'Latest updates', title = 'Fresh from GR8 GAMZ.' }) {
  if (!posts.length) return null;

  return (
    <section className="content-rail">
      <div className="section-heading">
        <div>
          <span>{eyebrow}</span>
          <h2>{title}</h2>
        </div>
      </div>
      <div className="update-grid">
        {posts.map((post) => <UpdateCard key={post.slug} post={post} />)}
      </div>
    </section>
  );
}
