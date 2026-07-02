import Link from 'next/link';
import BrandLogo from './BrandLogo';
import { siteConfig } from '../data/site';

export default function Footer() {
  return (
    <footer className="site-footer site-footer-network">
      <div className="footer-brand-block">
        <BrandLogo compact />
        <p>{siteConfig.description}</p>
      </div>
      <nav aria-label="Footer navigation">
        <Link href="/free-online-games">Free online games</Link>
        <Link href="/free-browser-games">Free browser games</Link>
        <Link href="/original-games">GR8 Originals</Link>
        <Link href="/more-free-games">More free games</Link>
        <Link href="/hot-picks">Hot picks</Link>
        <Link href="/gaming-deals">Gaming deals</Link>
        <Link href="/passport">GR8 Passport</Link>
        <Link href="/my-arcade">My Arcade</Link>
        <Link href="/badges">Badges</Link>
        <Link href="/daily-challenge">Daily challenge</Link>
        <Link href="/community">GR8 Clubhouse</Link>
        <Link href="/community-guidelines">Community guidelines</Link>
        <Link href="/partner-disclosure">Partner disclosure</Link>
        <Link href="/affiliate-disclosure">Affiliate disclosure</Link>
        <Link href="/partners">Partners</Link>
        <Link href="/advertise">Advertise</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/sitemap.xml">Sitemap</Link>
        <Link href="/privacy">Privacy</Link>
      </nav>
    </footer>
  );
}
