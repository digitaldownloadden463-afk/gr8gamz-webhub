'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

type PlayerPanelProps = {
  children?: ReactNode;
  compact?: boolean;
  className?: string;
};

/**
 * PlayerPanel displays player profile and session information.
 * Used on the homepage to show GR8 Passport status and quick actions.
 */
export function PlayerPanel({ children, compact = false, className = '' }: PlayerPanelProps) {
  return (
    <section
      className={`player-panel ${compact ? 'player-panel--compact' : ''} ${className}`}
      style={{
        border: '1px solid rgba(255,255,255,.1)',
        borderRadius: 22,
        padding: compact ? 14 : 18,
        background: 'rgba(255,255,255,.04)',
      }}
    >
      <strong style={{ display: 'block', marginBottom: 12 }}>Your Arcade</strong>
      <div style={{ display: 'grid', gap: 10 }}>
        {children || (
          <>
            <div style={{ color: '#a1a1aa', lineHeight: 1.55 }}>
              <p style={{ margin: 0 }}>No GR8 Passport yet</p>
              <Link
                href="/auth"
                style={{ color: '#35ff8d', fontWeight: 900, textDecoration: 'none' }}
              >
                Create one to save progress
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default PlayerPanel;
