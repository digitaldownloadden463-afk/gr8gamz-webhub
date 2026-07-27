import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: false }
};

export default function NotFound() {
  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">404</span>
        <h1>That page is not available.</h1>
        <p>Try the game library or GR8 Select instead.</p>
        <div className="cta-row">
          <Link href="/games" className="cta">Browse games</Link>
          <Link href="/gr8-select" className="secondary-cta">GR8 Select</Link>
        </div>
      </section>
    </main>
  );
}
