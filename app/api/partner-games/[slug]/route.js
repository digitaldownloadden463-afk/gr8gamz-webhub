import { NextResponse } from 'next/server';
import { getPartnerGameProfile } from '../../../../src/data/partnerGameProfiles';
import { resolvePartnerGame } from '../../../../src/lib/partnerFeedResolver';

export const dynamic = 'force-dynamic';

export async function GET(_request, { params }) {
  const { slug } = await params;
  const profile = getPartnerGameProfile(slug);
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
  } catch {
    return NextResponse.json({
      ok: false,
      error: 'Unable to resolve live partner game data'
    }, { status: 502 });
  }
}
