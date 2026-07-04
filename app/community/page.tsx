import type { Metadata } from "next";
import { ActivityFeed } from "@/components/ActivityFeed";
import { PlayerPanel } from "@/components/PlayerPanel";

export const metadata: Metadata = {
  title: "Community",
  description: "Join the GR8 GAMZ player community, view live activity and build your profile."
};

export default function CommunityPage() {
  return (
    <div className="page-shell">
      <section className="community-hero">
        <p className="eyebrow">Community layer</p>
        <h1>Make the arcade feel busy, alive and social.</h1>
        <p>
          This first community phase creates the feeling of action across the site. Players can create a local profile,
          comment on games, like games, favourite games and build a recent-play history.
        </p>
      </section>
      <section className="home-grid">
        <PlayerPanel />
        <ActivityFeed />
      </section>
      <section className="panel roadmap-panel">
        <p className="eyebrow">Coming next</p>
        <h2>Backend accounts, forum boards and leaderboards</h2>
        <p>
          The current system is intentionally lightweight so the Vercel build stays stable. The next backend phase can
          connect these exact features to a database for real sign-ups, moderation, public profiles and high-score tables.
        </p>
        <div className="roadmap-grid">
          <span>Real auth</span>
          <span>Forum categories</span>
          <span>Leaderboards</span>
          <span>Admin moderation</span>
          <span>Game requests</span>
          <span>Public profiles</span>
        </div>
      </section>
    </div>
  );
}
