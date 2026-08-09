'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useConsentChoice } from '@/lib/consentPreferences';
import { adsenseConfig } from '@/lib/ads/config';
import { getAdPolicy } from '@/lib/ads/adPolicy';

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

type AdSenseSlotProps = {
  slot: string;
  placement: string;
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
  const policy = getAdPolicy(pathname);
  const allowed = adsenseConfig.enabled
    && consent === 'accepted'
    && policy.manualSlots.includes(placement)
    && /^\d{6,20}$/.test(slot);

  useEffect(() => {
    if (!allowed || initialized.current) return;
    initialized.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      initialized.current = false;
    }
  }, [allowed]);

  if (!allowed) return null;

  return (
    <aside
      className={`adsense-slot ${className}`.trim()}
      aria-label="Advertisement"
      data-ad-placement={placement}
      style={{ minHeight }}
    >
      <span className="adsense-slot__label">Advertisement</span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adsenseConfig.accountId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </aside>
  );
}
