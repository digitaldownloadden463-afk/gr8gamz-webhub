'use client';

import Link from 'next/link';

/**
 * Next.js error boundary for page-level errors.
 * Displays user-friendly error message and recovery options.
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main style={{ width: 'min(1200px, calc(100% - 32px))', margin: '0 auto', padding: '56px 0' }}>
      <section
        style={{
          padding: '40px',
          borderRadius: 24,
          background: 'rgba(255, 47, 125, 0.1)',
          border: '1px solid rgba(255, 47, 125, 0.2)',
          textAlign: 'center',
        }}
      >
        <h1 style={{ margin: '0 0 16px', fontSize: '2.2rem' }}>Something went wrong</h1>
        <p style={{ color: '#a1a1aa', marginTop: 0, marginBottom: '24px', maxWidth: 600 }}>
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => reset()}
            style={{
              background: '#35ff8d',
              color: '#041008',
              border: 'none',
              borderRadius: 999,
              padding: '11px 18px',
              fontWeight: 900,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
          <Link
            href="/"
            style={{
              border: '1px solid rgba(255,255,255,.14)',
              color: '#fff',
              borderRadius: 999,
              padding: '11px 18px',
              textDecoration: 'none',
              fontWeight: 900,
            }}
          >
            Back home
          </Link>
        </div>
      </section>
    </main>
  );
}
