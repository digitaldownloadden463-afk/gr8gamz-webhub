import type { Metadata } from 'next';
import Link from 'next/link';
import { canonical } from '@/lib/features';
import { resolveChallengeGame, verifyChallenge } from '@/lib/challenge';

type PageProps = { params: Promise<{ token: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params;
  const challenge = verifyChallenge(token);
  const game = challenge ? resolveChallengeGame(challenge.game, challenge.kind) : null;
  if (!challenge || !game) {
    return {
      title: 'Challenge unavailable',
      description: 'This GR8 GAMZ challenge is expired or unavailable.',
      robots: { index: false, follow: true },
      alternates: { canonical: canonical('/gr8-daily') }
    };
  }
  const image = `/og/challenge/${token}`;
  const title = challenge.score > 0 ? `Beat ${challenge.score.toLocaleString()} on ${game.title}` : `Play ${game.title} on GR8 GAMZ`;
  const description = challenge.score > 0 ? `Can you beat this GR8 GAMZ score? Open ${game.title} and take the challenge.` : `A friend challenged you to try ${game.title} on GR8 GAMZ.`;
  return {
    title,
    description,
    robots: { index: false, follow: true },
    alternates: { canonical: canonical(game.path) },
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
    return (
      <main>
        <section className="page-title">
          <span className="eyebrow">GR8 Challenge</span>
          <h1>This challenge is unavailable.</h1>
          <p>The link may have expired or been changed. Pick a fresh game and create a new challenge when you are ready.</p>
          <div className="cta-row">
            <Link href="/gr8-daily" className="cta">Daily pick</Link>
            <Link href="/games" className="secondary-cta">Browse games</Link>
          </div>
        </section>
      </main>
    );
  }
  const playHref = challenge.kind === 'select' && 'playPath' in game && game.playPath ? game.playPath : game.path;

  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">GR8 Challenge</span>
        <h1>{challenge.score > 0 ? `Beat ${challenge.score.toLocaleString()} on ${game.title}.` : `You have been challenged to play ${game.title}.`}</h1>
        <p>{challenge.score > 0 ? 'Open the game, chase the score and share your own run when you beat it.' : 'Open the correct game and send your own challenge when you are ready.'}</p>
        <div className="cta-row">
          <Link href={playHref} className="cta">{challenge.score > 0 ? 'Beat this score' : 'Play now'}</Link>
          <Link href={game.path} className="secondary-cta">Game details</Link>
          <Link href="/gr8-daily" className="secondary-cta">Daily pick</Link>
        </div>
      </section>
    </main>
  );
}
