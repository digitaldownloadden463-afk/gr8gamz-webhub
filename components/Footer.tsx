import Link from 'next/link';

export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>GR8 GAMZ</strong>
        <p>Free browser games with local-device saves, curated partner picks and clear privacy controls.</p>
      </div>
      <nav aria-label="Footer navigation">
        <Link href="/games">Games</Link>
        <Link href="/more-free-games">More Games</Link>
        <Link href="/my-arcade">My Arcade</Link>
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
