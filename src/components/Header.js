import Link from 'next/link';
import BrandLogo from './BrandLogo';
import PassportNavBadge from './passport/PassportNavBadge';

export default function Header() {
  return (
    <header className="site-header site-header-network">
      <BrandLogo />
      <nav className="main-nav main-nav-network" aria-label="Primary navigation">
        <Link href="/games">Games</Link>
        <Link href="/original-games">Originals</Link>
        <Link href="/more-free-games">More Free Games</Link>
        <Link href="/hot-picks">Hot Picks</Link>
        <Link href="/live">Live</Link>
        <Link href="/gaming-deals">Gaming Deals</Link>
        <Link href="/community">Clubhouse</Link>
        <PassportNavBadge />
      </nav>
    </header>
  );
}
