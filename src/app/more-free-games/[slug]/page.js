import Link from 'next/link';
import JsonLd from '../../../components/JsonLd';
import PartnerPlayLauncher from '../../../components/partner/PartnerPlayLauncher';
import PartnerLiveGamePanel from '../../../components/partner/PartnerLiveGamePanel';
import PartnerProfileGrid from '../../../components/partner/PartnerProfileGrid';
import PartnerRetentionPanel from '../../../components/partner/PartnerRetentionPanel';
import { getPartnerGameProfile, getRelatedPartnerGameProfiles } from '../../../data/partnerGameProfiles';
import { absoluteUrl, breadcrumbJsonLd, buildPageMetadata, faqJsonLd, imageObjectJsonLd } from '../../../lib/seo';

export function generateMetadata({ params }) {
  const profile = getPartnerGameProfile(params.slug);
  if (!profile) {
    return buildPageMetadata({ title: 'More Free Games', path: '/more-free-games' });
  }
  return buildPageMetadata({
    title: `${profile.title} Free Online Game Profile`,
    description: `${profile.title} on GR8 GAMZ: ${profile.intent}, quick no-download browser play, related games, FAQs and branded game discovery.`,
    path: profile.path,
    image: profile.image
  });
}

function partnerGameJsonLd(profile) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: profile.title,
    description: profile.description,
    url: absoluteUrl(profile.path),
    image: absoluteUrl(profile.image),
    sameAs: absoluteUrl(profile.playPath || `${profile.path}/play`),
    applicationCategory: 'Game',
    gamePlatform: ['Web browser', 'Mobile browser', 'Desktop browser'],
    genre: profile.category,
    playMode: 'SinglePlayer',
    operatingSystem: 'Any',
    inLanguage: 'en-GB',
    isAccessibleForFree: true,
    keywords: profile.keywords.join(', '),
    publisher: {
      '@type': 'Organization',
      name: 'GR8 GAMZ',
      url: absoluteUrl('/')
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'GBP',
      availability: 'https://schema.org/InStock'
    }
  };
}

export default function PartnerGameProfilePage({ params }) {
  const profile = getPartnerGameProfile(params.slug);
  if (!profile) {
    return (
      <main>
        <div className="page-title"><h1>Game profile not found.</h1><p>Return to More Free Games for the latest network picks.</p></div>
        <Link href="/more-free-games" className="secondary-cta">More Free Games</Link>
      </main>
    );
  }

  const relatedProfiles = getRelatedPartnerGameProfiles(profile, 8);
  return (
    <main>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'More Free Games', path: '/more-free-games' },
        { name: profile.title, path: profile.path }
      ])} />
      <JsonLd data={partnerGameJsonLd(profile)} />
      <JsonLd data={faqJsonLd(profile.faqs)} />
      <JsonLd data={imageObjectJsonLd({ name: `${profile.title} GR8 GAMZ artwork`, description: `Branded GR8 GAMZ game profile image for ${profile.title}.`, path: profile.path, image: profile.image })} />

      <section className="partner-profile-hero">
        <div className="partner-profile-copy">
          <span className="eyebrow">GR8 Game Profile #{profile.rank}</span>
          <h1>{profile.title}</h1>
          <p>{profile.description}</p>
          <div className="partner-keyword-row">
            {profile.keywords.slice(0, 4).map((keyword) => <span key={keyword}>{keyword}</span>)}
          </div>
          <PartnerPlayLauncher profile={profile} />
        </div>
        <div className="partner-profile-art">
          <PartnerLiveGamePanel profile={profile} />
        </div>
      </section>

      <PartnerRetentionPanel
        title="Continue your GR8 run."
        description="Recently viewed and saved games appear here after you explore the network."
        maxItems={4}
      />

      <section className="content-panel game-profile-detail">
        <div>
          <span className="eyebrow">Why we picked it</span>
          <h2>{profile.whyPicked}</h2>
          <p>
            This page exists to give {profile.title} a stronger GR8-branded discovery route instead of leaving the game buried inside a generic supplier feed. It helps players understand the game type, search intent and related GR8 GAMZ routes before they click deeper.
          </p>
        </div>
        <div className="profile-facts-grid">
          <article><strong>Category</strong><span>{profile.category}</span></article>
          <article><strong>Best for</strong><span>{profile.bestFor}</span></article>
          <article><strong>Controls</strong><span>{profile.controls}</span></article>
          <article><strong>Device fit</strong><span>{profile.deviceFit || 'Browser, tablet and desktop depending on game controls'}</span></article>
          <article><strong>Discovery signal</strong><span>{profile.sourceRank}</span></article>
        </div>
      </section>

      <section className="content-panel seo-detail-panel">
        <span className="eyebrow">How to play</span>
        <h2>{profile.howToPlay ? `How to start ${profile.title}` : 'Start fast, test the controls, then chase a better run.'}</h2>
        <p>
          {profile.howToPlay || 'Open the game from the GR8 Game Network, let it load inside the browser and use the on-screen prompts to learn the controls. Most partner games work best when you treat the first round as a quick test, then replay once you understand the timing, aim or movement system.'}
        </p>
        {profile.deviceFit ? <p><strong>Device tip:</strong> {profile.deviceFit}</p> : null}
        <div className="quick-link-grid network-mini-links">
          <Link href="/hot-picks" className="quick-link-card"><strong>Hot Picks</strong><small>Featured games and fresh picks</small></Link>
          <Link href="/original-games" className="quick-link-card"><strong>GR8 Originals</strong><small>Self-hosted arcade games</small></Link>
          <Link href="/no-download-games" className="quick-link-card"><strong>No Download Games</strong><small>Instant browser play</small></Link>
          <Link href="/gaming-deals" className="quick-link-card"><strong>Gaming Deals</strong><small>Future revenue hub</small></Link>
        </div>
      </section>

      <section className="content-panel faq-panel">
        <div className="section-heading compact"><span>Player questions</span><h2>{profile.title} FAQs.</h2></div>
        <div className="faq-grid">
          {profile.faqs.map((faq) => <article key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></article>)}
        </div>
      </section>

      <PartnerProfileGrid
        profiles={relatedProfiles}
        eyebrow="Play next"
        title="More GR8 game profiles to explore."
        description="These related profile pages keep players moving through the GR8 Game Network instead of bouncing back to search."
      />
    </main>
  );
}
