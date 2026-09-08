import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, isLocale } from '@/lib/i18n';
import { isRetiredCommercePath, legacyCommerceRedirects } from '@/lib/commerce/legacyCommerce';

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const legacyDestination = legacyCommerceRedirects.get(pathname);
  if (legacyDestination) return NextResponse.redirect(new URL(legacyDestination, request.url), 301);
  if (isRetiredCommercePath(pathname)) {
    return new NextResponse('<!doctype html><html lang="en"><head><meta name="robots" content="noindex,follow"><title>Product page retired | GR8 GAMZ</title></head><body><main><h1>This product page has been retired.</h1><p>The former partner product is no longer promoted by GR8 GAMZ.</p><a href="/gaming-gear">Browse current GR8 GEAR</a></main></body></html>', {
      status: 410,
      headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'noindex, follow' }
    });
  }
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
