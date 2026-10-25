import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { canonical } from '@/lib/features';

export const metadata: Metadata = {
  title: 'Policies, Safety and Disclosures',
  description: 'Find GR8 GAMZ privacy, safety, accessibility, editorial, copyright and commercial disclosure information.',
  alternates: { canonical: canonical('/policies') },
  openGraph: {
    title: 'Policies, Safety and Disclosures | GR8 GAMZ',
    description: 'GR8 GAMZ privacy, safety, accessibility, editorial and commercial disclosures.',
    url: canonical('/policies')
  }
};

const policyLinks = [
  ['/privacy', 'Privacy policy', 'How personal data, local storage and third-party services are handled.'],
  ['/privacy-choices', 'Privacy choices', 'Review or change analytics, advertising and partner-content choices.'],
  ['/terms', 'Terms of use', 'The rules that apply when using GR8 GAMZ.'],
  ['/cookie-policy', 'Cookie policy', 'Cookies, local storage and consent controls explained.'],
  ['/child-safety', 'Child safety', 'Safety principles for younger players, families and schools.'],
  ['/accessibility', 'Accessibility', 'How the site supports keyboard, screen-reader and reduced-motion use.'],
  ['/editorial-policy', 'Editorial policy', 'How games, recommendations and product information are selected.'],
  ['/affiliate-disclosure', 'Affiliate disclosure', 'How qualifying purchases may support GR8 GAMZ.'],
  ['/partner-disclosure', 'Game partner disclosure', 'How externally hosted GR8 Select games work.'],
  ['/copyright', 'Copyright', 'Ownership, licensing and rights-contact information.'],
  ['/report-a-game', 'Report a game', 'Flag a broken, unsuitable or rights-sensitive game listing.'],
  ['/contact', 'Contact', 'Get in touch about privacy, safety, access or editorial questions.']
] as const;

export default function PoliciesPage() {
  return (
    <main>
      <section className="page-title">
        <span className="eyebrow"><ShieldCheck size={18} aria-hidden="true" /> Trust centre</span>
        <h1>Policies, safety and disclosures</h1>
        <p>One place for the rules, controls and explanations behind GR8 GAMZ. Essential privacy, terms, accessibility and affiliate links remain available sitewide.</p>
      </section>
      <section className="compact-link-list" aria-label="GR8 GAMZ policies and safety pages">
        {policyLinks.map(([href, title, description]) => (
          <Link key={href} href={href}>
            <span>{description}</span>
            <strong>{title} <ArrowRight size={16} aria-hidden="true" /></strong>
          </Link>
        ))}
      </section>
    </main>
  );
}
