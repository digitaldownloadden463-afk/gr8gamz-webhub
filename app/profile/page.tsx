import type { Metadata } from "next";
import { ProfileContent } from "@/components/ProfileContent";

export const metadata: Metadata = {
  title: "Player Profile",
  description: "View your GR8 GAMZ local player profile, favourites, likes and recently played games."
};

export default function ProfilePage() {
  return (
    <div className="page-shell">
      <section className="section-heading standalone">
        <p className="eyebrow">Player profile</p>
        <h1>Your GR8 GAMZ player hub</h1>
        <p>Track favourites, recent games, likes and play activity from this device.</p>
      </section>
      <ProfileContent />
    </div>
  );
}
