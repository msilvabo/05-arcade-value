import { GameSkinId, RetroPaletteVariant } from "@/app/games/_lib/types";

export interface TetrisSkinPalette {
  id: GameSkinId;
  name: string;
  variant?: RetroPaletteVariant;
  background: string;
  gridLine: string;
  glowBlur: number;
  glowColor: string;

  // Tablero principal
  board: {
    background: string;
    gridLine: string;
    border: string;
    cornerAccent: string;
  };

  // Piezas (Tetrominós)
  pieces: {
    colors: string[]; // Índice 0 es dummy (""), 1 a 8 corresponden a I, O, T, S, Z, J, L, N
    glowBlur: number;
    bevelLight: string;
    bevelDark: string;
    centerHighlight: string;
  };

  // Proyección fantasma (Ghost)
  ghost: {
    alpha: number;
    glowBlur: number;
  };

  // Animación de línea completada
  lineFlash: {
    fill: (alpha: number) => string;
    glowColor: string;
    glowBlur: number;
  };

  // Paneles laterales de telemetría, controles y siguiente pieza
  panels: {
    background: string;
    border: string;
    corner: string;
    title: string;
    subtitle: string;
    separator: string;
    label: string;
    valuePrimary: string;
    valueSecondary: string;
    commandKey: string;
    commandDesc: string;
    bannerTitle: string;
    bannerText: string;
    bannerBarActive: string;
    bannerBarInactive: string;
  };

  // Partículas de estallido y caída instantánea
  particles: string[];
}

export interface TetrisSkinsMap {
  clasico: TetrisSkinPalette;
  neon: TetrisSkinPalette;
  retro: {
    amber: TetrisSkinPalette;
    green: TetrisSkinPalette;
  };
}

