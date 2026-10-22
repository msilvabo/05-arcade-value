export interface LeaderboardEntry {
  rank: number;
  gamerTag: string;
  avatar: string;
  score: number;
  formattedScore: string;
  gameId: string;
  gameTitle: string;
  badge: "CHAMPION" | "MASTER" | "VETERAN" | "ROOKIE";
  date: string;
  accuracy: string;
  combo: string;
}

export type LeaderboardPeriod = "all-time" | "monthly" | "weekly";
