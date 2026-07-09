import Link from 'next/link';
import { affiliateDisclosure } from '../../data/affiliateGuides';

export default function AffiliateDisclosureBlock({ compact = false }) {
  return (
    <aside className={compact ? 'affiliate-disclosure affiliate-disclosure-compact' : 'affiliate-disclosure'}>
      <strong>Affiliate disclosure</strong>
      <p>{compact ? affiliateDisclosure.short : affiliateDisclosure.long}</p>
      <Link href="/affiliate-disclosure" className="soft-link">Read affiliate disclosure</Link>
    </aside>
  );
}
