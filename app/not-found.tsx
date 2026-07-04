import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-shell legal-page">
      <h1>Game not found</h1>
      <p>That game page could not be found.</p>
      <Link href="/" className="primary-button">
        Back to games
      </Link>
    </div>
  );
}
