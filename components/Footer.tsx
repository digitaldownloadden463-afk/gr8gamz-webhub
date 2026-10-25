'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { defaultLocale, isLocale, pathForLocale, tr, type Locale } from '@/lib/i18n';

function localeFromPath(pathname: string): Locale {
  const first = pathname.split('/').filter(Boolean)[0];
  return isLocale(first) ? first : defaultLocale;
}

export function Footer({ locale }: { locale?: Locale }) {
  const pathname = usePathname();
  const activeLocale = locale || localeFromPath(pathname || '/');
  const text = tr(activeLocale);
  const links = [
    ['/games', text.nav.games, true],
    ['/gr8-originals', text.nav.originals, true],
    ['/gr8-select', text.nav.select, true],
    ['/gaming-gear', 'GR8 GEAR', false],
    ['/classroom', 'Classroom', false],
    ['/tools', 'Gaming tools', false],
    ['/gr8-trending', text.nav.trending, true],
    ['/my-arcade', text.nav.arcade, true],
    ['/about', 'About', false],
    ['/contact', 'Contact', false],
    ['/privacy', text.legal.privacyTitle, true],
    ['/terms', text.legal.termsTitle, true],
    ['/accessibility', 'Accessibility', false],
    ['/affiliate-disclosure', 'Affiliate disclosure', false],
    ['/policies', 'All policies and safety', false]
  ] as const;

  return (
    <footer className="site-footer">
      <div className="site-footer__brand">
        <span className="brand-mark__icon" aria-hidden="true">G8</span>
        <strong>GR8 GAMZ</strong>
        <p>Original worlds, instant browser play, GR8 Select discovery and transparent GR8 GEAR shopping guides.</p>
      </div>
      <nav className="site-footer__links" aria-label="Footer navigation">
        {links.map(([href, label, localize]) => (
          <Link key={href} href={localize ? pathForLocale(activeLocale, href) : href}>{label}</Link>
        ))}
      </nav>
    </footer>
  );
}

export default Footer;
