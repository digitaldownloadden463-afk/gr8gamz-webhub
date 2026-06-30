import Link from 'next/link';
import { siteConfig } from '../data/site';

export default function Header() {
  return (
    <header className="site-header">
      <Link href="/" className="brand-lockup" aria-label="GR8 GAMZ home">
        <span className="brand-mark">G8</span>
        <span>
          <strong>{siteConfig.name}</strong>
          <small>{siteConfig.tagline}</small>
        </span>
      </Link>
      <nav className="main-nav" aria-label="Primary navigation">
        <Link href="/games">Games</Link>
        <Link href="/mobile-games">Mobile</Link>
        <Link href="/quick-games">Quick</Link>
        <Link href="/popular">Popular</Link>
        <Link href="/new">New</Link>
        <Link href="/updates">Updates</Link>
        <Link href="/gamepix-games">GamePix</Link>
        <Link href="/gamemonetize-games">GameMonetize</Link>
        <Link href="/gaming-deals">Deals</Link>
        <Link href="/collections">Collections</Link>
        <Link href="/latest">Latest</Link>
        <Link href="/advertise">Advertise</Link>
      </nav>
    </header>
  );
}
