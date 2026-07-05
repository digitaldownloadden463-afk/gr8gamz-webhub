import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "GR8 GAMZ privacy information."
};

export default function PrivacyPage() {
  return (
    <div className="page-shell legal-page">
      <h1>Privacy Policy</h1>
      <p>
        GR8 GAMZ is designed as a browser games website. This Phase 3 build stores player profile details, favourites,
        likes, comments and recent games locally in the visitor&apos;s browser using localStorage.
      </p>
      <p>
        Local profile data is not a full registered account and is not submitted to a server in this phase. If analytics,
        adverts, embedded game partners or backend accounts are added later, this policy should be updated before launch.
      </p>
    </div>
  );
}
