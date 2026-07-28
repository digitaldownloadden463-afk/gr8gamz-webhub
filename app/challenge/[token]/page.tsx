import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { canonical } from '@/lib/features';
import { verifyChallenge } from '@/lib/challenge';
import { getGameBySlug } from '@/lib/games';

type PageProps = { params: Promise<{ token: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params;
  const challenge = verifyChallenge(token);
  const game = challenge ? getGameBySlug(challenge.game) : null;
  if (!challenge || !game) {
    return { title: 'Challenge unavailable', robots: { index: false, follow: true } };
  }
  const url = canonical(`/challenge/${token}`);
  const image = `/og/challenge/${token}`;
  const title = `Beat ${challenge.score.toLocaleString()} on ${game.name}`;
  const description = `Can you beat this GR8 GAMZ score? Open ${game.name} and take the challenge.`;
  return {
    title,
    description,
    robots: { index: false, follow: true },
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: `${game.name} challenge` }]
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
  const game = challenge ? getGameBySlug(challenge.game) : null;
  if (!challenge || !game) notFound();

  return (
    <main>
      <section className="page-title">
        <span className="eyebrow">GR8 Challenge</span>
        <h1>Beat {challenge.score.toLocaleString()} on {game.name}.</h1>
        <p>Open the game, chase the score and share your own run when you beat it.</p>
        <div className="cta-row">
          <Link href={`/arcade/${game.slug || game.id}`} className="cta">Play challenge</Link>
          <Link href="/gr8-daily" className="secondary-cta">Daily pick</Link>
        </div>
      </section>
    </main>
  );
}
