import Link from "next/link";
import { Gamepad2 } from "lucide-react";

const links = [
  { href: "/", label: "Games" },
  { href: "/top-games", label: "Top Games" },
  { href: "/community", label: "Community" },
  { href: "/profile", label: "Profile" }
];

export function TopNav() {
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="GR8 GAMZ home">
        <span className="brand-mark">
          <Gamepad2 size={22} aria-hidden="true" />
        </span>
        <span>
          <strong>GR8</strong> GAMZ
        </span>
      </Link>
      <nav className="nav-links" aria-label="Main navigation">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
