export const ADSENSE_PUBLISHER_ID = 'pub-9245359017496056';
export const ADSENSE_ACCOUNT_ID = `ca-${ADSENSE_PUBLISHER_ID}`;
export const ADSENSE_SCRIPT_ID = 'gr8-adsense-script';
export const ADSENSE_SCRIPT_URL = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ACCOUNT_ID}`;

const configuredClient = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT?.trim() || '';
const testMode = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_TEST_MODE === 'true';

function configuredSlot(value: string | undefined) {
  const slot = value?.trim() || '';
  return /^\d{6,20}$/.test(slot) ? slot : '';
}

export const adsenseConfig = {
  accountId: ADSENSE_ACCOUNT_ID,
  publisherId: ADSENSE_PUBLISHER_ID,
  scriptId: ADSENSE_SCRIPT_ID,
  scriptUrl: ADSENSE_SCRIPT_URL,
  enabled: process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ENABLED === 'true'
    && configuredClient === ADSENSE_ACCOUNT_ID
    && (process.env.NODE_ENV === 'production' || testMode),
  testMode,
  slots: {
    home: configuredSlot(process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_HOME_SLOT),
    discovery: configuredSlot(process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_DISCOVERY_SLOT),
    editorial: configuredSlot(process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_EDITORIAL_SLOT)
  }
} as const;
