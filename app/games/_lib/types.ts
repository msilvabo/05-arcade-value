import { FC } from "react";
import { GameExtendedDetails } from "@/types/launcher";
import { Game } from "@/types/game";

export interface CabinetGameProps {
  isPaused: boolean;
  onScoreIncrement?: (pts: number) => void;
  onScoreChange?: (score: number) => void;
  onLivesChange?: (lives: number) => void;
  onLevelChange?: (level: number) => void;
  onGameOver?: (finalScore: number) => void;
  restartSignal?: number;
}

export interface GameModule {
  id: string;
  aliases: string[];
  summary: Game;
  details: GameExtendedDetails;
  CabinetComponent?: FC<CabinetGameProps>;
}
