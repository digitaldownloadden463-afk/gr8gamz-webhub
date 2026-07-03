
import Link from 'next/link';
import DatabaseStatusPanel from '../../../components/admin/DatabaseStatusPanel';
import { buildPageMetadata } from '../../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Database Core | GR8 Control Room',
  description: 'V34 PostgreSQL database bridge, persistent player data and safe fallback status for GR8 GAMZ.',
  path: '/admin/database',
  noIndex: true
});

export default function AdminDatabasePage() {
  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">Persistent platform core</span>
        <h1>V34 connects GR8 Passport, Clubhouse and support to a real database bridge.</h1>
        <p>The site keeps working locally until the PostgreSQL URL is added, then the same GR8-owned API routes can persist player activity, saved games, XP, reports and support messages.</p>
        <div className="hero-actions">
          <Link href="/admin" className="secondary-cta">Control Room</Link>
          <Link href="/api/gr8/database/status" className="cta">Database status JSON</Link>
        </div>
      </section>
      <DatabaseStatusPanel />
    </main>
  );
}
