import { GameModule } from "../../_lib/types";
import { TETRIS_SUMMARY, TETRIS_DETAILS } from "./config";
import { TetrisGame } from "./TetrisGame";

export const tetrisModule: GameModule = {
  id: "cyber-tetris-99",
  aliases: ["tetris", "cyber-tetris-99"],
  summary: TETRIS_SUMMARY,
  details: TETRIS_DETAILS,
  CabinetComponent: TetrisGame,
};

export { TetrisGame } from "./TetrisGame";
export { TETRIS_SUMMARY, TETRIS_DETAILS } from "./config";
export * from "./engine";
export * from "./skins";
