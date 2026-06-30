import { NextResponse } from 'next/server';
import { getPartnerGameProfile } from '../../../../data/partnerGameProfiles';
import { resolvePartnerGame } from '../../../../lib/partnerFeedResolver';

export const dynamic = 'force-dynamic';

export async function GET(_request, { params }) {
  const profile = getPartnerGameProfile(params.slug);
  if (!profile) {
    return NextResponse.json({ ok: false, error: 'Partner game profile not found' }, { status: 404 });
  }

  try {
    const result = await resolvePartnerGame(profile);
    return NextResponse.json({ ok: true, ...result }, {
      headers: {
        'cache-control': 'public, s-maxage=900, stale-while-revalidate=3600'
      }
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: 'Unable to resolve live partner game data',
      detail: error?.message || 'Unknown resolver error',
      profile: {
        title: profile.title,
        slug: profile.slug,
        path: profile.path,
        playPath: profile.playPath || `${profile.path}/play`,
        image: profile.image,
        provider: profile.provider,
        category: profile.category
      }
    }, { status: 502 });
  }
}
