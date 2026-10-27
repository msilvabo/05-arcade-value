import { FC } from "react";
import { GameExtendedDetails } from "@/types/launcher";
import { Game } from "@/types/game";

export type GameSkinId = "clasico" | "neon" | "retro";
export type RetroPaletteVariant = "amber" | "green";

export interface CabinetGameProps {
  isPaused: boolean;
  onScoreIncrement?: (pts: number) => void;
  onScoreChange?: (score: number) => void;
  onLivesChange?: (lives: number) => void;
  onLevelChange?: (level: number) => void;
  onGameOver?: (finalScore: number) => void;
  restartSignal?: number;
  audioOn?: boolean;
  volume?: number;
  skin?: GameSkinId;
  retroVariant?: RetroPaletteVariant;
}

export interface GameModule {
  id: string;
  aliases: string[];
  summary: Game;
  details: GameExtendedDetails;
  CabinetComponent?: FC<CabinetGameProps>;
}
