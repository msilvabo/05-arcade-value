import { createClient } from "@/lib/supabase/client";

export interface GameScorePayload {
  gameId: string;
  score: number;
  userId?: string | null;
  playerName?: string;
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
  score: number,
  playerName?: string
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

  // Sincronización con Supabase (para usuarios autenticados o invitados)
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

      const { error } = await supabase.from("scores").insert({
        user_id: user?.id || null,
        game_id: gameId,
        score: score,
        player_name:
          playerName || user?.user_metadata?.gamer_tag || "PILOTO_VAULT",
        accuracy: "100%",
        combo: "x1",
      });

      if (!error) {
        persistedToSupabase = true;
      } else {
        console.warn("No se pudo persistir récord en Supabase:", error.message);
      }
    } catch (err) {
      console.warn("Fallo de conexión al registrar récord en Supabase:", err);
    }
  }

  return {
    highScore: currentHighScore,
    isNewRecord,
    persistedToSupabase,
  };
}
