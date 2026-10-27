import { GameSkinId, RetroPaletteVariant } from "@/app/games/_lib/types";

export interface AsteroidsSkinPalette {
  id: GameSkinId;
  name: string;
  variant?: RetroPaletteVariant;
  background: string;
  gridLine: string;
  ship: {
    stroke: string;
    glowBlur: number;
    glowColor: string;
    thrustStroke: string;
    thrustGlowColor: string;
  };
  asteroid: {
    stroke: string;
    glowBlur: number;
    glowColor: string;
  };
  bullet: {
    fill: string;
    glowBlur: number;
    glowColor: string;
  };
  powerUp: {
    stroke: string;
    fill: string;
    glowBlur: number;
    glowColor: string;
  };
  particles: string[];
  hudText: {
    fill: string;
    glowBlur: number;
    glowColor: string;
  };
}

export interface AsteroidsSkinsMap {
  clasico: AsteroidsSkinPalette;
  neon: AsteroidsSkinPalette;
  retro: {
    amber: AsteroidsSkinPalette;
    green: AsteroidsSkinPalette;
  };
}

export const ASTEROIDS_SKINS: AsteroidsSkinsMap = {
  clasico: {
    id: "clasico",
    name: "Arcade Clásico (1980s)",
    background: "#050608",
    gridLine: "rgba(255, 255, 255, 0.04)",
    ship: {
      stroke: "#ffffff",
      glowBlur: 0,
      glowColor: "transparent",
      thrustStroke: "rgba(255, 120, 0, 0.95)",
      thrustGlowColor: "#ff7800",
    },
    asteroid: {
      stroke: "#ffffff",
      glowBlur: 2,
      glowColor: "rgba(255, 255, 255, 0.3)",
    },
    bullet: {
      fill: "#00d2ff",
      glowBlur: 4,
      glowColor: "#00d2ff",
    },
    powerUp: {
      stroke: "#ffcf3a",
      fill: "#ffcf3a",
      glowBlur: 3,
      glowColor: "#ffcf3a",
    },
    particles: ["#ffffff", "#ffcf3a", "#00d2ff"],
    hudText: {
      fill: "#ffcf3a",
      glowBlur: 2,
      glowColor: "#ffcf3a",
    },
  },
  neon: {
    id: "neon",
    name: "Cyberpunk Neón (2084)",
    background: "#04050e",
    gridLine: "rgba(0, 245, 255, 0.12)",
    ship: {
      stroke: "#00f5ff",
      glowBlur: 16,
      glowColor: "#00f5ff",
      thrustStroke: "rgba(255, 0, 110, 0.95)",
      thrustGlowColor: "#ff006e",
    },
    asteroid: {
      stroke: "#ff006e",
      glowBlur: 14,
      glowColor: "#ff006e",
    },
    bullet: {
      fill: "#00f5ff",
      glowBlur: 12,
      glowColor: "#00f5ff",
    },
    powerUp: {
      stroke: "#00f5ff",
      fill: "#ff006e",
      glowBlur: 16,
      glowColor: "#00f5ff",
    },
    particles: ["#00f5ff", "#ff006e", "#a855f7", "#00ff88"],
    hudText: {
      fill: "#00f5ff",
      glowBlur: 10,
      glowColor: "#00f5ff",
    },
  },
  retro: {
    amber: {
      id: "retro",
      name: "Fósforo Ámbar P3",
      variant: "amber",
      background: "#090805",
      gridLine: "rgba(255, 170, 0, 0.05)",
      ship: {
        stroke: "#ffaa00",
        glowBlur: 10,
        glowColor: "rgba(255, 170, 0, 0.6)",
        thrustStroke: "rgba(255, 85, 0, 0.95)",
        thrustGlowColor: "#ff5500",
      },
      asteroid: {
        stroke: "#ffc247",
        glowBlur: 8,
        glowColor: "rgba(255, 170, 0, 0.4)",
      },
      bullet: {
        fill: "#ffe082",
        glowBlur: 8,
        glowColor: "rgba(255, 170, 0, 0.8)",
      },
      powerUp: {
        stroke: "#ffe082",
        fill: "#ffaa00",
        glowBlur: 8,
        glowColor: "rgba(255, 170, 0, 0.6)",
      },
      particles: ["#ffaa00", "#ffc247", "#ffe082", "#ff7700"],
      hudText: {
        fill: "#ffaa00",
        glowBlur: 6,
        glowColor: "rgba(255, 170, 0, 0.6)",
      },
    },
    green: {
      id: "retro",
      name: "Fósforo Verde P1",
      variant: "green",
      background: "#040a05",
      gridLine: "rgba(51, 255, 51, 0.05)",
      ship: {
        stroke: "#33ff33",
        glowBlur: 10,
        glowColor: "rgba(51, 255, 51, 0.6)",
        thrustStroke: "rgba(163, 255, 163, 0.95)",
        thrustGlowColor: "#33ff33",
      },
      asteroid: {
        stroke: "#66ff66",
        glowBlur: 8,
        glowColor: "rgba(51, 255, 51, 0.4)",
      },
      bullet: {
        fill: "#a3ffa3",
        glowBlur: 8,
        glowColor: "rgba(51, 255, 51, 0.8)",
      },
      powerUp: {
        stroke: "#a3ffa3",
        fill: "#33ff33",
        glowBlur: 8,
        glowColor: "rgba(51, 255, 51, 0.6)",
      },
      particles: ["#33ff33", "#66ff66", "#a3ffa3", "#1aff1a"],
      hudText: {
        fill: "#33ff33",
        glowBlur: 6,
        glowColor: "rgba(51, 255, 51, 0.6)",
      },
    },
  },
};

export function getAsteroidsSkinPalette(
  skin: GameSkinId = "clasico",
  retroVariant: RetroPaletteVariant = "amber"
): AsteroidsSkinPalette {
  if (skin === "retro") {
    return retroVariant === "green"
      ? ASTEROIDS_SKINS.retro.green
      : ASTEROIDS_SKINS.retro.amber;
  }
  return ASTEROIDS_SKINS[skin] ?? ASTEROIDS_SKINS.clasico;
}
