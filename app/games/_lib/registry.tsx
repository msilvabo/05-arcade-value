import React, { FC } from "react";
import { Game } from "@/types/game";
import { GameExtendedDetails } from "@/types/launcher";
import { CabinetGameProps, GameModule } from "./types";

import { asteroidsModule } from "../_games/asteroids-2084";
import { arkanoidModule } from "../_games/arkanoid-neon-revenge";
import { tetrisModule } from "../_games/cyber-tetris-99";
import { spaceInvadersModule } from "../_games/space-invaders-galaxy";
import { pacmanModule } from "../_games/pacman-neon-maze";
import { snakeModule } from "../_games/chrono-snake";

const GAME_MODULES: GameModule[] = [
  arkanoidModule,
  tetrisModule,
  spaceInvadersModule,
  pacmanModule,
  snakeModule,
  asteroidsModule,
];

// Mapa indexado por ID canónico y todos sus alias
const MODULE_MAP: Map<string, GameModule> = new Map();
GAME_MODULES.forEach((mod) => {
  MODULE_MAP.set(mod.id.toLowerCase(), mod);
  mod.aliases.forEach((alias) => {
    MODULE_MAP.set(alias.toLowerCase(), mod);
  });
});

export function findGameModule(idOrAlias: string): GameModule | undefined {
  if (!idOrAlias) return undefined;
  return MODULE_MAP.get(idOrAlias.toLowerCase().trim());
}

export function getAllGames(): Game[] {
  return GAME_MODULES.map((m) => m.summary);
}

export function getAllGameConfigs(): GameExtendedDetails[] {
  return GAME_MODULES.map((m) => m.details);
}

export function getGameConfig(idOrAlias: string): GameExtendedDetails {
  const mod = findGameModule(idOrAlias);
  if (mod) {
    return mod.details;
  }
  // Fallback seguro a Arkanoid
  return arkanoidModule.details;
}

export function hasGameCabinetComponent(idOrAlias: string): boolean {
  const mod = findGameModule(idOrAlias);
  return Boolean(mod?.CabinetComponent);
}

export const CabinetGameHost: FC<{
  gameId: string;
  gameProps: CabinetGameProps;
}> = ({ gameId, gameProps }) => {
  const mod = findGameModule(gameId);
  if (!mod?.CabinetComponent) return null;
  const Component = mod.CabinetComponent;
  return <Component {...gameProps} />;
};

export function getAvailableGameIds(): string[] {
  return GAME_MODULES.map((m) => m.id);
}
