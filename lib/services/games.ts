import { Game } from "@/types/game";
import { GameRow, mapGameRowToGame } from "@/types/database";
import { GAMES } from "@/data/games";
import { createPublicClient } from "@/lib/supabase/server";

/**
 * Obtiene la lista completa de juegos desde Supabase.
 * En caso de desconexión, error o ausencia de credenciales, retorna los datos locales de `GAMES`.
 */
export async function getGames(): Promise<Game[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return GAMES;
    }

    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .order("plays_count", { ascending: false });

    if (error || !data || data.length === 0) {
      return GAMES;
    }

    return (data as GameRow[]).map(mapGameRowToGame);
  } catch (err) {
    console.warn("Aviso: fallback local para juegos:", err);
    return GAMES;
  }
}

/**
 * Obtiene un juego por su ID desde Supabase con fallback local.
 */
export async function getGameById(id: string): Promise<Game | undefined> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return GAMES.find((g) => g.id === id);
    }

    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return GAMES.find((g) => g.id === id);
    }

    return mapGameRowToGame(data as GameRow);
  } catch {
    return GAMES.find((g) => g.id === id);
  }
}
