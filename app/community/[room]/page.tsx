import Link from 'next/link';
import { notFound } from 'next/navigation';

const rooms = ['game-requests', 'high-scores', 'bug-reports', 'favourite-games', 'deal-ideas'];

type PageProps = { params: Promise<{ room: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return rooms.map((room) => ({ room }));
}

export async function generateMetadata({ params }: PageProps) {
  const { room } = await params;
  if (!rooms.includes(room)) notFound();
  const label = room.replace(/-/g, ' ');
  return {
    title: `GR8 ${label} | GR8 GAMZ`,
    alternates: { canonical: `/community/${room}` }
  };
}

export default async function CommunityRoomPage({ params }: PageProps) {
  const { room } = await params;
  if (!rooms.includes(room)) notFound();
  const label = room.replace(/-/g, ' ');
  return (
    <main>
      <section className="page-title">
        <h1>GR8 {label}</h1>
        <p>This controlled Clubhouse room is ready for the moderation-backed community layer.</p>
        <div className="cta-row">
          <Link href="/community" className="secondary-cta">All rooms</Link>
          <Link href="/report" className="secondary-cta">Report issue</Link>
        </div>
      </section>
    </main>
  );
}
