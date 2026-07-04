export type GameCategory =
  | "Arcade"
  | "Puzzle"
  | "Racing"
  | "Sports"
  | "Action"
  | "Strategy";

export type Game = {
  slug: string;
  title: string;
  category: GameCategory;
  description: string;
  shortDescription: string;
  accent: string;
  controls: string[];
  tags: string[];
  isFeatured?: boolean;
  embedUrl?: string;
};

export const games: Game[] = [
  {
    slug: "neon-runner",
    title: "Neon Runner",
    category: "Arcade",
    shortDescription: "Fast reflex arcade runner built for quick mobile sessions.",
    description:
      "Dash, dodge, and chase a high score in a bright arcade runner. This page is ready for a Gamepix or HTML5 iframe embed, while the engagement layer tracks plays, favourites, likes, comments, and recent activity.",
    accent: "#7c3aed",
    controls: ["Tap to jump", "Swipe down to slide", "Large mobile buttons"],
    tags: ["runner", "mobile", "high score", "quick play"],
    isFeatured: true
  },
  {
    slug: "bubble-blitz",
    title: "Bubble Blitz",
    category: "Puzzle",
    shortDescription: "A colourful bubble shooter page for relaxed repeat plays.",
    description:
      "Aim, match, and clear bubbles in a bright puzzle game layout. Designed for strong conversion from casual mobile visitors who want instant play without friction.",
    accent: "#06b6d4",
    controls: ["Tap to aim", "Drag to fine tune", "Release to shoot"],
    tags: ["bubble", "puzzle", "casual", "relaxing"],
    isFeatured: true
  },
  {
    slug: "turbo-track",
    title: "Turbo Track",
    category: "Racing",
    shortDescription: "High-energy racing game page with touch controls highlighted.",
    description:
      "A racing game page template with clear mobile control instructions, play tracking, comments, likes, and favourites already wired in on the frontend.",
    accent: "#f97316",
    controls: ["Left/right touch pads", "Tap boost", "Tilt-ready layout"],
    tags: ["racing", "speed", "cars", "boost"]
  },
  {
    slug: "goal-hero",
    title: "Goal Hero",
    category: "Sports",
    shortDescription: "Quick-play football style challenge for competitive sessions.",
    description:
      "Score, save, and replay. This sports game page is built for social hooks, comments, ratings, repeat visits, and future leaderboards.",
    accent: "#22c55e",
    controls: ["Swipe to shoot", "Tap to pass", "Hold for power"],
    tags: ["football", "sports", "challenge", "score"]
  },
  {
    slug: "block-battle",
    title: "Block Battle",
    category: "Strategy",
    shortDescription: "A tactical block game page for longer play sessions.",
    description:
      "A simple strategy-focused game landing page with community tools underneath. Ideal for building up comments, tips, and game requests later.",
    accent: "#eab308",
    controls: ["Tap blocks", "Drag to place", "Pinch-friendly board"],
    tags: ["blocks", "strategy", "brain", "logic"]
  },
  {
    slug: "sky-defender",
    title: "Sky Defender",
    category: "Action",
    shortDescription: "Action game page with arcade-style replay appeal.",
    description:
      "Defend the skies and come back for a better score. This template is set up for favourites, recent plays, comments, and future leaderboard expansion.",
    accent: "#ef4444",
    controls: ["Drag to move", "Auto fire", "Tap special attack"],
    tags: ["action", "arcade", "shooter", "fast"],
    isFeatured: true
  }
];

export const categories: GameCategory[] = [
  "Arcade",
  "Puzzle",
  "Racing",
  "Sports",
  "Action",
  "Strategy"
];

export function getGameBySlug(slug: string) {
  return games.find((game) => game.slug === slug);
}

export function getFeaturedGames() {
  return games.filter((game) => game.isFeatured);
}
