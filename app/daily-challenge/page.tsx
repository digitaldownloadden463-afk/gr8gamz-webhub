import Link from 'next/link';
import { ActivityFeed } from '@/components/ActivityFeed';

export const metadata = {
  title: 'Daily Challenge | GR8 GAMZ',
  description: 'Daily missions and return-play prompts for GR8 GAMZ players.',
  robots: { index: false, follow: true }
};

const missions = [
  'Play any arcade game today',
  'Try one top game',
  'Visit the Clubhouse',
  'Save your favourite game in My Arcade'
];

export default function DailyChallengePage() {
  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">Daily Challenge</span>
        <h1>Build a daily GR8 streak.</h1>
        <p>Daily missions keep the arcade moving while the full leaderboard and database layers are being expanded.</p>
        <div className="cta-row">
          <Link href="/games" className="cta">Start playing</Link>
          <Link href="/my-arcade" className="secondary-cta">My Arcade</Link>
        </div>
      </section>
      <section className="home-grid">
        <div style={{ border: '1px solid rgba(255,255,255,.1)', borderRadius: 22, padding: 20, background: 'rgba(255,255,255,.04)' }}>
          <h2>Today’s missions</h2>
          <ul style={{ color: '#d4d4d8', lineHeight: 1.8 }}>
            {missions.map((mission) => <li key={mission}>{mission}</li>)}
          </ul>
        </div>
        <ActivityFeed title="Daily activity" />
      </section>
    </main>
  );
}
