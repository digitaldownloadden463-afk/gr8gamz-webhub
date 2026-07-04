'use client';

import Link from 'next/link';
import { UserRound, BadgeCheck, Flame } from 'lucide-react';

type PlayerPanelProps = {
  compact?: boolean;
  className?: string;
};

export function PlayerPanel({ compact = false, className = '' }: PlayerPanelProps) {
  return (
    <section className={`player-panel ${compact ? 'player-panel--compact' : ''} ${className}`} style={{ border: '1px solid rgba(53,255,141,.2)', borderRadius: 24, padding: compact ? 16 : 22, background: 'linear-gradient(135deg, rgba(53,255,141,.12), rgba(124,92,255,.08))' }}>
      <span style={{ color: '#35ff8d', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.08em' }}>GR8 Passport</span>
      <h2 style={{ margin: '10px 0', color: '#fff', fontSize: compact ? '1.6rem' : '2.2rem', letterSpacing: '-.05em' }}>Build your player identity.</h2>
      <p style={{ color: '#a1a1aa', lineHeight: 1.55 }}>Save games, collect XP, unlock badges and return for daily missions.</p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
        <Link href="/passport" style={{ color: '#07110b', background: '#35ff8d', borderRadius: 999, padding: '10px 14px', textDecoration: 'none', fontWeight: 950 }}><UserRound size={16} /> Passport</Link>
        <Link href="/my-arcade" style={{ color: '#fff', border: '1px solid rgba(255,255,255,.14)', borderRadius: 999, padding: '10px 14px', textDecoration: 'none', fontWeight: 900 }}><BadgeCheck size={16} /> My Arcade</Link>
        <Link href="/daily-challenge" style={{ color: '#fff', border: '1px solid rgba(255,255,255,.14)', borderRadius: 999, padding: '10px 14px', textDecoration: 'none', fontWeight: 900 }}><Flame size={16} /> Daily</Link>
      </div>
    </section>
  );
}

export default PlayerPanel;
