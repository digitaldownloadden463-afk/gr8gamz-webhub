'use client';

import { usePathname } from 'next/navigation';
import { localeInfo, locales, switchLocalePath, type Locale } from '@/lib/i18n';

export function LanguageSelector({ currentLocale, label }: { currentLocale: Locale; label: string }) {
  const pathname = usePathname() || '/';
  const current = localeInfo(currentLocale);

  return (
    <details className="language-selector">
      <summary aria-label={label}>
        <span aria-hidden="true">文</span>
        <span>{current.nativeName}</span>
      </summary>
      <div className="language-selector__menu" role="listbox" aria-label={label}>
        {locales.map((locale) => (
          <a
            key={locale.code}
            href={switchLocalePath(locale.code, pathname)}
            hrefLang={locale.code}
            lang={locale.code}
            dir={locale.dir}
            aria-current={locale.code === currentLocale ? 'true' : undefined}
          >
            <span>{locale.nativeName}</span>
            <small>{locale.name}</small>
          </a>
        ))}
      </div>
    </details>
  );
}

export default LanguageSelector;
