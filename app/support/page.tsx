import Link from 'next/link';

export const metadata = {
  title: 'Support | GR8 GAMZ',
  description: 'GR8 GAMZ support route for player and site issues.',
  robots: { index: false, follow: true }
};

export default function SupportPage() {
  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">Support</span>
        <h1>Need help with GR8 GAMZ?</h1>
        <p>Use the report route for broken games, page issues or anything that needs checking.</p>
        <div className="cta-row">
          <Link href="/report" className="cta">Report issue</Link>
          <Link href="/games" className="secondary-cta">Back to games</Link>
        </div>
      </section>
    </main>
  );
}
