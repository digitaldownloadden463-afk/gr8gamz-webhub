import { pinterestFeedResponse } from '@/lib/pinterest/feedResponse';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export function GET() {
  return pinterestFeedResponse('mobile-games');
}
