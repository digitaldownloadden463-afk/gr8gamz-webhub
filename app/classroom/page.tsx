import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Brain, Clock3, Gamepad2, ShieldCheck } from 'lucide-react';
import AdSensePlacement from '@/components/ads/AdSensePlacement';
import ClassroomGameLink from '@/components/classroom/ClassroomGameLink';
import ClassroomViewTracker from '@/components/classroom/ClassroomViewTracker';
import PartnerArtwork from '@/components/PartnerArtwork';
import { canonical } from '@/lib/features';
import { classroomReviewedAt, getClassroomGameGroups } from '@/lib/classroom';

const title = 'GR8 Classroom: Free Timer and Short Classroom Games';
const description = 'Open a free classroom timer, then browse carefully selected five-minute, maths, logic, puzzle and memory games. No account or pupil names required.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: canonical('/classroom') },
  openGraph: { title, description, url: canonical('/classroom'), images: [{ url: '/classroom/gr8-classroom-share.png', width: 1200, height: 630, alt: 'GR8 Classroom timer and activity hub' }] },
  twitter: { card: 'summary_large_image', title, description, images: ['/classroom/gr8-classroom-share.png'] }
};

export const dynamic = 'force-static';

export default function ClassroomPage() {
  const groups = getClassroomGameGroups();
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: canonical('/') },
      { '@type': 'ListItem', position: 2, name: 'GR8 Classroom', item: canonical('/classroom') }
    ]
  };

  return (
    <main className="classroom-page">
      <ClassroomViewTracker event="classroom_hub_view" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <nav className="commerce-breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">GR8 Classroom</span></nav>

      <section className="classroom-hero">
        <div>
          <span className="eyebrow"><BookOpen aria-hidden="true" /> GR8 Classroom</span>
          <h1>A calm timer and short activities, ready when the room is.</h1>
          <p>Start with a large, accurate classroom countdown. When a session finishes, choose an optional short game without accounts, pupil names or forced navigation.</p>
          <div className="cta-row"><Link href="/classroom/timer" className="cta"><Clock3 aria-hidden="true" /> Open classroom timer</Link><a href="#activities" className="secondary-cta"><Gamepad2 aria-hidden="true" /> Browse activities</a></div>
        </div>
        <div className="classroom-hero__display" aria-hidden="true"><span>05:00</span><i /></div>
      </section>

      <section className="classroom-principles" aria-label="GR8 Classroom principles">
        <article><Clock3 aria-hidden="true" /><strong>Useful immediately</strong><span>The timer works in the browser with presets, custom time and a full-screen display.</span></article>
        <article><ShieldCheck aria-hidden="true" /><strong>Privacy considered</strong><span>No login, pupil-name field, camera, microphone or server-side classroom list.</span></article>
        <article><Brain aria-hidden="true" /><strong>Claims kept honest</strong><span>Games are grouped by play style, not presented as assessed curriculum resources.</span></article>
      </section>

      <AdSensePlacement placement="classroom-upper-content" />

      <section className="classroom-guide" aria-labelledby="classroom-guide-title">
        <div><span className="eyebrow">For teachers and parents</span><h2 id="classroom-guide-title">Choose by time, controls and the room you have.</h2></div>
        <div className="classroom-guide__grid">
          <article><h3>Five minutes</h3><p>Use a simple tap, match or memory activity when setup time needs to stay short. Check the game profile’s controls before sharing a screen.</p></article>
          <article><h3>Ten minutes</h3><p>A spatial or number puzzle can suit a longer individual turn. Third-party GR8 Select games remain behind the site’s external-content choice.</p></article>
          <article><h3>One screen</h3><p>For whole-class turn-taking, choose a game with clear mouse, touch or keyboard input and let an adult control navigation.</p></article>
        </div>
      </section>

      <section id="activities" className="classroom-activity-index" aria-labelledby="activity-index-title">
        <div className="section-heading"><div><span className="eyebrow"><Gamepad2 aria-hidden="true" /> Optional activities</span><h2 id="activity-index-title">Short choices from the live GR8 catalogue.</h2></div></div>
        {groups.map((group, groupIndex) => (
          <section key={group.id} className="classroom-activity-group" aria-labelledby={`${group.id}-title`}>
            <div className="classroom-activity-group__heading"><div><h3 id={`${group.id}-title`}>{group.title}</h3><p>{group.description}</p></div><span>{group.games.length} choices</span></div>
            <div className="classroom-game-grid">
              {group.games.map((game) => (
                <article key={game.url} className="classroom-game-card">
                  <ClassroomGameLink href={game.url} slug={game.slug} section={group.id} className="classroom-game-card__media"><PartnerArtwork src={game.artwork} title={game.title} category={game.category} showBadge={false} /></ClassroomGameLink>
                  <div><span className="game-card__kicker">{game.source === 'gr8-originals' ? 'GR8 Original' : 'GR8 Select'} · {game.category}</span><h4><ClassroomGameLink href={game.url} slug={game.slug} section={group.id}>{game.slug === 'duck-math' ? 'Math Duck (Duck Math)' : game.title}</ClassroomGameLink></h4><p>{game.controls}</p></div>
                </article>
              ))}
            </div>
            {groupIndex === 1 ? <AdSensePlacement placement="classroom-mid-content" /> : null}
          </section>
        ))}
      </section>

      <section className="classroom-notes">
        <div><h2>What GR8 Classroom does not claim</h2><p>These games can be useful for short breaks, turn-taking or informal number and logic practice. GR8 GAMZ has not assessed them against a formal curriculum and does not promise a learning outcome or universal school-network access.</p></div>
        <div><h2>External games and devices</h2><p>GR8 Originals run on this site. GR8 Select titles can come from external providers and only load after the visitor’s explicit external-content choice. Check each profile for the listed mouse, touch or keyboard controls.</p></div>
      </section>

      <AdSensePlacement placement="classroom-lower-content" />

      <section className="classroom-safety-links">
        <span>Reviewed {classroomReviewedAt}</span>
        <nav aria-label="Classroom policy links"><Link href="/child-safety">Child safety</Link><Link href="/privacy">Privacy</Link><Link href="/accessibility">Accessibility</Link></nav>
        <Link href="/classroom/timer" className="cta">Open the timer <ArrowRight aria-hidden="true" /></Link>
      </section>
    </main>
  );
}
