import Link from 'next/link';

export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>GR8 GAMZ</strong>
        <p>Free browser games with GR8 Originals, GR8 Select, local-device saves and clear privacy controls.</p>
      </div>
      <nav aria-label="Footer navigation">
        <Link href="/games">Games</Link>
        <Link href="/gr8-originals">GR8 Originals</Link>
        <Link href="/gr8-select">GR8 Select</Link>
        <Link href="/gr8-trending">Trending</Link>
        <Link href="/gr8-daily">Daily</Link>
        <Link href="/my-arcade">My GR8 Arcade</Link>
        <Link href="/more-free-games">More Games</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/privacy-choices">Privacy Choices</Link>
        <Link href="/cookie-policy">Cookies</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/partner-disclosure">Partners</Link>
        <Link href="/affiliate-disclosure">Affiliates</Link>
      </nav>
    </footer>
  );
}

export default Footer;
