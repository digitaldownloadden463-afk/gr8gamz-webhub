export const indexNowHost = 'www.gr8gamz.com';
export const indexNowOrigin = `https://${indexNowHost}`;
export const indexNowEndpoint = 'https://api.indexnow.org/indexnow';
export const indexNowKey = '88e129851028624186943dc73d9b36a2';
export const indexNowKeyLocation = `${indexNowOrigin}/${indexNowKey}.txt`;
export const indexNowBatchSize = 100;

const disallowedPathPatterns = [
  /\/page\/\d+\/?$/,
  /\/play\/?$/,
  /^\/api(?:\/|$)/,
  /^\/_next(?:\/|$)/,
  /^\/admin(?:\/|$)/,
  /^\/challenge(?:\/|$)/,
  /^\/pinterest(?:\/|$)/,
  /^\/sitemaps?(?:\/|$)/,
  /^\/search(?:\/|$)/
];

export function normalizeIndexNowUrl(input) {
  const value = String(input || '').trim();
  if (!value) throw new Error('IndexNow URL cannot be empty.');
  const url = value.startsWith('/') ? new URL(value, indexNowOrigin) : new URL(value);
  if (url.protocol !== 'https:' || url.hostname !== indexNowHost || url.port) {
    throw new Error(`IndexNow URL must use ${indexNowOrigin}: ${value}`);
  }
  if (url.search || url.hash || url.username || url.password) {
    throw new Error(`IndexNow URL must be a clean canonical URL without query, hash or credentials: ${value}`);
  }
  if (disallowedPathPatterns.some((pattern) => pattern.test(url.pathname))) {
    throw new Error(`IndexNow URL is not eligible for routine submission: ${url.pathname}`);
  }
  return `${indexNowOrigin}${url.pathname === '/' ? '/' : url.pathname.replace(/\/$/, '')}`;
}

export function uniqueIndexNowUrls(inputs) {
  return [...new Set(inputs.map(normalizeIndexNowUrl))];
}

export function buildIndexNowPayload(urlList) {
  const urls = uniqueIndexNowUrls(urlList);
  if (!urls.length) throw new Error('At least one changed URL is required.');
  if (urls.length > indexNowBatchSize) {
    throw new Error(`This GR8 GAMZ workflow limits each submission to ${indexNowBatchSize} changed URLs.`);
  }
  return {
    host: indexNowHost,
    key: indexNowKey,
    keyLocation: indexNowKeyLocation,
    urlList: urls
  };
}

export function canonicalFromHtml(html) {
  const match = String(html).match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']|<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  return match?.[1] || match?.[2] || '';
}

export function htmlIsNoindex(html) {
  return /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex|<meta[^>]+content=["'][^"']*noindex[^"']*["'][^>]+name=["']robots["']/i.test(String(html));
}
