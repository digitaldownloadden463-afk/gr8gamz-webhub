import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, ExternalLink, Gamepad2, Monitor } from 'lucide-react';
import { canonical } from '@/lib/features';

const path = '/gr8-daily/gta-6-pc-free-browser-games';
const publishedAt = '2026-11-21';
const title = 'GTA 6 Is Out—but Not on PC: 12 Free Browser Games to Play Now';
const description = 'GTA VI is available on PS5 and Xbox Series X|S, but no PC date is confirmed. Try 12 free city-driving, chase, heist and open-world browser games now.';
const hero = '/editorial/gta-6-pc-browser-games-hero.png';

const games = [
  { title: 'Endless Car Chase', href: '/more-free-games/endless-car-chase', fit: 'Police-chase pressure', text: 'Keep moving while the pursuit closes in. This is the quickest pick when you want evasive driving rather than a structured race.' },
  { title: 'Night City Racing', href: '/more-free-games/night-city-racing', fit: 'Neon street racing', text: 'A night-time city race with bright roads and direct scoring. Choose it for speed and atmosphere without a long setup.' },
  { title: 'Grand City Driving 2', href: '/more-free-games/grand-city-driving-2', fit: 'Open city driving', text: 'Cruise a broad city map and switch the emphasis from missions to driving. It is the closest fit here for players who mainly want room to explore in a car.' },
  { title: 'Drift Race in the Open World', href: '/more-free-games/drift-race-in-the-open-world', fit: 'Open-world drifting', text: 'Combine a larger driving space with score-led drifting. Pick this when car control matters more than a police or heist theme.' },
  { title: 'Smart Looter', href: '/more-free-games/smart-looter', fit: 'Short stealth heists', text: 'Move around guards and complete compact theft challenges. Its touch-led format makes it a practical phone option.' },
  { title: 'Car Chase Parking', href: '/more-free-games/car-chase-parking', fit: 'Chase and escape', text: 'A fast arcade pursuit where dodging matters more than precision parking. It works best when you want immediate retries.' },
  { title: 'City Driver Destroy Car', href: '/more-free-games/city-driver-destroy-car', fit: 'Vehicle destruction', text: 'Turn city driving into a demolition challenge. Choose it for crashes and destruction rather than realistic traffic rules.' },
  { title: 'Grand City Police Simulation', href: '/more-free-games/grand-city-police-simulation', fit: 'Police-side city play', text: 'Take the other side of the chase in a city police-driving simulation. It suits players who prefer pursuit and patrol themes.' },
  { title: 'Police Chase', href: '/more-free-games/police-chase', fit: 'Quick pursuit rounds', text: 'A short arcade chase built for fast starts and repeat attempts. Use a larger screen if the loaded control layout feels crowded.' },
  { title: 'Motorcycle Racer: Road Mayhem', href: '/more-free-games/motorcycle-racer-road-mayhem', fit: 'City motorcycle runs', text: 'Ride through busy streets instead of staying behind the wheel of a car. This is the motorcycle alternative in the list.' },
  { title: 'Bank Robbery Sneak Master', href: '/more-free-games/bank-robbery-sneak-master', fit: 'Keyboard stealth action', text: 'A stealth-led robbery game with keyboard movement. Check the profile first because its multi-key controls make desktop the clearer fit.' },
  { title: 'Reckless Getaway 2: Car Chase', href: '/more-free-games/reckless-getaway-2-car-chase', fit: 'Arcade getaway driving', text: 'Escape a pursuit through direct keyboard steering and quick resets. It is a good final choice when you want the getaway itself to be the whole challenge.' }
];

export const metadata: Metadata = {
  title,
  description,
  robots: { index: true, follow: true },
  alternates: { canonical: canonical(path) },
  openGraph: {
    title,
    description,
    url: canonical(path),
    type: 'article',
    publishedTime: `${publishedAt}T09:00:00Z`,
    modifiedTime: `${publishedAt}T09:00:00Z`,
    images: [{ url: hero, width: 1672, height: 941, alt: 'An original neon coastal-city driving illustration' }]
  },
  twitter: { card: 'summary_large_image', title, description, images: [hero] }
};

