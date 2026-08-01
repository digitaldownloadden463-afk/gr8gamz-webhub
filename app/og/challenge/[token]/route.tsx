import { ImageResponse } from 'next/og';
import { canonical } from '@/lib/features';
import { tr } from '@/lib/i18n';
import { resolveChallengeGame, verifyChallenge } from '@/lib/challenge';

export const runtime = 'nodejs';
export const alt = 'GR8 GAMZ challenge card';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

type RouteProps = { params: Promise<{ token: string }> };

function supportedOgImage(src: string | null | undefined) {
  if (!src) return null;
  const pathname = src.split('?')[0]?.toLowerCase() || '';
  if (!/\.(png|jpe?g)$/i.test(pathname)) return null;
  return canonical(src);
}

export async function GET(_request: Request, { params }: RouteProps) {
  const { token } = await params;
  const challenge = verifyChallenge(token);
  const game = challenge ? resolveChallengeGame(challenge.game, challenge.kind) : null;
  if (!challenge || !game) return new Response('Not found', { status: 404 });
  const text = tr(challenge.locale).engagement;
  const headline = challenge.score > 0 ? `${text.sharedScore}: ${challenge.score.toLocaleString()}` : text.challengeInviteTitle.replace('{title}', game.title);
  const subline = game ? `${game.title} on GR8 GAMZ` : 'Play the challenge on GR8 GAMZ.';
  const image = supportedOgImage(game?.image);

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', overflow: 'hidden', background: 'radial-gradient(circle at 20% 20%, rgba(53,255,141,.28), transparent 320px), linear-gradient(135deg, #050507, #160f2e)', color: 'white', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ position: 'absolute', left: -80, right: -80, top: 320, height: 5, background: 'linear-gradient(90deg, transparent, #35ff8d, #49d7ff, #ff4fd8, transparent)', transform: 'rotate(-8deg)', boxShadow: '0 0 42px #49d7ff' }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {image ? <img src={image} alt="" width={410} height={285} style={{ position: 'absolute', right: 70, top: 94, width: 410, height: 285, objectFit: 'cover', borderRadius: 28, border: '2px solid rgba(255,255,255,.22)', boxShadow: '0 30px 90px rgba(0,0,0,.55)' }} /> : null}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 78, gap: 24 }}>
          <div style={{ color: '#35ff8d', fontWeight: 900, fontSize: 32, letterSpacing: 3 }}>GR8 CHALLENGE</div>
          <div style={{ fontSize: 82, lineHeight: .92, fontWeight: 900, letterSpacing: -3 }}>{headline}</div>
          <div style={{ color: '#c3d0df', fontSize: 32 }}>{subline}</div>
        </div>
      </div>
    ),
    size
  );
}
