import Link from 'next/link';

export default function AffiliateDisclosure() {
  return (
    <p className="commerce-disclosure">
      GR8 GAMZ may earn a commission when you buy through links on this page. You pay no extra. GadgetHyper is the merchant after you leave GR8 GAMZ.{' '}
      <Link href="/affiliate-disclosure">How affiliate links work</Link>.
    </p>
  );
}
