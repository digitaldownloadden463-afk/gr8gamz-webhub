import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div>
        <strong>GR8 GAMZ</strong>
        <p>Mobile-first arcade pages built for play, repeat visits and community growth.</p>
      </div>
      <div className="footer-links">
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/community">Community</Link>
      </div>
    </footer>
  );
}
