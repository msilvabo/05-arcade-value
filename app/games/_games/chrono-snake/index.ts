import { GameModule } from "../../_lib/types";
import { SNAKE_SUMMARY, SNAKE_DETAILS } from "./config";

export const snakeModule: GameModule = {
  id: "chrono-snake",
  aliases: ["snake", "chrono-snake"],
  summary: SNAKE_SUMMARY,
  details: SNAKE_DETAILS,
};

export { SNAKE_SUMMARY, SNAKE_DETAILS } from "./config";
