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
    ['/contact', 'Contact', false]
  ] as const;

  return (
    <footer className="site-footer">
      <div>
        <strong>GR8 GAMZ</strong>
        <p>{text.home.intro}</p>
      </div>
      <nav aria-label="Footer navigation">
        {links.map(([href, label, localize]) => (
          <Link key={href} href={localize ? pathForLocale(activeLocale, href) : href}>{label}</Link>
        ))}
      </nav>
    </footer>
  );
}

export default Footer;
