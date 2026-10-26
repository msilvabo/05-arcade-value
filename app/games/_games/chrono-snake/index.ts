import { GameModule } from "../../_lib/types";
import { SNAKE_SUMMARY, SNAKE_DETAILS } from "./config";
import { SnakeGame } from "./SnakeGame";

export const snakeModule: GameModule = {
  id: "chrono-snake",
  aliases: ["snake", "chrono-snake"],
  summary: SNAKE_SUMMARY,
  details: SNAKE_DETAILS,
  CabinetComponent: SnakeGame,
};

export { SnakeGame } from "./SnakeGame";
export { SNAKE_SUMMARY, SNAKE_DETAILS } from "./config";
export * from "./spritesheet";
