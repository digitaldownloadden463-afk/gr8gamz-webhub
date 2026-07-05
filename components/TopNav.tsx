'use client';

import Link from 'next/link';
import { Gamepad2, Trophy, UsersRound, UserRound } from 'lucide-react';

type TopNavProps = {
  compact?: boolean;
  className?: string;
};

export function TopNav({ compact = false, className = '' }: TopNavProps) {
  return (
    <header className={`top-nav ${compact ? 'top-nav--compact' : ''} ${className}`}>
      <Link href="/" className="brand-mark" aria-label="GR8 GAMZ home">
        <Gamepad2 size={30} aria-hidden="true" />
        <span>GR8 GAMZ</span>
      </Link>
      <nav className="nav-links" aria-label="Primary navigation">
        <Link href="/games">
          <Gamepad2 size={18} aria-hidden="true" />
          Games
        </Link>
        <Link href="/top-games">
          <Trophy size={18} aria-hidden="true" />
          Top
        </Link>
        <Link href="/community">
          <UsersRound size={18} aria-hidden="true" />
          Clubhouse
        </Link>
        <Link href="/auth" className="nav-cta">
          <UserRound size={18} aria-hidden="true" />
          Passport
        </Link>
      </nav>
    </header>
  );
}

export default TopNav;
