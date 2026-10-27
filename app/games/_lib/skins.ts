import { GameSkinId, RetroPaletteVariant } from "./types";

export interface StandardSkinPalette {
  id: GameSkinId;
  name: string;
  variant?: RetroPaletteVariant;
  background: string;
  gridLine: string;
  primary: string;
  secondary: string;
  accent: string;
  danger: string;
  glowBlur: number;
  glowColor: string;
  particleColors: string[];
}

export interface CanonicalSkinsMap {
  clasico: StandardSkinPalette;
  neon: StandardSkinPalette;
  retro: {
    amber: StandardSkinPalette;
    green: StandardSkinPalette;
  };
}

export const CANONICAL_SKINS: CanonicalSkinsMap = {
  clasico: {
    id: "clasico",
    name: "Arcade Clásico (1980s)",
    background: "#050608",
    gridLine: "rgba(255, 255, 255, 0.05)",
    primary: "#ffffff",
    secondary: "#00f5ff",
    accent: "#ffcf3a",
    danger: "#ff3b30",
    glowBlur: 0,
    glowColor: "transparent",
    particleColors: ["#ffffff", "#ffcf3a", "#00f5ff"],
  },
  neon: {
    id: "neon",
    name: "Cyberpunk Neón (2084)",
    background: "#04050e",
    gridLine: "rgba(0, 245, 255, 0.08)",
    primary: "#00f5ff",
    secondary: "#ff006e",
    accent: "#a855f7",
    danger: "#ff0055",
    glowBlur: 18,
    glowColor: "#00f5ff",
    particleColors: ["#00f5ff", "#ff006e", "#a855f7", "#00ff88"],
  },
  retro: {
    amber: {
      id: "retro",
      name: "Fósforo Ámbar P3",
      variant: "amber",
      background: "#090805",
      gridLine: "rgba(255, 170, 0, 0.07)",
      primary: "#ffaa00",
      secondary: "#ffc247",
      accent: "#ffe082",
      danger: "#ff5500",
      glowBlur: 10,
      glowColor: "rgba(255, 170, 0, 0.6)",
      particleColors: ["#ffaa00", "#ffc247", "#ffe082", "#ff7700"],
    },
    green: {
      id: "retro",
      name: "Fósforo Verde P1",
      variant: "green",
      background: "#040a05",
      gridLine: "rgba(51, 255, 51, 0.07)",
      primary: "#33ff33",
      secondary: "#66ff66",
      accent: "#a3ffa3",
      danger: "#00cc44",
      glowBlur: 10,
      glowColor: "rgba(51, 255, 51, 0.6)",
      particleColors: ["#33ff33", "#66ff66", "#a3ffa3", "#1aff1a"],
    },
  },
};

export function getStandardSkinPalette(
  skin: GameSkinId = "clasico",
  retroVariant: RetroPaletteVariant = "amber"
): StandardSkinPalette {
  if (skin === "retro") {
    return retroVariant === "green"
      ? CANONICAL_SKINS.retro.green
      : CANONICAL_SKINS.retro.amber;
  }
  return CANONICAL_SKINS[skin];
}
