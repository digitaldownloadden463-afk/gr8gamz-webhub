import Link from "next/link";
import type { CSSProperties } from "react";
import type { Game } from "@/lib/games";
import { MiniStats } from "./MiniStats";

export function GameCard({ game }: { game: Game }) {
  return (
    <article className="game-card">
      <Link href={`/arcade/${game.slug}`} className="game-card-link">
        <div className="game-art" style={{ "--game-accent": game.accent } as CSSProperties}>
          <span>{game.title.slice(0, 2).toUpperCase()}</span>
        </div>
        <div className="game-card-body">
          <div className="game-card-meta">
            <span>{game.category}</span>
            {game.isFeatured ? <em>Featured</em> : null}
          </div>
          <h2>{game.title}</h2>
          <p>{game.shortDescription}</p>
        </div>
      </Link>
      <MiniStats slug={game.slug} />
    </article>
  );
}
