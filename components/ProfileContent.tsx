'use client';

import Link from 'next/link';
import { BadgeCheck, Gamepad2, Trophy } from 'lucide-react';

type ProfileContentProps = {
  compact?: boolean;
  className?: string;
};

export function ProfileContent({ compact = false, className = '' }: ProfileContentProps) {
  return (
    <section className={`profile-content ${className}`} style={{ border: '1px solid rgba(255,255,255,.1)', borderRadius: 24, padding: compact ? 18 : 28, background: 'rgba(255,255,255,.04)' }}>
      <span style={{ color: '#35ff8d', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.08em' }}>Player profile</span>
      <h1 style={{ color: '#fff', fontSize: compact ? '2rem' : 'clamp(2.6rem, 7vw, 5rem)', lineHeight: .92, letterSpacing: '-.08em', margin: '12px 0' }}>My Arcade profile</h1>
      <p style={{ color: '#a1a1aa', lineHeight: 1.6 }}>The GR8 Passport profile layer is ready for saved games, XP, badges and account sync.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10, margin: '20px 0' }}>
        <div><Gamepad2 color="#35ff8d" /><strong style={{ display: 'block', color: '#fff' }}>Saved games</strong></div>
        <div><Trophy color="#35ff8d" /><strong style={{ display: 'block', color: '#fff' }}>Badges</strong></div>
        <div><BadgeCheck color="#35ff8d" /><strong style={{ display: 'block', color: '#fff' }}>XP</strong></div>
      </div>
      <Link href="/auth" style={{ color: '#07110b', background: '#35ff8d', borderRadius: 999, padding: '10px 14px', textDecoration: 'none', fontWeight: 950 }}>Open account</Link>
    </section>
  );
}

export default ProfileContent;
