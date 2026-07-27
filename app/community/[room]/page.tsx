import Link from 'next/link';

const rooms = ['game-requests', 'high-scores', 'bug-reports', 'favourite-games', 'deal-ideas'];

type PageProps = { params: { room: string } };

export function generateStaticParams() {
  return rooms.map((room) => ({ room }));
}

export default function CommunityRoomPage({ params }: PageProps) {
  const label = params.room.replace(/-/g, ' ');
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
