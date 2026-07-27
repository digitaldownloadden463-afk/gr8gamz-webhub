import { NextResponse } from 'next/server';
import { registryJson } from '@/lib/gameRegistry';

export function GET() {
  return NextResponse.json(registryJson(), {
    headers: {
      'cache-control': 'public, max-age=300, s-maxage=3600'
    }
  });
}
