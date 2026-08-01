import type { Metadata } from 'next';
import Link from 'next/link';
import ChallengeOpenRecorder from '@/components/ChallengeOpenRecorder';
import { canonical } from '@/lib/features';
import { localizedCanonical, localeInfo, pathForLocale, tr } from '@/lib/i18n';
import { resolveChallengeGame, verifyChallenge } from '@/lib/challenge';

type PageProps = { params: Promise<{ token: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params;
  const challenge = verifyChallenge(token);
  const game = challenge ? resolveChallengeGame(challenge.game, challenge.kind) : null;
  if (!challenge || !game) {
    const text = tr('en').engagement;
    return {
      title: text.challengeInvalidTitle,
      description: text.challengeInvalidBody,
      robots: { index: false, follow: true },
      alternates: { canonical: canonical('/gr8-daily') }
    };
  }
  const image = `/og/challenge/${token}`;
  const text = tr(challenge.locale).engagement;
  const title = challenge.score > 0
    ? text.challengeBeatTitle.replace('{score}', challenge.score.toLocaleString()).replace('{title}', game.title)
    : text.challengeInviteTitle.replace('{title}', game.title);
  const description = challenge.score > 0 ? text.challengeBeatBody : text.challengeInviteBody;
  return {
    title,
    description,
    robots: { index: false, follow: true },
    alternates: { canonical: localizedCanonical(challenge.locale, game.path) },
    openGraph: {
      title,
      description,
      url: canonical(`/challenge/${token}`),
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: `${game.title} challenge` }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image]
    }
  };
}

export default async function ChallengePage({ params }: PageProps) {
  const { token } = await params;
  const challenge = verifyChallenge(token);
  const game = challenge ? resolveChallengeGame(challenge.game, challenge.kind) : null;
  if (!challenge || !game) {
    const text = tr('en').engagement;
    return (
      <main>
        <section className="page-title">
          <span className="eyebrow">{text.challengePageEyebrow}</span>
          <h1>{text.challengeInvalidTitle}</h1>
          <p>{text.challengeInvalidBody}</p>
          <div className="cta-row">
            <Link href="/gr8-daily" className="cta">{text.dailyPick}</Link>
            <Link href="/games" className="secondary-cta">Browse games</Link>
          </div>
        </section>
      </main>
    );
  }
  const text = tr(challenge.locale).engagement;
  const info = localeInfo(challenge.locale);
  const profileHref = pathForLocale(challenge.locale, game.path);
  const playHref = pathForLocale(challenge.locale, challenge.kind === 'select' && 'playPath' in game && game.playPath ? game.playPath : game.path);
  const challengeLabel = challenge.score > 0
    ? `${text.sharedScore}: ${challenge.score.toLocaleString()} - ${game.title}`
    : text.challengeInviteTitle.replace('{title}', game.title);

  return (
    <main lang={challenge.locale} dir={info.dir}>
      <ChallengeOpenRecorder slug={game.slug} kind={challenge.kind} url={canonical(`/challenge/${token}`)} label={challengeLabel} />
      <section className="page-title">
        <span className="eyebrow">{text.challengePageEyebrow}</span>
        <h1>{challenge.score > 0 ? text.challengeBeatTitle.replace('{score}', challenge.score.toLocaleString()).replace('{title}', game.title) : text.challengeInviteTitle.replace('{title}', game.title)}</h1>
        <p>{challenge.score > 0 ? `${text.challengeBeatBody} ${text.signatureNote}` : text.challengeInviteBody}</p>
        <div className="cta-row">
          <Link href={playHref} className="cta">{challenge.score > 0 ? text.challengeFriend : tr(challenge.locale).common.play}</Link>
          <Link href={profileHref} className="secondary-cta">{text.gameDetails}</Link>
          <Link href={pathForLocale(challenge.locale, '/gr8-daily')} className="secondary-cta">{text.dailyPick}</Link>
        </div>
      </section>
    </main>
  );
}
