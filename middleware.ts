import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, isLocale } from '@/lib/i18n';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const first = pathname.split('/').filter(Boolean)[0];
  const locale = isLocale(first) ? first : defaultLocale;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-gr8-locale', locale);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('x-gr8-locale', locale);
  return response;
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|icon.png|apple-touch-icon.png|manifest.webmanifest|sw.js|offline.html|games/|art/|og/|partner-games/).*)']
};
