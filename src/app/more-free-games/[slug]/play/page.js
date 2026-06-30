export const dynamic = 'force-dynamic';

import Link from 'next/link';
import PartnerProfileGrid from '../../../../components/partner/PartnerProfileGrid';
import PartnerRetentionPanel from '../../../../components/partner/PartnerRetentionPanel';
import { getPartnerGameProfile, getRelatedPartnerGameProfiles } from '../../../../data/partnerGameProfiles';
import { resolvePartnerGame } from '../../../../lib/partnerFeedResolver';
import { buildPageMetadata } from '../../../../lib/seo';

export function generateMetadata({ params }) {
  const profile = getPartnerGameProfile(params.slug);
  return buildPageMetadata({
    title: `${profile?.title || 'Partner Game'} - Play Now`,
    description: 'Play a partner-powered free browser game through the GR8 Game Network.',
    path: profile?.playPath || `/more-free-games/${params.slug}/play`,
    noIndex: true
  });
}

export default async function PartnerGamePlayPage({ params }) {
  const profile = getPartnerGameProfile(params.slug);
  const relatedProfiles = profile ? getRelatedPartnerGameProfiles(profile, 6) : [];
  if (!profile) {
    return (
      <main>
        <div className="page-title"><h1>Partner game not found.</h1><p>Return to More Free Games to keep playing.</p></div>
        <Link href="/more-free-games" className="secondary-cta">More Free Games</Link>
      </main>
    );
  }

  let payload = null;
  try {
    payload = await resolvePartnerGame(profile);
  } catch {
    payload = null;
  }

  const live = payload?.resolved || {};
  const safe = Boolean(live.found && live.url);
  const width = Number.parseInt(live.width || '960', 10) || 960;
  const height = Number.parseInt(live.height || '540', 10) || 540;
  const ratio = Math.max(0.45, Math.min(1.8, height / width));

  return (
    <main>
      <div className="page-title compact-title partner-play-title">
        <span className="eyebrow">GR8 Game Network</span>
        <h1>Play {profile.title}</h1>
        <p>
          This noindex play screen connects the GR8-branded game profile to the intended partner game feed while keeping the public search journey focused on GR8 GAMZ.
        </p>
      </div>

      <div className="gamepix-play-actions">
        <Link href={profile.path} className="soft-link">← Back to {profile.title} profile</Link>
        <Link href="/more-free-games" className="soft-link">More Free Games</Link>
        <Link href="/original-games" className="soft-link">GR8 Originals</Link>
      </div>

      {safe ? (
        <section className="gamepix-player partner-branded-player" style={{ '--gamepix-ratio': ratio }}>
          <iframe
            title={profile.title}
            src={live.url}
            allow="autoplay; fullscreen; gamepad; clipboard-read; clipboard-write"
            allowFullScreen
            loading="eager"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </section>
      ) : (
        <section className="content-panel warning-panel partner-feed-warning">
          <h2>The live partner game feed is not connecting yet</h2>
          <p>
            The GR8 profile page is live, but the partner feed did not return a safe playable URL for {profile.title} at this moment. Keep the player inside the GR8 network while the feed refreshes.
          </p>
          <div className="hero-actions compact-actions">
            <Link href="/more-free-games" className="hero-cta">More Free Games</Link>
            <Link href="/hot-picks" className="secondary-cta">Hot Picks</Link>
          </div>
        </section>
      )}

      <PartnerRetentionPanel fallbackProfiles={relatedProfiles.slice(0, 4)} showFallback={true} maxItems={4} title="Keep playing after this game." />

      <PartnerProfileGrid
        profiles={relatedProfiles}
        eyebrow="Play next"
        title="More games after this one."
        description="The next-click rail keeps players inside GR8 GAMZ after every partner game session."
      />

      <section className="content-panel affiliate-note">
        <h2>Partner game notice</h2>
        <p>
          {profile.title} is presented through the GR8 Game Network. The indexable profile page stays branded to GR8 GAMZ; this play route is kept out of Google indexing because it exists for gameplay, not search landing traffic.
        </p>
      </section>
    </main>
  );
}
