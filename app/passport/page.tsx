import Link from 'next/link';
import PlayerPanel from '@/components/PlayerPanel';
import ProfileContent from '@/components/ProfileContent';

export const metadata = {
  title: 'GR8 Passport | GR8 GAMZ',
  description: 'Create your GR8 Passport, save games, build XP and return to your arcade profile.',
  robots: { index: false, follow: true }
};

export default function PassportPage() {
  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">GR8 Passport</span>
        <h1>Your player identity for GR8 GAMZ.</h1>
        <p>Use your GR8 Passport to save games, build XP, return to favourites and prepare for account sync.</p>
        <div className="cta-row">
          <Link href="/auth" className="cta">Create or sign in</Link>
          <Link href="/my-arcade" className="secondary-cta">Open My Arcade</Link>
          <Link href="/games" className="secondary-cta">Play games</Link>
        </div>
      </section>
      <section className="home-grid">
        <PlayerPanel />
        <ProfileContent compact />
      </section>
    </main>
  );
}
