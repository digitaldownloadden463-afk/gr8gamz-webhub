'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useConsentChoice } from '@/lib/consentPreferences';
import { adsenseConfig } from '@/lib/ads/config';
import { getAdPolicy } from '@/lib/ads/adPolicy';
import type { AdPlacementId } from '@/lib/ads/placements';

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

type AdSenseSlotProps = {
  slot: string;
  placement: AdPlacementId;
  className?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  minHeight?: number;
};

export default function AdSenseSlot({
  slot,
  placement,
  className = '',
  format = 'auto',
  responsive = true,
  minHeight = 180
}: AdSenseSlotProps) {
  const consent = useConsentChoice();
  const pathname = usePathname();
  const initialized = useRef(false);
  const adRef = useRef<HTMLModElement>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'filled' | 'unfilled' | 'error'>('idle');
  const policy = getAdPolicy(pathname);
  const allowed = adsenseConfig.enabled
    && consent === 'accepted'
    && policy.manualSlots.includes(placement)
    && /^\d{6,20}$/.test(slot);

  useEffect(() => {
    if (!allowed) {
      initialized.current = false;
      return;
    }
    if (initialized.current) return;
    initialized.current = true;
    const ad = adRef.current;
    const observer = ad && typeof MutationObserver !== 'undefined'
      ? new MutationObserver(() => {
          const next = ad.dataset.adStatus;
          if (next === 'filled' || next === 'unfilled') setStatus(next);
        })
      : null;
    observer?.observe(ad!, { attributes: true, attributeFilter: ['data-ad-status'] });
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      initialized.current = false;
      queueMicrotask(() => setStatus('error'));
    }
    return () => observer?.disconnect();
  }, [allowed]);

  if (!allowed) return null;

  return (
    <aside
      className={`adsense-slot ${className}`.trim()}
      aria-label="Advertisement"
      data-ad-placement={placement}
      data-ad-page-type={policy.pageType}
      data-ad-state={status === 'idle' ? 'loading' : status}
      style={{ minHeight }}
    >
      <span className="adsense-slot__label">Advertisement</span>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adsenseConfig.accountId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
        data-adtest={adsenseConfig.testMode ? 'on' : undefined}
      />
    </aside>
  );
}
