import Link from 'next/link';
import { notFound } from 'next/navigation';
import PartnerGameCard from '@/components/PartnerGameCard';
import ChallengeShare from '@/components/ChallengeShare';
import GameShare from '@/components/GameShare';
import PartnerArtwork from '@/components/PartnerArtwork';
import type { PartnerGameProfile } from '@/components/PartnerGameCard';
import { canonical } from '@/lib/features';
import { slugifyRegistryValue } from '@/lib/gameRegistry';
import { tr } from '@/lib/i18n';
import { getPartnerGameProfile, getRelatedPartnerGameProfiles } from '@/src/data/partnerGameProfiles';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const profile = getPartnerGameProfile(slug);
  if (!profile) return {};
  const ogImage = `/og/game/${profile.slug}`;
  return {
    title: profile.title,
    description: profile.description,
    alternates: { canonical: canonical(`/more-free-games/${profile.slug}`) },
    openGraph: {
      title: profile.title,
      description: profile.description,
      url: canonical(`/more-free-games/${profile.slug}`),
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${profile.title} on GR8 GAMZ` }]
    },
    twitter: {
      card: 'summary_large_image',
      title: profile.title,
      description: profile.description,
      images: [ogImage]
    }
  };
}

export default async function PartnerProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const profile = getPartnerGameProfile(slug);
  if (!profile) notFound();
  const text = tr('en');

  const related = getRelatedPartnerGameProfiles(profile, 6);
  const playPath = profile.playPath || `${profile.path}/play`;
  const categoryPath = `/categories/${slugifyRegistryValue(profile.category)}`;
  const controls = profile.controls || 'Use the on-screen instructions after the game opens.';
  const deviceFit = profile.deviceFit || 'Phone, tablet and desktop support depends on the loaded game.';
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: canonical('/') },
      { '@type': 'ListItem', position: 2, name: 'GR8 Select', item: canonical('/gr8-select') },
      { '@type': 'ListItem', position: 3, name: profile.category, item: canonical(categoryPath) },
      { '@type': 'ListItem', position: 4, name: profile.title, item: canonical(profile.path) }
    ]
  };
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: profile.title,
    description: profile.description,
    url: canonical(profile.path),
    gamePlatform: 'Web browser',
    genre: profile.category,
    provider: {
      '@type': 'Organization',
      name: 'GR8 GAMZ'
    }
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/gr8-select">GR8 Select</Link>
        <span>/</span>
        <Link href={categoryPath}>{profile.category}</Link>
        <span>/</span>
        <span>{profile.title}</span>
      </nav>
      <section className="partner-profile-hero">
        <div className="partner-profile-copy">
          <span className="eyebrow">GR8 Select</span>
          <h1>{profile.title}</h1>
          <p>{profile.description}</p>
          <div className="cta-row profile-cta-row">
            <Link href={playPath} className="cta">Play</Link>
            <Link href={categoryPath} className="secondary-cta">{profile.category} games</Link>
          </div>
        </div>
        <PartnerArtwork src={profile.image} title={profile.title} category={profile.category} priority variant="profile" sizes="(max-width: 900px) 92vw, 640px" />
        <dl className="fact-list profile-facts">
          <div><dt>Category</dt><dd>{profile.category}</dd></div>
          <div><dt>Best for</dt><dd>{profile.bestFor}</dd></div>
          <div><dt>Controls</dt><dd>{controls}</dd></div>
          <div><dt>Device fit</dt><dd>{deviceFit}</dd></div>
          {profile.lastChecked ? <div><dt>Checked</dt><dd>{new Date(profile.lastChecked).toLocaleDateString('en-GB')}</dd></div> : null}
        </dl>
      </section>
      <section className="content-panel">
        <h2>How to start</h2>
        <p>{profile.howToPlay || controls}</p>
        <h2>Why you might like it</h2>
        <p>{profile.whyPicked || `${profile.title} is a ${profile.category.toLowerCase()} game for quick browser play on GR8 GAMZ.`}</p>
        <p className="fine-print">The game loads only after you select Play.</p>
      </section>
      <GameShare
        title={profile.title}
        url={canonical(profile.path)}
        text={`Find your next game with ${profile.title} on GR8 GAMZ.`}
        labels={text.engagement}
      />
      <ChallengeShare gameSlug={profile.slug} gameTitle={profile.title} kind="select" labels={text.engagement} />
      <section className="section-heading">
        <span className="eyebrow">Play next</span>
        <h2>Related games.</h2>
      </section>
      <section className="partner-grid">
        {related.map((item: PartnerGameProfile) => <PartnerGameCard key={item.slug} profile={item} />)}
      </section>
    </main>
  );
}
