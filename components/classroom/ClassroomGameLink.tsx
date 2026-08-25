'use client';

import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';

export default function ClassroomGameLink({ href, slug, section, className, children }: {
  href: string;
  slug: string;
  section: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackEvent('classroom_game_selected', {
        game_slug: slug,
        classroom_section: section,
        locale: 'en'
      })}
    >
      {children}
    </Link>
  );
}
