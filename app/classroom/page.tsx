import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Brain, Clock3, Gamepad2, ShieldCheck } from 'lucide-react';
import AdSensePlacement from '@/components/ads/AdSensePlacement';
import ClassroomGameLink from '@/components/classroom/ClassroomGameLink';
import ClassroomViewTracker from '@/components/classroom/ClassroomViewTracker';
import PartnerArtwork from '@/components/PartnerArtwork';
import { canonical } from '@/lib/features';
import { classroomReviewedAt, getClassroomGameGroups } from '@/lib/classroom';

const title = 'Free Classroom Games & Timer for Short Brain Breaks';
const description = 'Use a free classroom timer and browse five-minute classroom games, maths, logic, puzzle and memory activities. No account or pupil names required.';

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
  const classroomGames = [...new Map(groups.flatMap((group) => group.games).map((game) => [game.url, game])).values()];
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: canonical('/') },
      { '@type': 'ListItem', position: 2, name: 'GR8 Classroom', item: canonical('/classroom') }
    ]
  };
  const collection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Free classroom games and classroom timer',
    description,
    url: canonical('/classroom'),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: classroomGames.length,
      itemListElement: classroomGames.map((game, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: game.title,
        url: canonical(game.url)
      }))
    }
  };

  return (
    <main className="classroom-page">
      <ClassroomViewTracker event="classroom_hub_view" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }} />
      <nav className="commerce-breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">GR8 Classroom</span></nav>

      <section className="classroom-hero">
        <div>
          <span className="eyebrow"><BookOpen aria-hidden="true" /> GR8 Classroom</span>
          <h1>Free classroom games and a timer for short brain breaks</h1>
          <p>Start with a large, accurate classroom countdown. When a session finishes, choose a five-minute classroom game or a short maths, logic, puzzle or memory activity without accounts, pupil names or forced navigation.</p>
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

      <section className="content-panel" aria-labelledby="classroom-use-title">
        <span className="eyebrow">Quick planning guide</span>
        <h2 id="classroom-use-title">How to choose a classroom game for the time available</h2>
        <p>For a five-minute brain break, choose a game with one clear input and an objective that can be understood before the timer ends. For a ten-minute activity, a number, spatial or memory puzzle gives pupils more time to plan and retry.</p>
        <p>For whole-class use on one screen, an adult should control navigation and check the listed mouse, touch or keyboard controls first. GR8 Classroom does not claim that a game is curriculum-aligned or available on every school network.</p>
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

      <section className="content-panel" aria-labelledby="classroom-questions-title">
        <h2 id="classroom-questions-title">Questions about classroom games</h2>
        <h3>What are good five-minute classroom games?</h3>
        <p>Choose a short matching, memory, tap or number activity with simple controls and no lengthy setup. The five-minute group above is selected for quick starts, not as a formal learning assessment.</p>
        <h3>Can these games be used as a brain break?</h3>
        <p>They can be optional short breaks or early-finisher activities when an adult decides the game, device and time are appropriate. Use the classroom timer to keep the break bounded.</p>
        <h3>Do pupils need an account?</h3>
        <p>No. GR8 Classroom does not ask for pupil names, classroom lists, camera access or microphone access.</p>
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
