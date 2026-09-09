import affiliateConfig from '@/src/data/commerce/gadgethyper-affiliate.json';

export const gadgetHyperAffiliateRef = process.env.GADGETHYPER_AFFILIATE_REF?.trim() || affiliateConfig.publicReferralCode;
export const gadgetHyperAffiliateEvidence = affiliateConfig;
