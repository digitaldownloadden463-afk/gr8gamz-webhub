import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock3, Monitor, ShieldCheck, Volume2 } from 'lucide-react';
import AdSensePlacement from '@/components/ads/AdSensePlacement';
import ClassroomTimer from '@/components/classroom/ClassroomTimer';
import ClassroomViewTracker from '@/components/classroom/ClassroomViewTracker';
import { canonical } from '@/lib/features';
import { getClassroomFeaturedGames } from '@/lib/classroom';

const title = 'Free Classroom Timer: Online Visual Countdown';
const description = 'A free online classroom timer with quick presets, custom time, full-screen display, calm visual progress and optional sound. No account or pupil names.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: canonical('/classroom/timer') },
  openGraph: { title, description, url: canonical('/classroom/timer'), images: [{ url: '/classroom/gr8-classroom-timer-share.png', width: 1200, height: 630, alt: 'GR8 Classroom visual countdown timer' }] },
  twitter: { card: 'summary_large_image', title, description, images: ['/classroom/gr8-classroom-timer-share.png'] }
};

export const dynamic = 'force-static';

export default function ClassroomTimerPage() {
  const suggestions = getClassroomFeaturedGames().slice(0, 4);
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: canonical('/') },
      { '@type': 'ListItem', position: 2, name: 'GR8 Classroom', item: canonical('/classroom') },
      { '@type': 'ListItem', position: 3, name: 'Classroom Timer', item: canonical('/classroom/timer') }
    ]
  };
  const application = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'GR8 Classroom Timer',
    url: canonical('/classroom/timer'),
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any modern web browser',
    browserRequirements: 'JavaScript and a modern browser',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
    description
  };

  return (
    <main className="classroom-page classroom-timer-page">
      <ClassroomViewTracker event="classroom_timer_view" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(application) }} />
      <nav className="commerce-breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/classroom">GR8 Classroom</Link><span aria-hidden="true">/</span><span aria-current="page">Classroom Timer</span></nav>

      <header className="classroom-tool-intro">
        <span className="eyebrow"><Clock3 aria-hidden="true" /> Free online classroom timer</span>
        <h1>A clear countdown for the whole room.</h1>
        <p>Choose a quick preset or set hours, minutes and seconds. The timer corrects itself after background-tab delays, stays readable on a projector and keeps sound off until you choose it.</p>
      </header>

      <ClassroomTimer suggestions={suggestions} />

      <section className="classroom-tool-use" aria-labelledby="timer-use-title">
        <div><span className="eyebrow">Practical use</span><h2 id="timer-use-title">From one-minute transitions to a full lesson block.</h2></div>
        <div className="classroom-guide__grid">
          <article><Clock3 aria-hidden="true" /><h3>Short transitions</h3><p>Try one to three minutes for packing away, changing activity or a quick reset.</p></article>
          <article><Monitor aria-hidden="true" /><h3>Shared display</h3><p>Use full screen on a laptop, projector or interactive whiteboard. The large numerals scale without a separate app.</p></article>
          <article><Volume2 aria-hidden="true" /><h3>Sound by choice</h3><p>The completion tone is muted by default and only becomes available after a user action.</p></article>
        </div>
      </section>

      <section className="classroom-tool-help" aria-labelledby="timer-help-title">
        <div><h2 id="timer-help-title">How to use the timer</h2><ol><li>Choose a preset or enter a custom duration.</li><li>Select Start. Pause and resume if the activity is interrupted.</li><li>Add or subtract a minute when plans change, or reset with confirmation while running.</li><li>At zero, dismiss the optional activity suggestions or choose one; the timer never launches a game automatically.</li></ol></div>
        <div><h2>Troubleshooting</h2><dl><dt>The tab was in the background</dt><dd>The countdown is based on elapsed clock time and corrects when the tab becomes active again.</dd><dt>There is no sound</dt><dd>Sound starts muted. Enable it using the speaker control after interacting with the page.</dd><dt>Full screen is unavailable</dt><dd>The page uses a large in-page fallback if the browser does not allow the Fullscreen API.</dd></dl></div>
      </section>

      <section className="classroom-privacy-note">
        <ShieldCheck aria-hidden="true" />
        <div><h2>Private by design for a shared screen</h2><p>The timer needs no login and has no pupil-name, camera, microphone or location feature. It stores only the sound and display-style choices in this browser. Those preferences contain no classroom list or personal text.</p><p><Link href="/privacy">Read privacy information</Link> or <Link href="/classroom">browse GR8 Classroom activities</Link>.</p></div>
      </section>

      <AdSensePlacement placement="classroom-tool-lower-content" />
    </main>
  );
}
