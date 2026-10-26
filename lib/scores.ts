import { createClient } from "@/lib/supabase/client";
import { findGameModule, getGameConfig } from "@/app/games/_lib/registry";
import { LeaderboardEntry, LeaderboardPeriod } from "@/types/leaderboard";
import { LEADERBOARD_ENTRIES } from "@/data/leaderboard";

export interface GameScorePayload {
  gameId: string;
  score: number;
  playerName?: string;
  userId?: string | null;
  accuracy?: string;
  combo?: string;
}

export interface HighScoreResult {
  highScore: number;
  isNewRecord: boolean;
  persistedToSupabase: boolean;
  error?: string;
}

export interface SaveScoreParams {
  gameId: string;
  score: number;
  playerName: string;
  userId?: string | null;
  accuracy?: string;
  combo?: string;
}

const getStorageKey = (gameId: string) => `arcade_vault_highscore_${gameId}`;

export function toCanonicalGameId(idOrAlias: string): string {
  if (!idOrAlias) return "asteroids-2084";
  const mod = findGameModule(idOrAlias);
  return mod?.id || idOrAlias;
}

export function getHighScore(gameId: string, fallbackDefault = 0): number {
  if (typeof window === "undefined") return fallbackDefault;
  try {
    const canonical = toCanonicalGameId(gameId);
    const raw =
      localStorage.getItem(getStorageKey(canonical)) ||
      localStorage.getItem(getStorageKey(gameId));
    if (!raw) return fallbackDefault;
    const parsed = parseInt(raw, 10);
    return isNaN(parsed) ? fallbackDefault : parsed;
  } catch {
    return fallbackDefault;
  }
}

/**
 * Guarda el rÃ©cord en localStorage y opcionalmente en Supabase si se proveen datos bÃ¡sicos.
 */
export async function saveGameScore(
  gameId: string,
  score: number,
  playerName?: string
): Promise<HighScoreResult> {
  const canonicalId = toCanonicalGameId(gameId);
  let isNewRecord = false;
  let currentHighScore = getHighScore(canonicalId, 0);

  if (score > currentHighScore) {
    currentHighScore = score;
    isNewRecord = true;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(getStorageKey(canonicalId), score.toString());
      } catch (err) {
        console.warn("Error guardando High Score en localStorage:", err);
      }
    }
  }

  return {
    highScore: currentHighScore,
    isNewRecord,
    persistedToSupabase: false,
  };
}

/**
 * Registra una puntuaciÃ³n con nombre/alias en la tabla `scores` de Supabase
 */
interface LocalStoredScore {
  id: string;
  game_id: string;
  score: number;
  player_name: string;
  accuracy: string;
  combo: string;
  created_at: string;
}

function saveToLocalScoresArray(record: LocalStoredScore) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem("arcade_vault_all_scores");
    const list: LocalStoredScore[] = raw ? JSON.parse(raw) : [];
    list.unshift(record);
    localStorage.setItem(
      "arcade_vault_all_scores",
      JSON.stringify(list.slice(0, 100))
    );
  } catch (err) {
    console.warn("Fallo guardando score en array local:", err);
  }
}

function getLocalScores(canonicalId: string | null): LeaderboardEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("arcade_vault_all_scores");
    if (!raw) return [];
    const list: LocalStoredScore[] = JSON.parse(raw);
    const filtered = canonicalId
      ? list.filter((r) => toCanonicalGameId(r.game_id) === canonicalId)
      : list;

    return filtered.map((r) => {
      const gameCfg = getGameConfig(r.game_id);
      return {
        rank: 0,
        gamerTag: r.player_name,
        avatar: "",
        score: r.score,
        formattedScore: r.score.toLocaleString(),
        gameId: r.game_id,
        gameTitle: gameCfg.title,
        badge: "ROOKIE",
        date: formatScoreDate(r.created_at),
        accuracy: r.accuracy || "100%",
        combo: r.combo || "x1",
      };
    });
  } catch {
    return [];
  }
}

export async function saveScoreRecord({
  gameId,
  score,
  playerName,
  userId,
  accuracy = "100%",
  combo = "x1",
}: SaveScoreParams): Promise<{
  success: boolean;
  isNewRecord: boolean;
  error?: string;
}> {
  const canonicalId = toCanonicalGameId(gameId);

  // Actualizar High Score local
  const currentHigh = getHighScore(canonicalId, 0);
  const isNewRecord = score > currentHigh;
  if (isNewRecord && typeof window !== "undefined") {
    try {
      localStorage.setItem(getStorageKey(canonicalId), score.toString());
    } catch {
      // Ignorar fallo de localStorage
    }
  }

  // Guardar siempre en historial local de scores
  saveToLocalScoresArray({
    id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    game_id: canonicalId,
    score,
    player_name: playerName.trim().toUpperCase() || "PILOTO_VAULT",
    accuracy,
    combo,
    created_at: new Date().toISOString(),
  });

  // Guardar en Supabase tabla `scores`
  try {
    const supabase = createClient();

    // Si no se proporcionó userId, intentar obtener el usuario logueado actual
    let effectiveUserId = userId || null;
    let effectivePlayerName = playerName.trim() || "PILOTO_VAULT";

    if (!effectiveUserId) {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          effectiveUserId = user.id;
          if (!playerName.trim()) {
            effectivePlayerName =
              user.user_metadata?.gamer_tag ||
              user.email?.split("@")[0].toUpperCase() ||
              "PILOTO_VAULT";
          }
        }
      } catch {
        // Modo anónimo/offline
      }
    }

    const { error } = await supabase.from("scores").insert({
      game_id: canonicalId,
      score: score,
      player_name: effectivePlayerName.toUpperCase(),
      user_id: effectiveUserId,
      accuracy,
      combo,
    });

    if (error) {
      console.error("Error insertando score en Supabase:", error);
      return { success: false, isNewRecord, error: error.message };
    }

    return { success: true, isNewRecord };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error de red";
    console.error("Error de conexión guardando score:", err);
    return { success: false, isNewRecord, error: msg };
  }
}

function formatScoreDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d
      .toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase();
  } catch {
    return "OCT 2026";
  }
}

function getBadgeForRank(
  rank: number
): "CHAMPION" | "MASTER" | "VETERAN" | "ROOKIE" {
  if (rank === 1) return "CHAMPION";
  if (rank === 2) return "MASTER";
  if (rank === 3) return "VETERAN";
  return "ROOKIE";
}

/**
 * Consulta la tabla `scores` en Supabase unida con perfiles y devuelve la lista formateada para el Leaderboard.
 */
export async function fetchLeaderboardScores(
  gameId?: string,
  period: LeaderboardPeriod = "all-time"
): Promise<LeaderboardEntry[]> {
  try {
    const supabase = createClient();
    const canonicalId =
      gameId && gameId !== "all" ? toCanonicalGameId(gameId) : null;

    let query = supabase
      .from("scores")
      .select(
        `
        id,
        game_id,
        score,
        accuracy,
        combo,
        created_at,
        player_name,
        profiles (
          gamer_tag,
          avatar_url
        )
      `
      )
      .order("score", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(50);

    if (canonicalId) {
      query = query.eq("game_id", canonicalId);
    }

    if (period === "weekly") {
      const weekAgo = new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000
      ).toISOString();
      query = query.gte("created_at", weekAgo);
    } else if (period === "monthly") {
      const monthAgo = new Date(
        Date.now() - 30 * 24 * 60 * 60 * 1000
      ).toISOString();
      query = query.gte("created_at", monthAgo);
    }

    const { data } = await query;

    // Convertir registros de Supabase
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const remoteEntries: LeaderboardEntry[] = (data || []).map((row: any) => {
      const gameCfg = getGameConfig(row.game_id);
      const gamerTag =
        row.player_name || row.profiles?.gamer_tag || "PILOTO_VAULT";
      const avatar = row.profiles?.avatar_url || "";

      return {
        rank: 0,
        gamerTag,
        avatar,
        score: row.score,
        formattedScore: row.score.toLocaleString(),
        gameId: row.game_id,
        gameTitle: gameCfg.title,
        badge: "ROOKIE",
        date: formatScoreDate(row.created_at),
        accuracy: row.accuracy || "100%",
        combo: row.combo || "x1",
      };
    });

    // Puntuaciones locales y de referencia
    const localEntries = getLocalScores(canonicalId);
    const benchmarkEntries = getFallbackEntries(canonicalId);

    // Combinar todas las fuentes garantizando que siempre se muestren los 10 mejores
    const combinedMap = new Map<string, LeaderboardEntry>();

    // 1. Agregar referencias de catálogo (benchmark)
    benchmarkEntries.forEach((b) => {
      const key = `${toCanonicalGameId(b.gameId)}_${b.gamerTag.toUpperCase()}_${b.score}`;
      combinedMap.set(key, b);
    });

    // 2. Agregar puntuaciones locales
    localEntries.forEach((l) => {
      const key = `${toCanonicalGameId(l.gameId)}_${l.gamerTag.toUpperCase()}_${l.score}`;
      combinedMap.set(key, l);
    });

    // 3. Agregar puntuaciones remotas de Supabase
    remoteEntries.forEach((r) => {
      const key = `${toCanonicalGameId(r.gameId)}_${r.gamerTag.toUpperCase()}_${r.score}`;
      combinedMap.set(key, r);
    });

    const merged = Array.from(combinedMap.values());
    merged.sort((a, b) => b.score - a.score);

    // Asignar rangos y medallas correlativas a los mejores
    return merged.slice(0, 50).map((entry, index) => {
      const rank = index + 1;
      return {
        ...entry,
        rank,
        badge: getBadgeForRank(rank),
        formattedScore: entry.score.toLocaleString(),
      };
    });
  } catch (err) {
    console.warn("Error de conexión al cargar leaderboard:", err);
    return getFallbackEntries(gameId ? toCanonicalGameId(gameId) : null);
  }
}

function getFallbackEntries(canonicalId: string | null): LeaderboardEntry[] {
  if (!canonicalId) return LEADERBOARD_ENTRIES;

  const filtered = LEADERBOARD_ENTRIES.filter((e) => {
    return (
      toCanonicalGameId(e.gameId) === canonicalId ||
      e.gameId.toLowerCase().includes(canonicalId.toLowerCase())
    );
  });

  return filtered.length > 0 ? filtered : LEADERBOARD_ENTRIES;
}
