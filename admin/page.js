import Link from 'next/link';
import AdminControlRoom from '../../components/admin/AdminControlRoom';
import JsonLd from '../../components/JsonLd';
import { buildPageMetadata, breadcrumbJsonLd } from '../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'GR8 Control Room',
  description: 'In-house admin control room for GR8 GAMZ moderation, reports, support and community safety workflows.',
  path: '/admin',
  noIndex: true
});

export default function AdminPage() {
  return (
    <main>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'GR8 Control Room', path: '/admin' }
      ])} />
      <section className="page-title">
        <span className="eyebrow">Private operating layer</span>
        <h1>GR8 Control Room keeps the community active, safe and in-house.</h1>
        <p>This noindex admin foundation reviews local Clubhouse notes, reports and support messages while the V34 database bridge prepares persistent player, support and moderation data.</p>
        <div className="hero-actions">
          <Link href="/admin/moderation" className="cta">Moderation queue</Link>
          <Link href="/admin/support" className="secondary-cta">Support inbox</Link>
          <Link href="/admin/database" className="secondary-cta">Database core</Link>
          <Link href="/community" className="secondary-cta">Clubhouse</Link>
        </div>
      </section>
      <AdminControlRoom />
    </main>
  );
}
