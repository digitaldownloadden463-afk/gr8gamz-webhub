import Link from 'next/link';
import AdminControlRoom from '../../../components/admin/AdminControlRoom';
import { buildPageMetadata } from '../../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Moderation Queue | GR8 Control Room',
  description: 'Review GR8 Clubhouse submissions before anything is published publicly.',
  path: '/admin/moderation',
  noIndex: true
});

export default function AdminModerationPage() {
  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">Moderation queue</span>
        <h1>Review Clubhouse submissions before public community launch.</h1>
        <p>Approve, edit, hide or delete local submissions while the GR8-owned database moderation layer is prepared.</p>
        <div className="hero-actions">
          <Link href="/admin" className="secondary-cta">Control Room</Link>
          <Link href="/community" className="cta">Open Clubhouse</Link>
        </div>
      </section>
      <AdminControlRoom mode="moderation" />
    </main>
  );
}
