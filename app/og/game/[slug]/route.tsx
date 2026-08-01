import { ImageResponse } from 'next/og';
import { canonical } from '@/lib/features';
import { getGameBySlug } from '@/lib/games';
import { getPartnerGameProfile } from '@/src/data/partnerGameProfiles';

export const runtime = 'edge';
export const alt = 'GR8 GAMZ game card';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

type RouteProps = { params: Promise<{ slug: string }> };

function supportedOgImage(src: string | null | undefined) {
  if (!src) return null;
  const pathname = src.split('?')[0]?.toLowerCase() || '';
  if (!/\.(png|jpe?g)$/i.test(pathname)) return null;
  return canonical(src);
}

export async function GET(_request: Request, { params }: RouteProps) {
  const { slug } = await params;
  const original = getGameBySlug(slug);
  const partner = getPartnerGameProfile(slug);
  if (!original && !partner) return new Response('Not found', { status: 404 });
  const title = original?.name || partner?.title || 'GR8 GAMZ';
  const collection = original ? 'GR8 Originals' : 'GR8 Select';
  const category = original?.category || original?.genre || partner?.category || 'Browser game';
  const artwork = original?.thumbnail || original?.image || partner?.image;
  const image = supportedOgImage(artwork);

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #050507 0%, #160f2e 52%, #041008 100%)', color: 'white', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(5,5,7,.94), rgba(5,5,7,.32))' }} />
        <div style={{ position: 'absolute', left: -160, top: 100, width: 920, height: 4, background: 'linear-gradient(90deg, transparent, #35ff8d, #49d7ff, transparent)', transform: 'rotate(-10deg)', boxShadow: '0 0 36px #49d7ff' }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {image ? <img src={image} alt="" width={440} height={300} style={{ position: 'absolute', right: 56, top: 86, width: 440, height: 300, objectFit: 'cover', borderRadius: 28, border: '2px solid rgba(255,255,255,.22)', boxShadow: '0 30px 90px rgba(0,0,0,.55)' }} /> : null}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 72, gap: 28, width: 760 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 30, fontWeight: 900, color: '#35ff8d', letterSpacing: 3 }}>GR8 GAMZ</div>
          <div style={{ fontSize: 86, lineHeight: .92, fontWeight: 900, letterSpacing: -3 }}>{title}</div>
          <div style={{ display: 'flex', gap: 14, fontSize: 28, color: '#c3d0df' }}>
            <span>{collection}</span>
            <span>{category}</span>
            <span>Play and share</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
