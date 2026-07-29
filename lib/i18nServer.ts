import { headers } from 'next/headers';
import { defaultLocale, isLocale, type Locale } from '@/lib/i18n';

export async function getRequestLocale(): Promise<Locale> {
  const headerStore = await headers();
  const value = headerStore.get('x-gr8-locale') || defaultLocale;
  return isLocale(value) ? value : defaultLocale;
}
