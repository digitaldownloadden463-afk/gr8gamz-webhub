'use client';

import Link from 'next/link';
import { Gamepad2 } from 'lucide-react';

type TopNavProps = {
  compact?: boolean;
  className?: string;
};

export function TopNav({ compact = false, className = '' }: TopNavProps) {
  return (
    <header className={`top-nav ${compact ? 'top-nav--compact' : ''} ${className}`} style={{ position: 'sticky', top: 0, zIndex: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, padding: compact ? '12px 18px' : '16px 24px', borderBottom: '1px solid rgba(255,255,255,.09)', background: 'rgba(5,5,7,.88)', backdropFilter: 'blur(14px)' }}>
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: '#fff', textDecoration: 'none', fontWeight: 950 }}><Gamepad2 color="#35ff8d" /> GR8 GAMZ</Link>
      <nav style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <Link href="/games" style={{ color: '#e5e7eb', textDecoration: 'none', fontWeight: 800 }}>Games</Link>
        <Link href="/top-games" style={{ color: '#e5e7eb', textDecoration: 'none', fontWeight: 800 }}>Top Games</Link>
        <Link href="/community" style={{ color: '#e5e7eb', textDecoration: 'none', fontWeight: 800 }}>Clubhouse</Link>
        <Link href="/auth" style={{ color: '#35ff8d', textDecoration: 'none', fontWeight: 900 }}>Passport</Link>
      </nav>
    </header>
  );
}

export default TopNav;
