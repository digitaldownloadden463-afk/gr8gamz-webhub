export const accountsEnabled =
  process.env.NEXT_PUBLIC_ENABLE_ACCOUNTS === 'true' &&
  Boolean(process.env.GR8_DATABASE_URL) &&
  Boolean(process.env.GR8_SESSION_SECRET);

export const communityEnabled =
  process.env.NEXT_PUBLIC_ENABLE_COMMUNITY === 'true' &&
  accountsEnabled &&
  Boolean(process.env.GR8_MODERATION_KEY);

export const analyticsEnabled =
  process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' &&
  Boolean(process.env.NEXT_PUBLIC_ANALYTICS_ID);

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gr8gamz.com';

export function canonical(path = '/') {
  return new URL(path, siteUrl).toString();
}

export function gameCountLabel(count: number) {
  return `${count} ${count === 1 ? 'game' : 'games'}`;
}

export function isRecentlyAdded(dateAdded?: string) {
  if (!dateAdded) return false;
  const added = new Date(dateAdded).getTime();
  if (!Number.isFinite(added)) return false;
  const ninetyDays = 90 * 24 * 60 * 60 * 1000;
  return Date.now() - added <= ninetyDays;
}
