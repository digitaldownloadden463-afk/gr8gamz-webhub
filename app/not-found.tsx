import Link from 'next/link';

export default function NotFound() {
  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">Page not found</span>
        <h1>This GR8 GAMZ page is not active yet.</h1>
        <p>The main arcade routes are ready. Use the buttons below to return to a working section.</p>
        <div className="cta-row">
          <Link href="/" className="cta">Home</Link>
          <Link href="/games" className="secondary-cta">Games</Link>
          <Link href="/community" className="secondary-cta">Clubhouse</Link>
          <Link href="/auth" className="secondary-cta">GR8 Passport</Link>
        </div>
      </section>
    </main>
  );
}
