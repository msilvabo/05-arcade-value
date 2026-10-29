export type GameCategory =
  "all" | "shoot-em-up" | "puzzle" | "action-maze" | "classics-80s" | "popular";

export type GameDifficulty = "NORMAL" | "DIFÍCIL" | "HARDCORE";

export type SortOption = "populares" | "record" | "ano";

export interface GameRecord {
  score: string;
  rawScore: number;
  holder: string;
}

export interface Game {
  id: string;
  title: string;
  category: string;
  categoryKey: GameCategory[];
  year: number;
  badge?: string;
  badgeVariant?: "secondary" | "primary" | "tertiary" | "surface";
  difficulty: GameDifficulty;
  description: string;
  record: GameRecord;
  artType:
    | "arkanoid"
    | "tetris"
    | "space-invaders"
    | "pacman"
    | "snake"
    | "asteroids"
    | "frogger";
  playsCount: number;
}

export interface CategoryTab {
  key: GameCategory;
  label: string;
  count?: number;
}
