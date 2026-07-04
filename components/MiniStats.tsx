'use client';

import { Gamepad2, Star, Trophy, Zap } from 'lucide-react';
import type { ReactNode } from 'react';

type MiniStatsProps = {
  items?: Array<{ label?: ReactNode; value?: ReactNode; icon?: ReactNode }>;
  stats?: Record<string, ReactNode>;
  compact?: boolean;
  className?: string;
};

export function MiniStats({ items, stats, compact = false, className = '' }: MiniStatsProps) {
  const fallback = items || (stats ? Object.entries(stats).map(([label, value]) => ({ label, value })) : [
    { label: 'Games', value: '100+', icon: <Gamepad2 size={18} /> },
    { label: 'Hot picks', value: 'Daily', icon: <Zap size={18} /> },
    { label: 'Badges', value: 'Live', icon: <Trophy size={18} /> },
    { label: 'Rating', value: 'GR8', icon: <Star size={18} /> }
  ]);

  return (
    <div className={`mini-stats ${compact ? 'mini-stats--compact' : ''} ${className}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10 }}>
      {fallback.map((item, index) => (
        <div key={String(item.label ?? index)} style={{ border: '1px solid rgba(255,255,255,.1)', borderRadius: 18, padding: compact ? 10 : 14, background: 'rgba(255,255,255,.04)' }}>
          <span style={{ color: '#35ff8d' }}>{item.icon}</span>
          <strong style={{ display: 'block', color: '#fff', fontSize: compact ? '1rem' : '1.35rem' }}>{item.value}</strong>
          <small style={{ color: '#a1a1aa' }}>{item.label}</small>
        </div>
      ))}
    </div>
  );
}

export default MiniStats;
