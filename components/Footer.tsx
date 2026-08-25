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
    ['/gaming-gear', 'Gaming Gear', false],
    ['/classroom', 'Classroom', false],
    ['/gr8-trending', text.nav.trending, true],
    ['/gr8-daily', text.nav.daily, true],
    ['/new-games', text.nav.new, true],
    ['/my-arcade', text.nav.arcade, true],
    ['/categories/arcade', text.categories.Arcade, true],
    ['/categories/puzzle', text.categories.Puzzle, true],
    ['/categories/racing', text.categories.Racing, true],
    ['/privacy', text.legal.privacyTitle, true],
    ['/terms', text.legal.termsTitle, true],
    ['/privacy-choices', text.common.privacyChoice, false],
    ['/contact', 'Contact', false],
    ['/about', 'About', false],
    ['/accessibility', 'Accessibility', false],
    ['/affiliate-disclosure', 'Affiliate disclosure', false],
    ['/child-safety', 'Child safety', false],
    ['/cookie-policy', 'Cookie policy', false],
    ['/copyright', 'Copyright', false],
    ['/editorial-policy', 'Editorial policy', false],
    ['/mobile-games', 'Mobile games', false],
    ['/more-free-games', 'More games', false],
    ['/popular-games', 'Popular games', false],
    ['/quick-games', 'Quick games', false],
    ['/report-a-game', 'Report a game', false]
  ] as const;

  return (
    <footer className="site-footer">
      <div className="site-footer__brand">
        <span className="brand-mark__icon" aria-hidden="true">G8</span>
        <strong>GR8 GAMZ</strong>
        <p>Original worlds, instant browser play, GR8 Select discovery and practical gaming gear guides.</p>
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
