import 'server-only';

export type PinterestApiReadiness = {
  enabled: false;
  appConfigured: boolean;
  accessTokenConfigured: boolean;
  reason: string;
};

export function getPinterestApiReadiness(): PinterestApiReadiness {
  const appConfigured = Boolean(process.env.PINTEREST_APP_ID);
  const accessTokenConfigured = Boolean(process.env.PINTEREST_ACCESS_TOKEN);
  return {
    enabled: false,
    appConfigured,
    accessTokenConfigured,
    reason:
      'RSS is the Phase D1 publishing method. API analytics stays disabled until Pinterest grants access and the GR8 GAMZ business account authorises it.',
  };
}

export async function fetchPinterestAnalyticsDisabled(): Promise<never> {
  throw new Error(
    'Pinterest API analytics is disabled until official app access and business-account authorisation are verified.'
  );
}
