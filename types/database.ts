import { LeaderboardEntry } from "./leaderboard";
import { Game } from "./game";

export interface ProfileRow {
  id: string;
  gamer_tag: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface GameRow {
  id: string;
  title: string;
  category: string;
  category_keys: string[];
  year: number;
  description: string;
  badge: string | null;
  badge_variant: string | null;
  difficulty: string;
  art_type: string;
  plays_count: number;
  created_at: string;
}

export interface ScoreRow {
  id: string;
  user_id: string | null;
  player_name: string | null;
  game_id: string;
  score: number;
  accuracy: string;
  combo: string;
  created_at: string;
}

export interface ScoreWithRelations extends ScoreRow {
  profiles: {
    gamer_tag: string;
    avatar_url: string | null;
  } | null;
  games: {
    title: string;
  } | null;
}

export type LeaderboardEntryDTO = LeaderboardEntry;

/**
 * Convierte un GameRow de Supabase en el formato de interfaz Game
 */
export function mapGameRowToGame(row: GameRow): Game {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    categoryKey: row.category_keys as Game["categoryKey"],
    year: row.year,
    badge: row.badge || undefined,
    badgeVariant: (row.badge_variant as Game["badgeVariant"]) || "primary",
    difficulty: (row.difficulty as Game["difficulty"]) || "NORMAL",
    description: row.description,
    record: {
      score: `${row.plays_count.toLocaleString()} PTS`,
      rawScore: Number(row.plays_count),
      holder: "@ARCADE_MASTER",
    },
    artType: (row.art_type as Game["artType"]) || "arkanoid",
    playsCount: Number(row.plays_count),
  };
}

/**
 * Determina el badge en función del ranking del jugador
 */
export function getBadgeByRank(rank: number): LeaderboardEntry["badge"] {
  if (rank === 1) return "CHAMPION";
  if (rank === 2) return "MASTER";
  if (rank <= 5) return "VETERAN";
  return "ROOKIE";
}

/**
 * Formatea una fecha ISO a formato arcade (ej. '18 OCT 2026')
 */
export function formatArcadeDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const months = [
      "ENE",
      "FEB",
      "MAR",
      "ABR",
      "MAY",
      "JUN",
      "JUL",
      "AGO",
      "SEP",
      "OCT",
      "NOV",
      "DIC",
    ];
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return "HOY";
  }
}
