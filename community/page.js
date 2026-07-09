import Link from 'next/link';
import JsonLd from '../../components/JsonLd';
import { communityRooms } from '../../data/community';
import { buildPageMetadata, breadcrumbJsonLd } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'GR8 Clubhouse Community Hub',
  description: 'GR8 Clubhouse is the in-house community foundation for game requests, high scores, bug reports and player feedback.',
  path: '/community'
});


export default function CommunityPage() {
  return (
    <main>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'GR8 Clubhouse', path: '/community' }
      ])} />
      <section className="page-title">
        <span className="eyebrow">GR8 Clubhouse</span>
        <h1>The community layer starts controlled, safe and in-house.</h1>
        <p>
          GR8 Clubhouse is the foundation for our own forum, player feedback, game requests and moderation tools. We are starting with controlled rooms before public posting goes live.
        </p>
        <div className="hero-actions">
          <Link href="/passport/signup" className="cta">Create Passport</Link>
          <Link href="/community-guidelines" className="secondary-cta">Community Guidelines</Link>
        </div>
      </section>

      <section className="passport-feature-grid clubhouse-grid">
        {communityRooms.map((room) => (
          <Link key={room.title} href={room.href} className="clubhouse-room">
            <strong>{room.emoji} {room.title}</strong>
            <p>{room.description}</p>
            <span>Open room</span>
          </Link>
        ))}
      </section>

      <section className="content-panel">
        <div className="section-heading compact">
          <span>Moderation-first community</span>
          <h2>Public posting comes after controls are ready.</h2>
        </div>
        <p>
          V33 adds room boards, starter prompts, report flows and a GR8 Control Room so the community can feel active while moderation remains controlled. The next database phase should add account-only posting, persistent admin roles, spam controls, no private messaging at launch and no image uploads until the safety layer is mature.
        </p>
      </section>

      <section className="content-panel compact-panel">
        <div className="section-heading compact">
          <span>Control Room ready</span>
          <h2>Review feedback before public publishing.</h2>
        </div>
        <p>Open the noindex <Link href="/admin">GR8 Control Room</Link> to review local Clubhouse submissions, support messages and reports before the backend database phase.</p>
      </section>
    </main>
  );
}
