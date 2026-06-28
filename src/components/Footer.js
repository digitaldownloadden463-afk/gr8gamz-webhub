import Link from 'next/link';
import { siteConfig } from '../data/site';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>{siteConfig.name}</strong>
        <p>Instant browser games, curated collections, XP streaks and brand-safe sponsorship inventory.</p>
      </div>
      <nav aria-label="Footer navigation">
        <Link href="/free-browser-games">Free browser games</Link>
        <Link href="/mobile-games">Mobile games</Link>
        <Link href="/quick-games">Quick games</Link>
        <Link href="/advertise">Advertise</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/sitemap.xml">Sitemap</Link>
      </nav>
    </footer>
  );
}
