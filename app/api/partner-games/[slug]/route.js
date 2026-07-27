import { NextResponse } from 'next/server';
import { getPartnerGameProfile } from '../../../../src/data/partnerGameProfiles';
import { resolvePartnerGame } from '../../../../src/lib/partnerFeedResolver';

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
      profile
    }, { status: 502 });
  }
}
