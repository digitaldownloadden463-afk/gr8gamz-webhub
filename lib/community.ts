export type Player = {
  username: string;
  avatar: string;
  joinedAt: string;
};

export type ActivityType = "join" | "play" | "like" | "favourite" | "comment";

export type Activity = {
  id: string;
  type: ActivityType;
  username: string;
  gameTitle?: string;
  gameSlug?: string;
  message: string;
  createdAt: string;
};

export type GameStats = {
  plays: number;
  likes: number;
};

export type Comment = {
  id: string;
  username: string;
  message: string;
  createdAt: string;
};

export const starterActivity: Activity[] = [
  {
    id: "starter-1",
    type: "play",
    username: "PixelAce",
    gameTitle: "Neon Runner",
    gameSlug: "neon-runner",
    message: "PixelAce is playing Neon Runner",
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString()
  },
  {
    id: "starter-2",
    type: "favourite",
    username: "ArcadeAmy",
    gameTitle: "Bubble Blitz",
    gameSlug: "bubble-blitz",
    message: "ArcadeAmy added Bubble Blitz to favourites",
    createdAt: new Date(Date.now() - 1000 * 60 * 17).toISOString()
  },
  {
    id: "starter-3",
    type: "comment",
    username: "GR8Player",
    gameTitle: "Sky Defender",
    gameSlug: "sky-defender",
    message: "GR8Player posted a new game comment",
    createdAt: new Date(Date.now() - 1000 * 60 * 34).toISOString()
  }
];

export const avatars = ["🎮", "🚀", "👾", "🔥", "⚡", "🏆", "🕹️", "😎"];
