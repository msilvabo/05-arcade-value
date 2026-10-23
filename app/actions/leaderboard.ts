"use server";

import {
  getLeaderboardEntries,
  recordScore,
  SaveScoreParams,
} from "@/lib/services/leaderboard";
import { LeaderboardEntry, LeaderboardPeriod } from "@/types/leaderboard";
import { revalidatePath } from "next/cache";

/**
 * Server Action para consultar entradas del leaderboard con filtro de juego y período.
 */
export async function getLeaderboardAction(
  gameId?: string,
  period?: LeaderboardPeriod
): Promise<LeaderboardEntry[]> {
  return await getLeaderboardEntries({ gameId, period });
}

/**
 * Server Action para registrar la puntuación de cualquier jugador (autenticado o invitado).
 */
export async function submitScoreAction(
  params: SaveScoreParams
): Promise<{ success: boolean; error?: string }> {
  const result = await recordScore(params);
  if (result.success) {
    revalidatePath("/leaderboard");
  }
  return result;
}
