import Link from 'next/link';
import { notFound } from 'next/navigation';
import JsonLd from '../../../components/JsonLd';
import ClubhouseRoomBoard from '../../../components/community/ClubhouseRoomBoard';
import ClubhouseSubmitForm from '../../../components/community/ClubhouseSubmitForm';
import { communityRooms, getCommunityRoom } from '../../../data/community';
import { buildPageMetadata, breadcrumbJsonLd } from '../../../lib/seo';

export function generateStaticParams() {
  return communityRooms.map((room) => ({ room: room.id }));
}

export function generateMetadata({ params }) {
  const room = getCommunityRoom(params.room);
  if (!room) return buildPageMetadata({ title: 'Community room not found', path: `/community/${params.room}`, noIndex: true });
  return buildPageMetadata({
    title: `${room.title} | GR8 Clubhouse`,
    description: room.description,
    path: room.href
  });
}

export default function CommunityRoomPage({ params }) {
  const room = getCommunityRoom(params.room);
  if (!room) notFound();

  return (
    <main>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'GR8 Clubhouse', path: '/community' },
        { name: room.title, path: room.href }
      ])} />
      <section className="page-title">
        <span className="eyebrow">{room.emoji} {room.eyebrow}</span>
        <h1>{room.title}</h1>
        <p>{room.description}</p>
        <div className="hero-actions">
          <Link href="/community" className="secondary-cta">All rooms</Link>
          <Link href="/community-guidelines" className="secondary-cta">Guidelines</Link>
          <Link href="/passport/signup" className="cta">Create Passport</Link>
        </div>
      </section>
      <ClubhouseRoomBoard room={room} />
      <ClubhouseSubmitForm room={room} />
      <section className="content-panel compact-panel">
        <div className="section-heading compact">
          <span>Moderation-first</span>
          <h2>This room is controlled until the backend moderation dashboard goes live.</h2>
        </div>
        <p>V33 stores submissions locally and adds starter boards, reports and Control Room review. The next backend phase can sync them to a GR8-owned database with secure admin roles and persistent publish controls.</p>
      </section>
    </main>
  );
}
