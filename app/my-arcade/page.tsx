import Link from 'next/link';
import MyArcadeClient from '@/components/MyArcadeClient';
import { getAllGames } from '@/lib/games';
import { canonical } from '@/lib/features';
import { getPartnerGameProfiles } from '@/src/data/partnerGameProfiles';

export const metadata = {
  title: 'My Arcade',
  description: 'Local favourites and recent games saved on this device only.',
  robots: { index: false, follow: true },
  alternates: { canonical: canonical('/my-arcade') }
};

export default function MyArcadePage() {
  const games = [
    ...getAllGames().map((game) => ({ ...game, kind: 'original' as const, path: `/arcade/${game.slug || game.id}` })),
    ...getPartnerGameProfiles().map((game) => ({ ...game, id: game.slug, name: game.title, kind: 'select' as const }))
  ];
  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">Saved on this device</span>
        <h1>My Arcade is local and private.</h1>
        <p>Favourites and recent games are saved in this browser only. There is no account system, public profile or cross-device sync.</p>
        <div className="cta-row">
          <Link href="/games" className="cta">Browse games</Link>
          <Link href="/privacy" className="secondary-cta">Privacy details</Link>
        </div>
      </section>
      <MyArcadeClient games={games} />
    </main>
  );
}
