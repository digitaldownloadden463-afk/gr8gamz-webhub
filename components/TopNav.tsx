'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSelector from '@/components/LanguageSelector';
import { defaultLocale, isLocale, pathForLocale, tr, type Locale } from '@/lib/i18n';

const links = [
  { href: '/', key: 'home' },
  { href: '/games', key: 'games' },
  { href: '/gr8-originals', key: 'originals' },
  { href: '/gr8-select', key: 'select' },
  { href: '/gr8-trending', key: 'trending' },
  { href: '/gr8-daily', key: 'daily' },
  { href: '/new-games', key: 'new' },
  { href: '/my-arcade', key: 'arcade' }
] as const;

function localeFromPath(pathname: string): Locale {
  const first = pathname.split('/').filter(Boolean)[0];
  return isLocale(first) ? first : defaultLocale;
}

export function TopNav({ locale }: { locale?: Locale }) {
  const pathname = usePathname();
  const activeLocale = locale || localeFromPath(pathname || '/');
  const text = tr(activeLocale);

  return (
    <header className="top-nav">
      <Link href={pathForLocale(activeLocale, '/')} className="brand-mark" aria-label="GR8 GAMZ home">
        <span aria-hidden="true" className="brand-mark__icon">G8</span>
        <span>GR8 GAMZ</span>
      </Link>
      <details className="nav-menu">
        <summary aria-label="Menu">Menu</summary>
        <nav className="nav-links" aria-label="Primary navigation">
          {links.map((link) => <Link key={link.href} href={pathForLocale(activeLocale, link.href)}>{text.nav[link.key]}</Link>)}
        </nav>
      </details>
      <LanguageSelector currentLocale={activeLocale} label={text.common.language} />
    </header>
  );
}

export default TopNav;
