export type NeonColor = "cyan" | "magenta" | "yellow" | "green";

export interface LiveScoreTickerItem {
  id: string;
  gamerTag: string;
  gameTitle: string;
  score: number;
  timeAgo: string;
  color: NeonColor;
}

export interface DailyTopPlayer {
  rank: number;
  gamerTag: string;
  score: number;
  percentage: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface HomeFeature {
  id: string;
  icon: "GAMEPAD" | "FREE" | "TROPHY" | "ROCKET";
  title: string;
  description: string;
  color: NeonColor;
}

export interface StatItem {
  number: string;
  unit: string;
  subtitle: string;
}
