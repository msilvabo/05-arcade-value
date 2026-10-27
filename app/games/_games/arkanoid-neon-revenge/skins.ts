import { GameSkinId, RetroPaletteVariant } from "@/app/games/_lib/types";
import { BlockColor } from "./spritesheet";

export interface ArkanoidSkinPalette {
  id: GameSkinId;
  name: string;
  variant?: RetroPaletteVariant;
  useSpritesheet: boolean;
  background: string;
  gridLine: string;
  paddle: {
    fill: string;
    stroke: string;
    accent: string;
    glowBlur: number;
    glowColor: string;
  };
  ball: {
    fill: string;
    glowBlur: number;
    glowColor: string;
  };
  blockColors: Record<BlockColor, string>;
  blockGlowBlur: number;
  blockGlowColor: string;
  particles: string[];
  hudText: {
    fill: string;
    glowBlur: number;
    glowColor: string;
  };
}

export interface ArkanoidSkinsMap {
  clasico: ArkanoidSkinPalette;
  neon: ArkanoidSkinPalette;
  retro: {
    amber: ArkanoidSkinPalette;
    green: ArkanoidSkinPalette;
  };
}

export const ARKANOID_SKINS: ArkanoidSkinsMap = {
  clasico: {
    id: "clasico",
    name: "Arcade Clásico (1980s)",
    useSpritesheet: true,
    background: "#050608",
    gridLine: "rgba(255, 255, 255, 0.04)",
    paddle: {
      fill: "#ffffff",
      stroke: "#00d2ff",
      accent: "#ff3b30",
      glowBlur: 0,
      glowColor: "transparent",
    },
    ball: {
      fill: "#ffffff",
      glowBlur: 2,
      glowColor: "rgba(255, 255, 255, 0.5)",
    },
    blockColors: {
      red: "#ff3b30",
      yellow: "#ffcf3a",
      cyan: "#00d2ff",
      magenta: "#e040fb",
      hotpink: "#ff4081",
      green: "#00e676",
      gray: "#b0bec5",
    },
    blockGlowBlur: 0,
    blockGlowColor: "transparent",
    particles: ["#ffffff", "#ffcf3a", "#00d2ff", "#ff3b30"],
    hudText: {
      fill: "#ffcf3a",
      glowBlur: 2,
      glowColor: "#ffcf3a",
    },
  },
  neon: {
    id: "neon",
    name: "Cyberpunk Neón (2084)",
    useSpritesheet: false,
    background: "#04050e",
    gridLine: "rgba(0, 245, 255, 0.08)",
    paddle: {
      fill: "#00f5ff",
      stroke: "#ff006e",
      accent: "#a855f7",
      glowBlur: 18,
      glowColor: "#00f5ff",
    },
    ball: {
      fill: "#00f5ff",
      glowBlur: 16,
      glowColor: "#00f5ff",
    },
    blockColors: {
      red: "#ff0055",
      yellow: "#ffe600",
      cyan: "#00f5ff",
      magenta: "#ff006e",
      hotpink: "#ff2a85",
      green: "#00ff88",
      gray: "#708090",
    },
    blockGlowBlur: 14,
    blockGlowColor: "#00f5ff",
    particles: ["#00f5ff", "#ff006e", "#a855f7", "#00ff88", "#ffe600"],
    hudText: {
      fill: "#00f5ff",
      glowBlur: 12,
      glowColor: "#00f5ff",
    },
  },
  retro: {
    amber: {
      id: "retro",
      name: "Fósforo Ámbar P3",
      variant: "amber",
      useSpritesheet: false,
      background: "#090805",
      gridLine: "rgba(255, 170, 0, 0.06)",
      paddle: {
        fill: "#ffaa00",
        stroke: "#ffc247",
        accent: "#ff5500",
        glowBlur: 10,
        glowColor: "rgba(255, 170, 0, 0.6)",
      },
      ball: {
        fill: "#ffe082",
        glowBlur: 10,
        glowColor: "rgba(255, 170, 0, 0.7)",
      },
      blockColors: {
        red: "#ff5500", // Naranja-ámbar de alta energía
        yellow: "#ffe082", // Ámbar dorado brillante (máxima luminancia)
        cyan: "#ffaa00", // Ámbar puro terminal P3
        magenta: "#ff8c00", // Ámbar cálido profundo
        hotpink: "#ffbb33", // Ámbar dorado electrizante
        green: "#ffc247", // Ámbar medio vintage
        gray: "#8a5200", // Ámbar ahumado fósforo atenuado
      },
      blockGlowBlur: 8,
      blockGlowColor: "rgba(255, 170, 0, 0.5)",
      particles: ["#ffaa00", "#ffc247", "#ffe082", "#ff5500"],
      hudText: {
        fill: "#ffaa00",
        glowBlur: 8,
        glowColor: "rgba(255, 170, 0, 0.6)",
      },
    },
    green: {
      id: "retro",
      name: "Fósforo Verde P1",
      variant: "green",
      useSpritesheet: false,
      background: "#040a05",
      gridLine: "rgba(51, 255, 51, 0.06)",
      paddle: {
        fill: "#33ff33",
        stroke: "#66ff66",
        accent: "#00cc44",
        glowBlur: 10,
        glowColor: "rgba(51, 255, 51, 0.6)",
      },
      ball: {
        fill: "#a3ffa3",
        glowBlur: 10,
        glowColor: "rgba(51, 255, 51, 0.7)",
      },
      blockColors: {
        red: "#00cc44", // Verde esmeralda terminal profundo
        yellow: "#a3ffa3", // Verde fósforo de máxima luminancia
        cyan: "#33ff33", // Verde terminal P1 estándar
        magenta: "#29e054", // Verde matriz vibrante
        hotpink: "#55ff77", // Verde primavera fosforescente
        green: "#66ff66", // Verde clásico CRT
        gray: "#1b5e20", // Verde fósforo atenuado
      },
      blockGlowBlur: 8,
      blockGlowColor: "rgba(51, 255, 51, 0.5)",
      particles: ["#33ff33", "#66ff66", "#a3ffa3", "#1aff1a"],
      hudText: {
        fill: "#33ff33",
        glowBlur: 8,
        glowColor: "rgba(51, 255, 51, 0.6)",
      },
    },
  },
};

export function getArkanoidSkinPalette(
  skin: GameSkinId = "clasico",
  retroVariant: RetroPaletteVariant = "amber"
): ArkanoidSkinPalette {
  if (skin === "retro") {
    return retroVariant === "green"
      ? ARKANOID_SKINS.retro.green
      : ARKANOID_SKINS.retro.amber;
  }
  return ARKANOID_SKINS[skin] ?? ARKANOID_SKINS.clasico;
}
