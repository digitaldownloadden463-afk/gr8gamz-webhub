import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ActivityFeed } from "@/components/ActivityFeed";
import { GameActions } from "@/components/GameActions";
import { GameComments } from "@/components/GameComments";
import { GamePlayerFrame } from "@/components/GamePlayerFrame";
import { games, getGameBySlug } from "@/lib/games";

export function generateStaticParams() {
  return games.map((game) => ({ slug: game.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const game = getGameBySlug(params.slug);

  if (!game) {
    return {
      title: "Game not found"
    };
  }

  return {
    title: `${game.title} - Play Free Online`,
    description: game.description,
    keywords: [game.title, game.category, ...game.tags, "free online games", "GR8 GAMZ"]
  };
}

export default function ArcadeGamePage({ params }: { params: { slug: string } }) {
  const game = getGameBySlug(params.slug);

  if (!game) {
    notFound();
  }

  return (
    <div className="page-shell game-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Games</Link>
        <span>/</span>
        <span>{game.title}</span>
      </nav>

      <section className="game-hero" style={{ "--game-accent": game.accent } as CSSProperties}>
        <div>
          <p className="eyebrow">{game.category} game</p>
          <h1>{game.title}</h1>
          <p>{game.description}</p>
          <div className="tag-row">
            {game.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        </div>
        <GameActions game={game} />
      </section>

      <GamePlayerFrame game={game} />

      <section className="game-detail-grid">
        <GameComments game={game} />
        <ActivityFeed compact />
      </section>
    </div>
  );
}
