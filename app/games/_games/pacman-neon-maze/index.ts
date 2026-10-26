import { GameModule } from "../../_lib/types";
import { PACMAN_SUMMARY, PACMAN_DETAILS } from "./config";

export const pacmanModule: GameModule = {
  id: "pacman-neon-maze",
  aliases: ["pacman", "pacman-neon-maze"],
  summary: PACMAN_SUMMARY,
  details: PACMAN_DETAILS,
};

export { PACMAN_SUMMARY, PACMAN_DETAILS } from "./config";
