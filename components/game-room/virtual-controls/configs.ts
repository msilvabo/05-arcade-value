import { GameVirtualControlsConfig } from "./types";

export const GAME_VIRTUAL_CONTROLS: Record<string, GameVirtualControlsConfig> =
  {
    "chrono-snake": {
      gameId: "chrono-snake",
      dpadType: "4-way",
      primaryButtons: [
        {
          id: "pause",
          label: "PAUSA",
          icon: "pause",
          key: "Escape",
          color: "amber",
          size: "sm",
        },
      ],
    },
    "cyber-tetris-99": {
      gameId: "cyber-tetris-99",
      dpadType: "4-way",
      primaryButtons: [
        {
          id: "rotate",
          label: "ROTAR",
          sublabel: "A",
          key: "ArrowUp",
          color: "cyan",
          size: "lg",
        },
        {
          id: "hard-drop",
          label: "DROP",
          sublabel: "B",
          key: "Space",
          color: "magenta",
          size: "md",
        },
        {
          id: "hold",
          label: "HOLD",
          sublabel: "C",
          key: "KeyC",
          color: "green",
          size: "sm",
        },
      ],
    },
    "asteroids-2084": {
      gameId: "asteroids-2084",
      dpadType: "2-way-horizontal",
      primaryButtons: [
        {
          id: "fire",
          label: "FUEGO",
          sublabel: "ESPACIO",
          key: "Space",
          color: "magenta",
          size: "lg",
        },
        {
          id: "thrust",
          label: "PROPULSIÓN",
          sublabel: "ARRIBA",
          key: "ArrowUp",
          color: "cyan",
          size: "md",
        },
        {
          id: "warp",
          label: "HIPER",
          sublabel: "W",
          key: "KeyW",
          color: "amber",
          size: "sm",
        },
      ],
    },
    "arkanoid-neon-revenge": {
      gameId: "arkanoid-neon-revenge",
      dpadType: "2-way-horizontal",
      directTouchCanvas: true,
      primaryButtons: [
        {
          id: "launch",
          label: "LANZAR",
          sublabel: "ESPACIO",
          key: "Space",
          color: "cyan",
          size: "md",
        },
      ],
    },
  };

const ALIAS_MAP: Record<string, string> = {
  snake: "chrono-snake",
  "retro-snake": "chrono-snake",
  tetris: "cyber-tetris-99",
  asteroids: "asteroids-2084",
  arkanoid: "arkanoid-neon-revenge",
  breakout: "arkanoid-neon-revenge",
};

export const getGameVirtualControls = (
  gameId: string
): GameVirtualControlsConfig => {
  const canonicalId = ALIAS_MAP[gameId] || gameId;
  return (
    GAME_VIRTUAL_CONTROLS[canonicalId] || {
      gameId: canonicalId,
      dpadType: "4-way",
      primaryButtons: [
        {
          id: "action",
          label: "ACCION",
          key: "Space",
          color: "cyan",
          size: "lg",
        },
      ],
    }
  );
};