export default function GtaSixPcBrowserGamesArticle() {
  const url = canonical(path);
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: title,
      description,
      image: canonical(hero),
      datePublished: publishedAt,
      dateModified: publishedAt,
      mainEntityOfPage: url,
      author: { '@type': 'Organization', name: 'GR8 GAMZ Editorial', url: canonical('/editorial-policy') },
      publisher: { '@type': 'Organization', name: 'GR8 GAMZ', logo: { '@type': 'ImageObject', url: canonical('/brand/gr8-gamz-logo-wide.png') } }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: canonical('/') },
        { '@type': 'ListItem', position: 2, name: 'GR8 Daily', item: canonical('/gr8-daily') },
        { '@type': 'ListItem', position: 3, name: 'GTA 6 PC browser games', item: url }
      ]
    }
  ];

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link><span>/</span><Link href="/gr8-daily">GR8 Daily</Link><span>/</span><span aria-current="page">GTA 6 PC browser games</span>
      </nav>

      <article className="editorial-article">
        <header className="page-title editorial-article__header">
          <span className="eyebrow"><Gamepad2 size={18} aria-hidden="true" /> Timely gaming guide</span>
          <h1>{title}</h1>
          <p>What is officially available, what PC players should avoid, and which free city-driving, chase and heist games you can open in a browser today.</p>
          <p className="fine-print"><CalendarDays size={17} aria-hidden="true" /> Published and fact-checked <time dateTime={publishedAt}>21 November 2026</time>.</p>
        </header>

        <figure className="editorial-article__hero">
          <Image src={hero} alt="An original neon coastal-city driving scene created for this GR8 GAMZ article" width={1672} height={941} priority />
          <figcaption>Original GR8 GAMZ editorial illustration. It does not depict Grand Theft Auto VI.</figcaption>
        </figure>

        <section className="content-panel editorial-article__body" aria-labelledby="official-status-title">
          <span className="eyebrow"><Monitor size={18} aria-hidden="true" /> The official position</span>
          <h2 id="official-status-title">Is GTA 6 available on PC?</h2>
          <p><strong>No Windows PC release date has been announced.</strong> Grand Theft Auto VI launched on 19 November 2026 for PlayStation 5 and Xbox Series X|S. Rockstar&apos;s official release page lists those console platforms and does not currently list Windows, Chromebook, a browser edition or a native phone version.</p>
          <p>That means a website offering a supposed &quot;GTA 6 PC download&quot; or claiming that the complete game runs free in a browser is not offering an officially announced Rockstar PC release. Use <a href="https://www.rockstargames.com/VI/out-now" target="_blank" rel="noopener noreferrer">Rockstar&apos;s official GTA VI page <ExternalLink size={15} aria-hidden="true" /></a> for platform information.</p>
          <aside className="editorial-note"><strong>Independence notice:</strong> GR8 GAMZ is not affiliated with, endorsed by or sponsored by Rockstar Games or Take-Two Interactive. Grand Theft Auto and GTA are trademarks of their respective owners.</aside>
        </section>

        <section className="content-panel editorial-article__body" aria-labelledby="browser-alternatives-title">
          <span className="eyebrow">Play immediately</span>
          <h2 id="browser-alternatives-title">12 free browser games for the city-driving itch</h2>
          <p>None of these games is GTA VI, and they are not presented as replacements for Rockstar&apos;s open-world production. They are shorter browser games selected for one recognisable part of the appeal: city driving, chases, drifting, police play, vehicle destruction or compact heist action.</p>
          <div className="editorial-game-list">
            {games.map((game, index) => (
              <article key={game.href}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <p className="eyebrow">{game.fit}</p>
                  <h3><Link href={game.href}>{game.title}</Link></h3>
                  <p>{game.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="content-panel editorial-article__body" aria-labelledby="choose-title">
          <h2 id="choose-title">Choose by the part of GTA-style play you want</h2>
          <h3>For an open city and free driving</h3>
          <p>Start with <Link href="/more-free-games/grand-city-driving-2">Grand City Driving 2</Link> or <Link href="/more-free-games/drift-race-in-the-open-world">Drift Race in the Open World</Link>. They put driving space ahead of a tight race structure.</p>
          <h3>For police chases and quick escapes</h3>
          <p>Try <Link href="/more-free-games/endless-car-chase">Endless Car Chase</Link>, <Link href="/more-free-games/car-chase-parking">Car Chase Parking</Link> or <Link href="/more-free-games/reckless-getaway-2-car-chase">Reckless Getaway 2: Car Chase</Link>. These are faster arcade loops rather than long campaigns.</p>
          <h3>For heist or stealth themes</h3>
          <p><Link href="/more-free-games/smart-looter">Smart Looter</Link> is the simpler touch-led choice. <Link href="/more-free-games/bank-robbery-sneak-master">Bank Robbery Sneak Master</Link> uses several keyboard controls and is better suited to desktop play.</p>
          <h3>For cars beyond this list</h3>
          <p>Browse the complete <Link href="/car-games">car-games collection</Link>, narrow the catalogue to <Link href="/parking-games">parking games</Link>, or try <Link href="/ragdoll-games">ragdoll physics games</Link> when crashes and unpredictable movement are more appealing than realistic driving.</p>
        </section>

        <section className="content-panel editorial-article__body" aria-labelledby="questions-title">
          <h2 id="questions-title">Quick questions</h2>
          <h3>Can I play GTA 6 in a browser?</h3>
          <p>Rockstar has not announced an official browser version. Browser pages using GTA-like words or themes are separate games and should not be mistaken for GTA VI.</p>
          <h3>Can I play GTA 6 on a Chromebook?</h3>
          <p>No native Chromebook edition has been announced. The games in this guide run through normal browser pages, but support still depends on each game&apos;s controls and the device.</p>
          <h3>Is there a GTA 6 PC release date?</h3>
          <p>No official Windows PC date is listed as of 21 November 2026. This article will be updated if Rockstar announces one.</p>
          <h3>Are these games free?</h3>
          <p>The listed browser games can be opened free on GR8 GAMZ. Third-party games load only after the player chooses to open external game content, and advertising or provider behaviour can vary.</p>
        </section>

        <footer className="editorial-article__footer">
          <p><strong>Sources:</strong> <a href="https://www.rockstargames.com/newswire/article/39akk424a9oo53/grand-theft-auto-vi-now-available" target="_blank" rel="noopener noreferrer">Rockstar Games launch announcement</a>; <a href="https://www.take2games.com/ir/news/take-two-interactive-software-inc-reports-results-fiscal-first-6" target="_blank" rel="noopener noreferrer">Take-Two platform and release information</a>.</p>
          <p>Selection and factual review: GR8 GAMZ Editorial. Read our <Link href="/editorial-policy">editorial policy</Link> or <Link href="/report-a-game">report a game problem</Link>.</p>
        </footer>
      </article>
    </main>
  );
}
