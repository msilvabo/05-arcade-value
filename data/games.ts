import { CategoryTab, Game } from "@/types/game";
import { getAllGames } from "@/app/games/_lib/registry";

export const CATEGORIES: CategoryTab[] = [
  { key: "all", label: "TODOS (06)", count: 6 },
  { key: "shoot-em-up", label: "SHOOT 'EM UP" },
  { key: "puzzle", label: "PUZZLE" },
  { key: "action-maze", label: "ACCIÓN / LABERINTO" },
  { key: "classics-80s", label: "CLÁSICOS 80s" },
  { key: "popular", label: "POPULARES" },
];

export const GAMES: Game[] = getAllGames();
