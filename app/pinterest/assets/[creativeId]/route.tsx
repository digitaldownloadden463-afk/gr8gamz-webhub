import { ImageResponse } from 'next/og';
import { getPinterestCreative } from '@/lib/pinterest/core';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const contentType = 'image/png';
export const size = { width: 1000, height: 1500 };

type RouteProps = { params: Promise<{ creativeId: string }> };

const palettes = {
  'direct-game-challenge': { accent: '#35ff8d', accent2: '#49d7ff', panel: '#081b18' },
  'quick-browser-game': { accent: '#ffd43b', accent2: '#ff4fd8', panel: '#211707' },
  'category-discovery': { accent: '#49d7ff', accent2: '#35ff8d', panel: '#071824' },
  'play-when-bored': { accent: '#ff4fd8', accent2: '#ffd43b', panel: '#241025' },
} as const;

export async function GET(request: Request, { params }: RouteProps) {
  const { creativeId } = await params;
  const creative = getPinterestCreative(creativeId);
  if (!creative) {
    return new Response('Not found', {
      status: 404,
      headers: { 'x-robots-tag': 'noindex, nofollow' },
    });
  }
  const palette = palettes[creative.family];
  const requestOrigin = new URL(request.url);
  const requestHost = request.headers.get('host');
  if (requestHost) requestOrigin.host = requestHost;
  const artwork = new URL(creative.artworkPath, requestOrigin).toString();
  const logo = new URL('/brand/gr8-gamz-logo-mark.png', requestOrigin).toString();
  const isCollection =
    creative.family === 'category-discovery' || creative.family === 'play-when-bored';

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        padding: 72,
        background: `linear-gradient(155deg, #050507 0%, ${palette.panel} 62%, #050507 100%)`,
        color: '#ffffff',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: -120,
          top: 280,
          width: 1240,
          height: 7,
          background: palette.accent,
          transform: 'rotate(-7deg)',
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -100,
          top: 310,
          width: 1240,
          height: 3,
          background: palette.accent2,
          transform: 'rotate(-7deg)',
          opacity: 0.7,
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 92,
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo}
            alt=""
            width={72}
            height={72}
            style={{ width: 72, height: 72, objectFit: 'contain' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{ fontSize: 34, fontWeight: 900, color: palette.accent, letterSpacing: 1 }}
            >
              GR8 GAMZ
            </span>
            <span style={{ fontSize: 20, color: '#c7d3df' }}>Free browser games</span>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            padding: '12px 18px',
            border: `2px solid ${palette.accent}`,
            borderRadius: 8,
            fontSize: 20,
            fontWeight: 800,
            color: palette.accent,
          }}
        >
          {isCollection ? 'GAME COLLECTION' : 'GR8 ORIGINAL'}
        </div>
      </div>

      <div
        style={{ display: 'flex', flexDirection: 'column', position: 'relative', marginTop: 88 }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 72,
            lineHeight: 1.02,
            fontWeight: 900,
            maxWidth: 820,
            letterSpacing: 0,
          }}
        >
          {creative.hook}
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 24,
            fontSize: 28,
            lineHeight: 1.35,
            color: '#d7e1ea',
            maxWidth: 760,
          }}
        >
          {creative.destinationTitle} on GR8 GAMZ
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          position: 'relative',
          marginTop: 54,
          width: 856,
          height: 560,
          border: '3px solid rgba(255,255,255,0.22)',
          borderRadius: 8,
          overflow: 'hidden',
          background: '#0b0c10',
          boxShadow: '0 34px 90px rgba(0,0,0,0.5)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={artwork}
          alt=""
          width={856}
          height={560}
          style={{
            width: 856,
            height: 560,
            objectFit: isCollection ? 'contain' : 'cover',
            padding: isCollection ? 112 : 0,
          }}
        />
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 112,
            alignItems: 'center',
            padding: '0 32px',
            background: 'rgba(5,5,7,0.88)',
            fontSize: 26,
            fontWeight: 800,
            color: '#ffffff',
          }}
        >
          {creative.family === 'direct-game-challenge'
            ? 'Open the game and try the challenge'
            : 'Choose a game and play in your browser'}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: 'auto',
          gap: 18,
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', width: 230, height: 6, background: palette.accent }} />
        <div style={{ display: 'flex', fontSize: 30, fontWeight: 800 }}>Play free at GR8 GAMZ</div>
        <div style={{ display: 'flex', fontSize: 21, color: '#aebbc8' }}>
          No download required. Privacy choices stay in your control.
        </div>
      </div>
    </div>,
    {
      ...size,
      headers: {
        'cache-control': 'public, max-age=31536000, immutable',
        'x-robots-tag': 'noindex, nofollow',
      },
    }
  );
}
