import { GameModule } from "../../_lib/types";
import { ASTEROIDS_SUMMARY, ASTEROIDS_DETAILS } from "./config";
import { AsteroidsGame } from "./AsteroidsGame";

export const asteroidsModule: GameModule = {
  id: "asteroids-2084",
  aliases: ["asteroids", "asteroids-2084"],
  summary: ASTEROIDS_SUMMARY,
  details: ASTEROIDS_DETAILS,
  CabinetComponent: AsteroidsGame,
};

export { AsteroidsGame } from "./AsteroidsGame";
export { ASTEROIDS_SUMMARY, ASTEROIDS_DETAILS } from "./config";
