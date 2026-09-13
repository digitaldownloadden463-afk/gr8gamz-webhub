'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';
import type { ToolId } from '@/lib/gr8Tools';

export function ToolViewTracker({ toolId }: { toolId: ToolId | 'tools-hub' }) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = trackEvent('tool_view', { tool_id: toolId });
  }, [toolId]);
  return null;
}

export function RelatedToolLink({ href, name, description, toolId }: { href: string; name: string; description: string; toolId: ToolId }) {
  return (
    <Link href={href} onClick={() => trackEvent('related_tool_click', { tool_id: toolId, source_surface: 'tool-related' })}>
      <strong>{name}</strong>
      <span>{description}</span>
    </Link>
  );
}
