'use client';

import AdSenseResponsiveSlot from './AdSenseResponsiveSlot';
import { adPlacements, type AdPlacementId } from '@/lib/ads/placements';

export default function AdSensePlacement({ placement }: { placement: AdPlacementId }) {
  const config = adPlacements[placement];
  return (
    <AdSenseResponsiveSlot
      slot={config.slot}
      placement={placement}
      minHeight={config.minHeight}
      className="adsense-slot--manual"
    />
  );
}
