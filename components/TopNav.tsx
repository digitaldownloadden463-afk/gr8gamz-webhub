import Link from 'next/link';

const links = [
  { href: '/', label: 'Home' },
  { href: '/games', label: 'Games' },
  { href: '/gr8-originals', label: 'GR8 Originals' },
  { href: '/gr8-select', label: 'GR8 Select' },
  { href: '/gr8-trending', label: 'Trending' },
  { href: '/gr8-daily', label: 'Daily' },
  { href: '/my-arcade', label: 'My GR8 Arcade' }
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
