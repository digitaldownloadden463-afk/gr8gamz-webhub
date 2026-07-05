export const dynamic = 'force-dynamic';

import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Play } from 'lucide-react';
import PartnerGameCard from '@/components/PartnerGameCard';
import type { PartnerGameProfile } from '@/components/PartnerGameCard';
import {
  getPartnerGameProfile,
  getRelatedPartnerGameProfiles
} from '@/src/data/partnerGameProfiles';
import { resolvePartnerGame } from '@/src/lib/partnerFeedResolver';

type PageProps = { params: { slug: string } };

export function generateMetadata({ params }: PageProps) {
  const profile = getPartnerGameProfile(params.slug);
  return {
    title: profile ? `Play ${profile.title} | GR8 GAMZ` : 'Play Partner Game | GR8 GAMZ',
    description: 'Launch a partner-powered browser game through the GR8 Game Network.',
    robots: { index: false, follow: true }
  };
}

export default async function PartnerPlayPage({ params }: PageProps) {
  const profile = getPartnerGameProfile(params.slug);

  if (!profile) {
    return (
      <main>
        <section className="page-title">
          <span className="eyebrow">Not found</span>
          <h1>This play route is not active.</h1>
          <Link href="/more-free-games" className="cta">More Free Games</Link>
        </section>
      </main>
    );
  }

  let resolved = null;
  try {
    resolved = await resolvePartnerGame(profile);
  } catch {
    resolved = null;
  }

  const live = resolved?.resolved;
  const safe = Boolean(live?.found && live?.url);
  const liveUrl = live?.url || '';
  const related = getRelatedPartnerGameProfiles(profile, 6);

  return (
    <main>
      <section className="page-title partner-play-title">
        <span className="eyebrow">GR8 Game Network</span>
        <h1>Play {profile.title}</h1>
        <p>{profile.bestFor}. If the live feed is warming up, GR8 GAMZ keeps the player inside the network with related games ready underneath.</p>
      </section>

      {safe ? (
        <section className="partner-player">
          <iframe
            title={profile.title}
            src={liveUrl}
            allow="autoplay; fullscreen; gamepad; clipboard-read; clipboard-write"
            allowFullScreen
            loading="eager"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </section>
      ) : (
        <section className="partner-feed-fallback">
          <Image src={profile.image} alt={`${profile.title} artwork`} width={900} height={506} priority />
          <div>
            <span className="eyebrow">Partner feed pending</span>
            <h2>{profile.title} is queued for play.</h2>
            <p>The branded profile is live, but the partner feed did not return a safe playable URL in this check. Players still get a strong route into the network instead of a blank page.</p>
            <div className="cta-row">
              <Link href={profile.path} className="cta"><Play size={20} aria-hidden="true" /> Game profile</Link>
              <Link href="/more-free-games" className="secondary-cta"><ExternalLink size={20} aria-hidden="true" /> More games</Link>
            </div>
          </div>
        </section>
      )}

      <section className="section-heading">
        <span className="eyebrow">After this game</span>
        <h2>Keep players moving to another partner pick.</h2>
      </section>
      <section className="partner-grid">
        {related.map((item: PartnerGameProfile) => <PartnerGameCard key={item.slug} profile={item} />)}
      </section>
    </main>
  );
}
