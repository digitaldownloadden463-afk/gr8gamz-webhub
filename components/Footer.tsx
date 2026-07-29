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
    ['/games', text.nav.games],
    ['/gr8-originals', text.nav.originals],
    ['/gr8-select', text.nav.select],
    ['/gr8-trending', text.nav.trending],
    ['/gr8-daily', text.nav.daily],
    ['/new-games', text.nav.new],
    ['/my-arcade', text.nav.arcade],
    ['/categories/arcade', text.categories.Arcade],
    ['/categories/puzzle', text.categories.Puzzle],
    ['/categories/racing', text.categories.Racing],
    ['/privacy', text.legal.privacyTitle],
    ['/terms', text.legal.termsTitle],
    ['/privacy-choices', text.common.privacyChoice],
    ['/contact', 'Contact']
  ] as const;

  return (
    <footer className="site-footer">
      <div>
        <strong>GR8 GAMZ</strong>
        <p>{text.home.intro}</p>
      </div>
      <nav aria-label="Footer navigation">
        {links.map(([href, label]) => <Link key={href} href={pathForLocale(activeLocale, href)}>{label}</Link>)}
      </nav>
    </footer>
  );
}

export default Footer;
