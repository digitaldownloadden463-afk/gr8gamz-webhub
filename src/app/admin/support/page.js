import Link from 'next/link';
import AdminControlRoom from '../../../components/admin/AdminControlRoom';
import { buildPageMetadata } from '../../../lib/seo';

export const metadata = buildPageMetadata({
  title: 'Support Inbox | GR8 Control Room',
  description: 'Review in-house support messages and player reports for GR8 GAMZ.',
  path: '/admin/support',
  noIndex: true
});

export default function AdminSupportPage() {
  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">Support and reports</span>
        <h1>Keep player feedback, reports and support inside GR8 GAMZ.</h1>
        <p>This is the support queue foundation before the in-house database and admin roles go live.</p>
        <div className="hero-actions">
          <Link href="/admin" className="secondary-cta">Control Room</Link>
          <Link href="/support" className="cta">Support form</Link>
          <Link href="/report" className="secondary-cta">Report centre</Link>
        </div>
      </section>
      <AdminControlRoom mode="support" />
    </main>
  );
}
