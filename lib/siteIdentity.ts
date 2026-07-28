export const siteIdentity = {
  brandName: 'GR8 GAMZ',
  legalOperatorName: process.env.NEXT_PUBLIC_GR8_LEGAL_OPERATOR || 'Gr8 Gamz',
  country: process.env.NEXT_PUBLIC_GR8_OPERATOR_COUNTRY || 'UK',
  privacyEmail: process.env.NEXT_PUBLIC_GR8_PRIVACY_EMAIL || 'digitaldownloadden463@gmail.com',
  supportEmail: process.env.NEXT_PUBLIC_GR8_SUPPORT_EMAIL || 'digitaldownloadden463@gmail.com',
  effectiveDate: '2026-07-28'
};

export const hasPublicContact = Boolean(siteIdentity.privacyEmail || siteIdentity.supportEmail);

export function publicContactLabel() {
  if (siteIdentity.supportEmail) return siteIdentity.supportEmail;
  if (siteIdentity.privacyEmail) return siteIdentity.privacyEmail;
  return 'digitaldownloadden463@gmail.com';
}
