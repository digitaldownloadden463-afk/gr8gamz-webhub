'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getPassportSnapshot } from '../../lib/passportClient';

export default function PassportNavBadge() {
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    function sync() {
      setSnapshot(getPassportSnapshot());
    }
    sync();
    window.addEventListener('gr8-passport-change', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('gr8-passport-change', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const passport = snapshot?.passport;
  if (!passport) {
    return <Link href="/passport" className="passport-nav-link">GR8 Passport</Link>;
  }

  return (
    <Link href="/my-arcade" className="passport-nav-link passport-nav-link-active" title="Open My Arcade">
      <span>{passport.avatar || '🕹️'}</span>
      <strong>{passport.username}</strong>
      <em>Lv {snapshot.level}</em>
    </Link>
  );
}
