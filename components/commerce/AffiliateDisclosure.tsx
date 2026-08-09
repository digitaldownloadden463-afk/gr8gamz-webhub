import Link from 'next/link';

export default function AffiliateDisclosure() {
  return (
    <p className="commerce-disclosure">
      GR8 GAMZ may earn a commission if you buy through links on this page, at no extra cost to you.{' '}
      <Link href="/affiliate-disclosure">How affiliate links work</Link>.
    </p>
  );
}
