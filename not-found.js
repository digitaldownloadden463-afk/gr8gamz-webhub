import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="content-panel" style={{ marginTop: 60 }}>
      <span className="eyebrow">404</span>
      <h1>Game signal lost.</h1>
      <p>The page you requested is not in the GR8 GAMZ arcade yet.</p>
      <Link href="/" className="cta">Return to hub</Link>
    </main>
  );
}
