import Link from 'next/link';

export const metadata = {
  title: 'V34 Backend Database Bridge | GR8 GAMZ',
  description: 'V34 adds database-ready API contracts, sync endpoints, admin queue APIs and backend setup documentation for GR8 GAMZ.'
};

export default function V34UpdatePage() {
  return (
    <article style={{ padding: '40px 0', lineHeight: 1.65 }}>
      <p style={{ color: '#35ff8d', fontWeight: 900, letterSpacing: '.08em', textTransform: 'uppercase' }}>V34 Backend Bridge</p>
      <h1 style={{ fontSize: 'clamp(2.6rem, 8vw, 5.2rem)', lineHeight: .92, letterSpacing: '-.08em' }}>GR8 GAMZ now has the database bridge foundation.</h1>
      <p style={{ color: '#a1a1aa', maxWidth: 820 }}>V34 prepares the move from local-only Passport data to a real server-backed platform with API contracts for players, saved games, Clubhouse posts, support messages, reports and admin queues.</p>
      <h2>What changed</h2>
      <ul>
        <li>New backend status API.</li>
        <li>Passport snapshot sync endpoint.</li>
        <li>Player, Clubhouse, support and report API contracts.</li>
        <li>Admin queue endpoint protected by an optional GR8 admin key.</li>
        <li>Database schema and Vercel environment setup documentation.</li>
        <li>Temporary memory fallback so endpoints can be tested before the database is connected.</li>
      </ul>
      <p><Link href="/backend" style={{ color: '#35ff8d' }}>Open Backend Bridge Dashboard</Link></p>
    </article>
  );
}
