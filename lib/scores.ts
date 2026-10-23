import { createClient } from "@/lib/supabase/client";

export interface GameScorePayload {
  gameId: string;
  score: number;
  userId?: string | null;
  createdAt?: string;
}

export interface HighScoreResult {
  highScore: number;
  isNewRecord: boolean;
  persistedToSupabase: boolean;
}

const getStorageKey = (gameId: string) => `arcade_vault_highscore_${gameId}`;

export function getHighScore(gameId: string, fallbackDefault = 0): number {
  if (typeof window === "undefined") return fallbackDefault;
  try {
    const raw = localStorage.getItem(getStorageKey(gameId));
    if (!raw) return fallbackDefault;
    const parsed = parseInt(raw, 10);
    return isNaN(parsed) ? fallbackDefault : parsed;
  } catch {
    return fallbackDefault;
  }
}

export async function saveGameScore(
  gameId: string,
  score: number
): Promise<HighScoreResult> {
  let isNewRecord = false;
  let currentHighScore = getHighScore(gameId, 0);

  if (score > currentHighScore) {
    currentHighScore = score;
    isNewRecord = true;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(getStorageKey(gameId), score.toString());
      } catch (err) {
        console.warn("Error guardando High Score en localStorage:", err);
      }
    }
  }

  let persistedToSupabase = false;

  // Intentar sincronización con Supabase si está disponible en el cliente
  if (
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase.from("game_scores").insert({
          user_id: user.id,
          game_id: gameId,
          score: score,
        });

        if (!error) {
          persistedToSupabase = true;
        }
      }
    } catch {
      // Degradar silenciosamente a localStorage
    }
  }

  return {
    highScore: currentHighScore,
    isNewRecord,
    persistedToSupabase,
  };
}
