'use client';

import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';

export default function GameHubLink({ href, hubId, sourceSurface, children, className }: { href: string; hubId: string; sourceSurface: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackEvent('related_hub_selected', { hub_id: hubId, source_surface: sourceSurface })}
    >
      {children}
    </Link>
  );
}
