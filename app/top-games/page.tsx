import type { Metadata } from "next";
import { GameCard } from "@/components/GameCard";
import { games } from "@/lib/games";

export const metadata: Metadata = {
  title: "Top Games",
  description: "Browse featured and trending free online games on GR8 GAMZ."
};

export default function TopGamesPage() {
  const ordered = [...games].sort((a, b) => Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured)));

  return (
    <div className="page-shell">
      <section className="section-heading standalone">
        <p className="eyebrow">Top games</p>
        <h1>Games to push hardest for traffic</h1>
        <p>
          A simple ranking page for your most important arcade games. In the backend phase this can sort by real plays,
          likes, ratings and revenue.
        </p>
      </section>
      <div className="game-grid">
        {ordered.map((game) => (
          <GameCard key={game.slug} game={game} />
        ))}
      </div>
    </div>
  );
}
