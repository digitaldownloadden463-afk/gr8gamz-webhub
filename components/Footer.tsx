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
        <Link href="/new-games">New Games</Link>
        <Link href="/popular-games">Popular Games</Link>
        <Link href="/quick-games">Quick Games</Link>
        <Link href="/mobile-games">Mobile Games</Link>
        <Link href="/categories/arcade">Arcade</Link>
        <Link href="/categories/puzzle">Puzzle</Link>
        <Link href="/categories/racing">Racing</Link>
        <Link href="/controls/tap">Tap Games</Link>
        <Link href="/controls/swipe">Swipe Games</Link>
        <Link href="/my-arcade">My GR8 Arcade</Link>
        <Link href="/more-free-games">More Games</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/privacy-choices">Privacy Choices</Link>
        <Link href="/cookie-policy">Cookies</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/partner-disclosure">Partners</Link>
        <Link href="/affiliate-disclosure">Affiliates</Link>
        <Link href="/accessibility">Accessibility</Link>
        <Link href="/child-safety">Child Safety</Link>
        <Link href="/copyright">Copyright</Link>
        <Link href="/report-a-game">Report a Game</Link>
        <Link href="/editorial-policy">Game Selection</Link>
      </nav>
    </footer>
  );
}

export default Footer;
