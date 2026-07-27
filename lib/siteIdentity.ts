export const siteIdentity = {
  brandName: 'GR8 GAMZ',
  legalOperatorName: process.env.NEXT_PUBLIC_GR8_LEGAL_OPERATOR || '',
  country: process.env.NEXT_PUBLIC_GR8_OPERATOR_COUNTRY || '',
  privacyEmail: process.env.NEXT_PUBLIC_GR8_PRIVACY_EMAIL || '',
  supportEmail: process.env.NEXT_PUBLIC_GR8_SUPPORT_EMAIL || '',
  effectiveDate: '2026-07-27'
};

export const hasPublicContact = Boolean(siteIdentity.privacyEmail || siteIdentity.supportEmail);

export function publicContactLabel() {
  if (siteIdentity.supportEmail) return siteIdentity.supportEmail;
  if (siteIdentity.privacyEmail) return siteIdentity.privacyEmail;
  return 'Contact details are pending owner confirmation.';
}
