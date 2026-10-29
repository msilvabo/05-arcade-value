import { GameModule } from "../../_lib/types";
import {
  CYBER_FROGGER_ACTION_SUMMARY,
  CYBER_FROGGER_ACTION_DETAILS,
} from "./config";
import { CyberFroggerActionGame } from "./CyberFroggerActionGame";

export const cyberFroggerActionModule: GameModule = {
  id: "cyber-frogger-action",
  aliases: ["cyber-frogger", "frogger-action", "data-highway"],
  summary: CYBER_FROGGER_ACTION_SUMMARY,
  details: CYBER_FROGGER_ACTION_DETAILS,
  CabinetComponent: CyberFroggerActionGame,
};

export { CyberFroggerActionGame } from "./CyberFroggerActionGame";
export {
  CYBER_FROGGER_ACTION_SUMMARY,
  CYBER_FROGGER_ACTION_DETAILS,
} from "./config";
