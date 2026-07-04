import Link from 'next/link';

export const metadata = {
  title: 'Report an Issue | GR8 GAMZ',
  description: 'Report broken games, page issues, spam or anything that needs checking on GR8 GAMZ.',
  robots: { index: false, follow: true }
};

export default function ReportPage() {
  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">Safety and quality</span>
        <h1>Report anything that needs checking.</h1>
        <p>This route is restored so Clubhouse and game pages no longer send players to a missing page. The backend report API is also restored in this pack.</p>
        <div className="cta-row">
          <Link href="/community" className="cta">Back to Clubhouse</Link>
          <Link href="/games" className="secondary-cta">Games</Link>
          <Link href="/backend" className="secondary-cta">Backend status</Link>
        </div>
      </section>
      <section style={{ border: '1px solid rgba(255,255,255,.1)', borderRadius: 22, padding: 20, background: 'rgba(255,255,255,.04)' }}>
        <h2>Report API restored</h2>
        <p style={{ color: '#a1a1aa', lineHeight: 1.6 }}>Reports can be posted to <code>/api/gr8/backend/report</code>. The full public form can be reconnected in the next controlled phase.</p>
      </section>
    </main>
  );
}
