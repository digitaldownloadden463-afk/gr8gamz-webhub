'use client';

import Link from 'next/link';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main>
      <section className="content-panel">
        <span className="eyebrow">Error</span>
        <h1>Something went wrong.</h1>
        <p>The page could not load safely. Try again or return to the game library.</p>
        <div className="cta-row">
          <button type="button" className="cta-button" onClick={() => reset()}>Try again</button>
          <Link href="/games" className="secondary-cta">Browse games</Link>
        </div>
      </section>
    </main>
  );
}
