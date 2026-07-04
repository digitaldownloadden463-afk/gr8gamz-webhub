import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "GR8 GAMZ website terms."
};

export default function TermsPage() {
  return (
    <div className="page-shell legal-page">
      <h1>Terms</h1>
      <p>
        GR8 GAMZ provides access to free online game pages and community-style features. Players should use the site
        respectfully and avoid posting anything abusive, offensive, illegal or spammy.
      </p>
      <p>
        Game pages in this package are prepared for HTML5 or partner iframe embeds. Check the terms of any game partner
        before publishing their games, adverts, logos or affiliate links.
      </p>
    </div>
  );
}
