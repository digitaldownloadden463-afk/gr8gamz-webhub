import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'GR8 GAMZ game card';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

type RouteProps = { params: Promise<{ slug: string }> };

function titleFromSlug(slug: string) {
  return slug
    .replace(/-/g, ' ')
    .replace(/\bio\b/gi, 'IO')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .slice(0, 72);
}

export async function GET(_request: Request, { params }: RouteProps) {
  const { slug } = await params;
  const title = titleFromSlug(slug) || 'GR8 GAMZ';

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #050507 0%, #160f2e 52%, #041008 100%)', color: 'white', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(5,5,7,.94), rgba(5,5,7,.32))' }} />
        <div style={{ position: 'absolute', left: -160, top: 100, width: 920, height: 4, background: 'linear-gradient(90deg, transparent, #35ff8d, #49d7ff, transparent)', transform: 'rotate(-10deg)', boxShadow: '0 0 36px #49d7ff' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 72, gap: 28, width: 820 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 30, fontWeight: 900, color: '#35ff8d', letterSpacing: 3 }}>GR8 GAMZ</div>
          <div style={{ fontSize: 86, lineHeight: .92, fontWeight: 900, letterSpacing: -3 }}>{title}</div>
          <div style={{ display: 'flex', gap: 14, fontSize: 28, color: '#c3d0df' }}>
            <span>GR8 Select</span>
            <span>Free browser play</span>
            <span>Play it. Master it. Share it.</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
