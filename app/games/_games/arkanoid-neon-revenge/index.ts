import { GameModule } from "../../_lib/types";
import { ARKANOID_SUMMARY, ARKANOID_DETAILS } from "./config";
import { ArkanoidGame } from "./ArkanoidGame";

export const arkanoidModule: GameModule = {
  id: "arkanoid-neon-revenge",
  aliases: ["arkanoid", "arkanoid-neon-revenge"],
  summary: ARKANOID_SUMMARY,
  details: ARKANOID_DETAILS,
  CabinetComponent: ArkanoidGame,
};

export { ArkanoidGame } from "./ArkanoidGame";
export { ARKANOID_SUMMARY, ARKANOID_DETAILS } from "./config";
export { LEVELS } from "./levels";
export * from "./spritesheet";
