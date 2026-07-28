import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'GR8 GAMZ challenge card';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function GET() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', overflow: 'hidden', background: 'radial-gradient(circle at 20% 20%, rgba(53,255,141,.28), transparent 320px), linear-gradient(135deg, #050507, #160f2e)', color: 'white', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ position: 'absolute', left: -80, right: -80, top: 320, height: 5, background: 'linear-gradient(90deg, transparent, #35ff8d, #49d7ff, #ff4fd8, transparent)', transform: 'rotate(-8deg)', boxShadow: '0 0 42px #49d7ff' }} />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 78, gap: 24 }}>
          <div style={{ color: '#35ff8d', fontWeight: 900, fontSize: 32, letterSpacing: 3 }}>GR8 CHALLENGE</div>
          <div style={{ fontSize: 82, lineHeight: .92, fontWeight: 900, letterSpacing: -3 }}>Can you beat it?</div>
          <div style={{ color: '#c3d0df', fontSize: 32 }}>Play the challenge on GR8 GAMZ.</div>
        </div>
      </div>
    ),
    size
  );
}