export const TETRIS_SKINS: TetrisSkinsMap = {
  clasico: {
    id: "clasico",
    name: "Arcade Clásico (1980s)",
    background: "#050608",
    gridLine: "rgba(255, 255, 255, 0.04)",
    glowBlur: 0,
    glowColor: "transparent",
    board: {
      background: "#03060c",
      gridLine: "rgba(255, 255, 255, 0.06)",
      border: "#00d2ff",
      cornerAccent: "#ffcf3a",
    },
    pieces: {
      colors: [
        "",
        "#00d2ff", // 1: I - Cian arcade
        "#ffcf3a", // 2: O - Amarillo moneda
        "#bf5af2", // 3: T - Púrpura arcade
        "#30d158", // 4: S - Verde vibrante
        "#ff453a", // 5: Z - Rojo carmesí
        "#0a84ff", // 6: J - Azul eléctrico
        "#ff9f0a", // 7: L - Naranja cálido
        "#e5e5ea", // 8: N - Platino titanio
      ],
      glowBlur: 0,
      bevelLight: "rgba(255, 255, 255, 0.35)",
      bevelDark: "rgba(0, 0, 0, 0.45)",
      centerHighlight: "rgba(255, 255, 255, 0.12)",
    },
    ghost: {
      alpha: 0.25,
      glowBlur: 0,
    },
    lineFlash: {
      fill: (alpha: number) => `rgba(255, 255, 255, ${alpha * 0.95})`,
      glowColor: "#ffffff",
      glowBlur: 4,
    },
    panels: {
      background: "rgba(10, 15, 24, 0.85)",
      border: "rgba(255, 255, 255, 0.18)",
      corner: "#00d2ff",
      title: "#ffffff",
      subtitle: "rgba(255, 255, 255, 0.6)",
      separator: "rgba(255, 255, 255, 0.15)",
      label: "rgba(255, 255, 255, 0.75)",
      valuePrimary: "#ffcf3a",
      valueSecondary: "#00d2ff",
      commandKey: "#ffcf3a",
      commandDesc: "rgba(255, 255, 255, 0.65)",
      bannerTitle: "#00d2ff",
      bannerText: "rgba(255, 255, 255, 0.7)",
      bannerBarActive: "#00d2ff",
      bannerBarInactive: "rgba(255, 255, 255, 0.2)",
    },
    particles: ["#ffffff", "#ffcf3a", "#00d2ff", "#ff453a"],
  },

  neon: {
    id: "neon",
    name: "Cyberpunk Neón (2084)",
    background: "#04050e",
    gridLine: "rgba(0, 245, 255, 0.08)",
    glowBlur: 16,
    glowColor: "#00f5ff",
    board: {
      background: "#02040c",
      gridLine: "rgba(0, 245, 255, 0.09)",
      border: "#00f5ff",
      cornerAccent: "#ff006e",
    },
    pieces: {
      colors: [
        "",
        "#00f5ff", // 1: I - Cian láser
        "#ffe600", // 2: O - Amarillo neón
        "#a855f7", // 3: T - Violeta synthwave
        "#00ff88", // 4: S - Verde hacker
        "#ff0055", // 5: Z - Rosa neón de alta energía
        "#3b82f6", // 6: J - Azul eléctrico
        "#ff7b00", // 7: L - Naranja hiperión
        "#d946ef", // 8: N - Fucsia plasma
      ],
      glowBlur: 14,
      bevelLight: "rgba(255, 255, 255, 0.45)",
      bevelDark: "rgba(0, 0, 0, 0.5)",
      centerHighlight: "rgba(255, 255, 255, 0.18)",
    },
    ghost: {
      alpha: 0.28,
      glowBlur: 10,
    },
    lineFlash: {
      fill: (alpha: number) => `rgba(255, 255, 255, ${alpha})`,
      glowColor: "#00f5ff",
      glowBlur: 20,
    },
    panels: {
      background: "rgba(4, 9, 24, 0.82)",
      border: "rgba(0, 245, 255, 0.3)",
      corner: "#00f5ff",
      title: "#00f5ff",
      subtitle: "rgba(0, 245, 255, 0.6)",
      separator: "rgba(0, 245, 255, 0.2)",
      label: "rgba(255, 255, 255, 0.75)",
      valuePrimary: "#ffe600",
      valueSecondary: "#00f5ff",
      commandKey: "#ff006e",
      commandDesc: "rgba(255, 255, 255, 0.68)",
      bannerTitle: "#ff006e",
      bannerText: "rgba(255, 255, 255, 0.7)",
      bannerBarActive: "#00f5ff",
      bannerBarInactive: "rgba(0, 245, 255, 0.3)",
    },
    particles: ["#00f5ff", "#ff006e", "#a855f7", "#00ff88"],
  },

  retro: {
    amber: {
      id: "retro",
      name: "Fósforo Ámbar P3",
      variant: "amber",
      background: "#090805",
      gridLine: "rgba(255, 170, 0, 0.07)",
      glowBlur: 10,
      glowColor: "rgba(255, 170, 0, 0.6)",
      board: {
        background: "#0d0b06",
        gridLine: "rgba(255, 170, 0, 0.08)",
        border: "#ffaa00",
        cornerAccent: "#ff7700",
      },
      pieces: {
        colors: [
          "",
          "#ffe082", // 1: I - Ámbar fósforo radiante
          "#ffc247", // 2: O - Oro cálido
          "#ffaa00", // 3: T - Ámbar terminal canónico
          "#ff9500", // 4: S - Ámbar medio intenso
          "#ff7700", // 5: Z - Naranja fósforo cálido
          "#ffb74d", // 6: J - Ámbar miel luminoso
          "#ffa000", // 7: L - Ámbar dorado equilibrado
          "#ffd54f", // 8: N - Ámbar destello
        ],
        glowBlur: 8,
        bevelLight: "rgba(255, 235, 180, 0.35)",
        bevelDark: "rgba(0, 0, 0, 0.55)",
        centerHighlight: "rgba(255, 210, 120, 0.15)",
      },
      ghost: {
        alpha: 0.25,
        glowBlur: 6,
      },
      lineFlash: {
        fill: (alpha: number) => `rgba(255, 224, 130, ${alpha * 0.95})`,
        glowColor: "rgba(255, 170, 0, 0.85)",
        glowBlur: 14,
      },
      panels: {
        background: "rgba(18, 14, 8, 0.85)",
        border: "rgba(255, 170, 0, 0.3)",
        corner: "#ffaa00",
        title: "#ffaa00",
        subtitle: "rgba(255, 170, 0, 0.65)",
        separator: "rgba(255, 170, 0, 0.2)",
        label: "rgba(255, 194, 71, 0.75)",
        valuePrimary: "#ffe082",
        valueSecondary: "#ffaa00",
        commandKey: "#ffaa00",
        commandDesc: "rgba(255, 194, 71, 0.65)",
        bannerTitle: "#ffc247",
        bannerText: "rgba(255, 194, 71, 0.7)",
        bannerBarActive: "#ffaa00",
        bannerBarInactive: "rgba(255, 170, 0, 0.28)",
      },
      particles: ["#ffaa00", "#ffc247", "#ffe082", "#ff7700"],
    },

    green: {
      id: "retro",
      name: "Fósforo Verde P1",
      variant: "green",
      background: "#040a05",
      gridLine: "rgba(51, 255, 51, 0.07)",
      glowBlur: 10,
      glowColor: "rgba(51, 255, 51, 0.6)",
      board: {
        background: "#040d05",
        gridLine: "rgba(51, 255, 51, 0.08)",
        border: "#33ff33",
        cornerAccent: "#00cc44",
      },
      pieces: {
        colors: [
          "",
          "#a3ffa3", // 1: I - Verde terminal alta luminancia
          "#66ff66", // 2: O - Esmeralda vintage
          "#33ff33", // 3: T - Verde fósforo canónico P1
          "#22e622", // 4: S - Verde radar intenso
          "#00cc44", // 5: Z - Verde profundo
          "#79f779", // 6: J - Verde menta cátodo
          "#40df40", // 7: L - Verde medio equilibrado
          "#c2ffc2", // 8: N - Verde blanco fosforescente
        ],
        glowBlur: 8,
        bevelLight: "rgba(200, 255, 200, 0.35)",
        bevelDark: "rgba(0, 0, 0, 0.55)",
        centerHighlight: "rgba(163, 255, 163, 0.15)",
      },
      ghost: {
        alpha: 0.25,
        glowBlur: 6,
      },
      lineFlash: {
        fill: (alpha: number) => `rgba(163, 255, 163, ${alpha * 0.95})`,
        glowColor: "rgba(51, 255, 51, 0.85)",
        glowBlur: 14,
      },
      panels: {
        background: "rgba(6, 18, 8, 0.85)",
        border: "rgba(51, 255, 51, 0.3)",
        corner: "#33ff33",
        title: "#33ff33",
        subtitle: "rgba(51, 255, 51, 0.65)",
        separator: "rgba(51, 255, 51, 0.2)",
        label: "rgba(102, 255, 102, 0.75)",
        valuePrimary: "#a3ffa3",
        valueSecondary: "#33ff33",
        commandKey: "#33ff33",
        commandDesc: "rgba(102, 255, 102, 0.65)",
        bannerTitle: "#66ff66",
        bannerText: "rgba(102, 255, 102, 0.7)",
        bannerBarActive: "#33ff33",
        bannerBarInactive: "rgba(51, 255, 51, 0.28)",
      },
      particles: ["#33ff33", "#66ff66", "#a3ffa3", "#1aff1a"],
    },
  },
};

export function getTetrisSkinPalette(
  skin: GameSkinId = "clasico",
  retroVariant: RetroPaletteVariant = "amber"
): TetrisSkinPalette {
  if (skin === "retro") {
    return retroVariant === "green"
      ? TETRIS_SKINS.retro.green
      : TETRIS_SKINS.retro.amber;
  }
  return TETRIS_SKINS[skin] ?? TETRIS_SKINS.clasico;
}
