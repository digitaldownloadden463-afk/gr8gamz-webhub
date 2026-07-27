import Link from 'next/link';

const links = [
  { href: '/', label: 'Home' },
  { href: '/games', label: 'Games' },
  { href: '/more-free-games', label: 'More Games' },
  { href: '/my-arcade', label: 'My Arcade' }
];

export function TopNav() {
  return (
    <header className="top-nav">
      <Link href="/" className="brand-mark" aria-label="GR8 GAMZ home">
        <span aria-hidden="true" className="brand-mark__icon">G8</span>
        <span>GR8 GAMZ</span>
      </Link>
      <details className="nav-menu">
        <summary aria-label="Menu">Menu</summary>
        <nav className="nav-links" aria-label="Primary navigation">
          {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
        </nav>
      </details>
    </header>
  );
}

export default TopNav;
