import { isSafeGamePixUrl } from '@/src/data/gamepix';
import { isSafeGameMonetizeUrl } from '@/src/data/gamemonetize';

export async function resolvePartnerGame(profile) {
  const provider = profile?.provider === 'gamemonetize' ? 'gamemonetize' : 'gamepix';
  const playUrl = String(profile?.playUrl || '');
  const safe = provider === 'gamemonetize' ? isSafeGameMonetizeUrl(playUrl) : isSafeGamePixUrl(playUrl);
  return {
    resolved: {
      found: Boolean(playUrl && safe),
      provider,
      title: profile?.title || '',
      category: profile?.category || 'Arcade',
      url: safe ? playUrl : '',
      width: Number.parseInt(String(profile?.width || '960'), 10) || 960,
      height: Number.parseInt(String(profile?.height || '540'), 10) || 540
    }
  };
}
