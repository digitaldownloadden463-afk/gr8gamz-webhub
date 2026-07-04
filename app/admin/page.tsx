import Link from 'next/link';

export const metadata = {
  title: 'GR8 Control Room | GR8 GAMZ',
  description: 'Private admin routes for GR8 GAMZ backend and account checks.',
  robots: { index: false, follow: false }
};

export default function AdminPage() {
  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">Control Room</span>
        <h1>GR8 operating routes are restored.</h1>
        <p>Use these noindex routes to check backend queues, account sessions and deployment readiness.</p>
        <div className="cta-row">
          <Link href="/admin/backend" className="cta">Backend admin</Link>
          <Link href="/admin/auth" className="secondary-cta">Auth admin</Link>
          <Link href="/backend" className="secondary-cta">Backend status</Link>
          <Link href="/" className="secondary-cta">Site home</Link>
        </div>
      </section>
    </main>
  );
}
