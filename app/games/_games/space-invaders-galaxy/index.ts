import { GameModule } from "../../_lib/types";
import { SPACE_INVADERS_SUMMARY, SPACE_INVADERS_DETAILS } from "./config";

export const spaceInvadersModule: GameModule = {
  id: "space-invaders-galaxy",
  aliases: ["space-invaders", "space-invaders-galaxy"],
  summary: SPACE_INVADERS_SUMMARY,
  details: SPACE_INVADERS_DETAILS,
};

export { SPACE_INVADERS_SUMMARY, SPACE_INVADERS_DETAILS } from "./config";
