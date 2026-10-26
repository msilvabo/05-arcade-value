import { LeaderboardEntry, LeaderboardPeriod } from "@/types/leaderboard";
import { formatArcadeDate, getBadgeByRank } from "@/types/database";
import { LEADERBOARD_ENTRIES } from "@/data/leaderboard";
import { createPublicClient } from "@/lib/supabase/server";

interface GetLeaderboardOptions {
  gameId?: string;
  period?: LeaderboardPeriod;
  limit?: number;
}

interface SupabaseScoreJoin {
  id: string;
  user_id: string | null;
  player_name: string | null;
  game_id: string;
  score: number;
  accuracy: string | null;
  combo: string | null;
  created_at: string;
  profiles: {
    gamer_tag: string;
    avatar_url: string | null;
  } | null;
  games: {
    title: string;
  } | null;
}

export interface SaveScoreParams {
  gameId: string;
  score: number;
  nickname?: string;
  accuracy?: string;
  combo?: string;
  userId?: string | null;
}

/**
 * Consulta la tabla `scores` de Supabase realizando join con `profiles` y `games`.
 * En caso de fallo o ausencia de conexión, utiliza `LEADERBOARD_ENTRIES` como fallback resiliente.
 */
export async function getLeaderboardEntries(
  options: GetLeaderboardOptions = {}
): Promise<LeaderboardEntry[]> {
  const { gameId, limit = 50 } = options;

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return getFallbackEntries(gameId, limit);
    }

    const supabase = createPublicClient();

    let query = supabase
      .from("scores")
      .select(
        `
        id,
        user_id,
        player_name,
        game_id,
        score,
        accuracy,
        combo,
        created_at,
        profiles (
          gamer_tag,
          avatar_url
        ),
        games (
          title
        )
      `
      )
      .order("score", { ascending: false })
      .limit(limit);

    if (gameId && gameId !== "all") {
      query = query.eq("game_id", gameId);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return getFallbackEntries(gameId, limit);
    }

    const scoreRows = data as unknown as SupabaseScoreJoin[];

    return scoreRows.map((row, index) => {
      const rank = index + 1;
      const displayTag =
        row.player_name ||
        row.profiles?.gamer_tag ||
        (row.user_id ? `PLAYER_${row.user_id.slice(0, 6)}` : "INVITADO");

      return {
        rank,
        gamerTag: displayTag,
        avatar: row.profiles?.avatar_url || "",
        score: row.score,
        formattedScore: row.score.toLocaleString(),
        gameId: row.game_id,
        gameTitle: row.games?.title || row.game_id.toUpperCase(),
        badge: getBadgeByRank(rank),
        date: formatArcadeDate(row.created_at),
        accuracy: row.accuracy || "100%",
        combo: row.combo || "x1",
      };
    });
  } catch (err) {
    console.warn("Aviso: fallback local para leaderboard:", err);
    return getFallbackEntries(gameId, limit);
  }
}

/**
 * Inserta un nuevo registro de puntuación en Supabase.
 * Soporta tanto jugadores autenticados como no autenticados / invitados con nickname libre.
 */
export async function recordScore(
  params: SaveScoreParams
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return { success: false, error: "Supabase no está configurado" };
    }

    const supabase = createPublicClient();
    const tag = (params.nickname || "PILOTO_VAULT").toUpperCase().trim();

    const { error } = await supabase.from("scores").insert({
      game_id: params.gameId,
      score: params.score,
      player_name: tag,
      user_id: params.userId || null,
      accuracy: params.accuracy || "100%",
      combo: params.combo || "x1",
    });

    if (error) {
      console.error("Error al registrar puntuación en Supabase:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    console.error("Error en recordScore:", message);
    return { success: false, error: message };
  }
}

/**
 * Filtra los datos mock locales en caso de degradación o fallback
 */
function getFallbackEntries(
  gameId?: string,
  limit: number = 50
): LeaderboardEntry[] {
  let entries = [...LEADERBOARD_ENTRIES];

  if (gameId && gameId !== "all") {
    entries = entries.filter((e) => {
      return (
        e.gameId === gameId ||
        gameId.startsWith(e.gameId) ||
        e.gameId.startsWith(gameId)
      );
    });
  }

  return entries.slice(0, limit);
}
