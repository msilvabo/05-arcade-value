import { GameSkinId, RetroPaletteVariant } from "@/app/games/_lib/types";

export interface CyberFroggerSkinPalette {
  id: GameSkinId;
  name: string;
  variant?: RetroPaletteVariant;
  glowBlur: number;
  glowColor: string;
  background: string;
  gridLine: string;

  zones: {
    startSocket: {
      fill: string;
      gridStroke: string;
    };
    highway: {
      fill: string;
      laneLine: string;
    };
    bufferZone: {
      fill: string;
      border: string;
    };
    plasmaRiver: {
      fill: string;
      wave: string;
    };
    coreBus: {
      fill: string;
      border: string;
    };
    masterNodesBar: {
      fill: string;
      bayOpen: string;
      bayPenetrated: string;
      bayStrokeOpen: string;
      bayStrokePenetrated: string;
      nodeIconOpen: string;
      nodeIconPenetrated: string;
    };
  };

  platforms: {
    ram: {
      fill: string;
      stroke: string;
      chipFill: string;
    };
    dataBus: {
      fill: string;
      stroke: string;
      pinFill: string;
    };
    heatSink: {
      fill: string;
      stroke: string;
      finFill: string;
      submergedFill: string;
      submergedStroke: string;
    };
  };

  hazards: {
    trojanTruck: {
      fill: string;
      stroke: string;
      headlight: string;
    };
    firewallLaser: {
      fill: string;
      strokeActive: string;
      strokeInactive: string;
      beamFill: string;
    };
    packetFast: {
      fill: string;
      stroke: string;
      coreFill: string;
    };
    glitchDdos: {
      fill: string;
      stroke: string;
      coreFill: string;
    };
  };

  frog: {
    bodyFill: string;
    glowBlur: number;
    glowColor: string;
    jumpingGlowBlur: number;
    visorFill: string;
    visorGlowColor: string;
    dashAuraStroke: string;
    dashAuraGlowColor: string;
    dashAuraGlowBlur: number;
  };

  particles: {
    dash: string[];
    penetration: string[];
    death: string[];
  };
}

export interface CyberFroggerSkinsMap {
  clasico: CyberFroggerSkinPalette;
  neon: CyberFroggerSkinPalette;
  retro: {
    amber: CyberFroggerSkinPalette;
    green: CyberFroggerSkinPalette;
  };
}

export const CYBER_FROGGER_SKINS: CyberFroggerSkinsMap = {
  clasico: {
    id: "clasico",
    name: "Arcade Clásico (1980s)",
    glowBlur: 0,
    glowColor: "transparent",
    background: "#050608",
    gridLine: "rgba(255, 255, 255, 0.04)",
    zones: {
      startSocket: {
        fill: "#0c0f17",
        gridStroke: "#1a2236",
      },
      highway: {
        fill: "#080910",
        laneLine: "rgba(255, 255, 255, 0.18)",
      },
      bufferZone: {
        fill: "#0d1a15",
        border: "#30d158",
      },
      plasmaRiver: {
        fill: "#05111d",
        wave: "rgba(0, 210, 255, 0.12)",
      },
      coreBus: {
        fill: "#0f1624",
        border: "#00d2ff",
      },
      masterNodesBar: {
        fill: "#141a26",
        bayOpen: "#0a121c",
        bayPenetrated: "#002914",
        bayStrokeOpen: "#00d2ff",
        bayStrokePenetrated: "#30d158",
        nodeIconOpen: "#00d2ff",
        nodeIconPenetrated: "#30d158",
      },
    },
    platforms: {
      ram: {
        fill: "#0a1e30",
        stroke: "#00d2ff",
        chipFill: "#00d2ff",
      },
      dataBus: {
        fill: "#241c08",
        stroke: "#ffcf3a",
        pinFill: "#ffcf3a",
      },
      heatSink: {
        fill: "#280b10",
        stroke: "#ff3b30",
        finFill: "#ff3b30",
        submergedFill: "rgba(255, 59, 48, 0.35)",
        submergedStroke: "#ff3b30",
      },
    },
    hazards: {
      trojanTruck: {
        fill: "#380612",
        stroke: "#ff3b30",
        headlight: "#ffcf3a",
      },
      firewallLaser: {
        fill: "#240a2f",
        strokeActive: "#bf5af2",
        strokeInactive: "#4a125c",
        beamFill: "#bf5af2",
      },
      packetFast: {
        fill: "#0c2035",
        stroke: "#00d2ff",
        coreFill: "#00d2ff",
      },
      glitchDdos: {
        fill: "#302206",
        stroke: "#ff9f0a",
        coreFill: "#ffcf3a",
      },
    },
    frog: {
      bodyFill: "#30d158",
      glowBlur: 0,
      glowColor: "transparent",
      jumpingGlowBlur: 2,
      visorFill: "#ffffff",
      visorGlowColor: "transparent",
      dashAuraStroke: "#ffffff",
      dashAuraGlowColor: "transparent",
      dashAuraGlowBlur: 0,
    },
    particles: {
      dash: ["#ffffff", "#00d2ff", "#30d158"],
      penetration: ["#30d158", "#ffffff", "#00d2ff"],
      death: ["#ff3b30", "#ffcf3a", "#ffffff", "#00d2ff"],
    },
  },

  neon: {
    id: "neon",
    name: "Cyberpunk Neón (2084)",
    glowBlur: 16,
    glowColor: "#00f5ff",
    background: "#04050e",
    gridLine: "rgba(0, 245, 255, 0.08)",
    zones: {
      startSocket: {
        fill: "#090a18",
        gridStroke: "rgba(0, 245, 255, 0.15)",
      },
      highway: {
        fill: "#050614",
        laneLine: "rgba(255, 0, 110, 0.22)",
      },
      bufferZone: {
        fill: "#0a1720",
        border: "#00ff88",
      },
      plasmaRiver: {
        fill: "#18001a",
        wave: "rgba(255, 0, 110, 0.18)",
      },
      coreBus: {
        fill: "#0a1226",
        border: "#00f5ff",
      },
      masterNodesBar: {
        fill: "#120e24",
        bayOpen: "#0a0f26",
        bayPenetrated: "#002616",
        bayStrokeOpen: "#00f5ff",
        bayStrokePenetrated: "#00ff88",
        nodeIconOpen: "#00f5ff",
        nodeIconPenetrated: "#00ff88",
      },
    },
    platforms: {
      ram: {
        fill: "#091e30",
        stroke: "#00f5ff",
        chipFill: "#00f5ff",
      },
      dataBus: {
        fill: "#241a06",
        stroke: "#ffbe0b",
        pinFill: "#ffbe0b",
      },
      heatSink: {
        fill: "#2d0818",
        stroke: "#ff006e",
        finFill: "#ff006e",
        submergedFill: "rgba(255, 0, 110, 0.45)",
        submergedStroke: "#ff006e",
      },
    },
    hazards: {
      trojanTruck: {
        fill: "#420018",
        stroke: "#ff0055",
        headlight: "#ffea00",
      },
      firewallLaser: {
        fill: "#2e0638",
        strokeActive: "#d946ef",
        strokeInactive: "#581269",
        beamFill: "#d946ef",
      },
      packetFast: {
        fill: "#091e3b",
        stroke: "#00f5ff",
        coreFill: "#00f5ff",
      },
      glitchDdos: {
        fill: "#382405",
        stroke: "#facc15",
        coreFill: "#facc15",
      },
    },
    frog: {
      bodyFill: "#00ff88",
      glowBlur: 8,
      glowColor: "#00ff88",
      jumpingGlowBlur: 16,
      visorFill: "#00f5ff",
      visorGlowColor: "#00f5ff",
      dashAuraStroke: "#00f5ff",
      dashAuraGlowColor: "#00f5ff",
      dashAuraGlowBlur: 18,
    },
    particles: {
      dash: ["#00f5ff", "#00ff88", "#a855f7"],
      penetration: ["#00ff88", "#00f5ff", "#ffffff"],
      death: ["#ff0055", "#ff006e", "#00f5ff", "#facc15"],
    },
  },

  retro: {
    amber: {
      id: "retro",
      name: "Fósforo Ámbar P3",
      variant: "amber",
      glowBlur: 10,
      glowColor: "rgba(255, 170, 0, 0.6)",
      background: "#090805",
      gridLine: "rgba(255, 170, 0, 0.05)",
      zones: {
        startSocket: {
          fill: "#120e06",
          gridStroke: "rgba(255, 170, 0, 0.15)",
        },
        highway: {
          fill: "#0d0a04",
          laneLine: "rgba(255, 170, 0, 0.18)",
        },
        bufferZone: {
          fill: "#1a1205",
          border: "#ffaa00",
        },
        plasmaRiver: {
          fill: "#140a02",
          wave: "rgba(255, 119, 0, 0.15)",
        },
        coreBus: {
          fill: "#160f06",
          border: "#ffaa00",
        },
        masterNodesBar: {
          fill: "#1c1408",
          bayOpen: "#120d05",
          bayPenetrated: "#2b1a03",
          bayStrokeOpen: "#ffc247",
          bayStrokePenetrated: "#ffe082",
          nodeIconOpen: "#ffaa00",
          nodeIconPenetrated: "#ffe082",
        },
      },
      platforms: {
        ram: {
          fill: "#1c1205",
          stroke: "#ffc247",
          chipFill: "#ffaa00",
        },
        dataBus: {
          fill: "#241706",
          stroke: "#ffaa00",
          pinFill: "#ffe082",
        },
        heatSink: {
          fill: "#291004",
          stroke: "#ff7700",
          finFill: "#ff5500",
          submergedFill: "rgba(255, 85, 0, 0.4)",
          submergedStroke: "#ff5500",
        },
      },
      hazards: {
        trojanTruck: {
          fill: "#2b0f03",
          stroke: "#ff5500",
          headlight: "#ffe082",
        },
        firewallLaser: {
          fill: "#260e04",
          strokeActive: "#ffaa00",
          strokeInactive: "#592b00",
          beamFill: "#ffe082",
        },
        packetFast: {
          fill: "#1f1406",
          stroke: "#ffc247",
          coreFill: "#ffaa00",
        },
        glitchDdos: {
          fill: "#291906",
          stroke: "#ffaa00",
          coreFill: "#ffe082",
        },
      },
      frog: {
        bodyFill: "#ffaa00",
        glowBlur: 8,
        glowColor: "rgba(255, 170, 0, 0.6)",
        jumpingGlowBlur: 14,
        visorFill: "#ffe082",
        visorGlowColor: "#ffe082",
        dashAuraStroke: "#ffe082",
        dashAuraGlowColor: "rgba(255, 170, 0, 0.8)",
        dashAuraGlowBlur: 12,
      },
      particles: {
        dash: ["#ffaa00", "#ffc247", "#ffe082"],
        penetration: ["#ffe082", "#ffaa00", "#ffffff"],
        death: ["#ff5500", "#ff7700", "#ffaa00", "#ffe082"],
      },
    },

    green: {
      id: "retro",
      name: "Fósforo Verde P1",
      variant: "green",
      glowBlur: 10,
      glowColor: "rgba(51, 255, 51, 0.6)",
      background: "#040a05",
      gridLine: "rgba(51, 255, 51, 0.05)",
      zones: {
        startSocket: {
          fill: "#061208",
          gridStroke: "rgba(51, 255, 51, 0.15)",
        },
        highway: {
          fill: "#040e06",
          laneLine: "rgba(51, 255, 51, 0.18)",
        },
        bufferZone: {
          fill: "#071c0b",
          border: "#33ff33",
        },
        plasmaRiver: {
          fill: "#031406",
          wave: "rgba(51, 255, 51, 0.12)",
        },
        coreBus: {
          fill: "#06180a",
          border: "#33ff33",
        },
        masterNodesBar: {
          fill: "#081e0c",
          bayOpen: "#051307",
          bayPenetrated: "#0d2e13",
          bayStrokeOpen: "#66ff66",
          bayStrokePenetrated: "#a3ffa3",
          nodeIconOpen: "#33ff33",
          nodeIconPenetrated: "#a3ffa3",
        },
      },
      platforms: {
        ram: {
          fill: "#071a0b",
          stroke: "#66ff66",
          chipFill: "#33ff33",
        },
        dataBus: {
          fill: "#09220e",
          stroke: "#33ff33",
          pinFill: "#a3ffa3",
        },
        heatSink: {
          fill: "#06170a",
          stroke: "#00cc44",
          finFill: "#00cc44",
          submergedFill: "rgba(0, 204, 68, 0.4)",
          submergedStroke: "#00cc44",
        },
      },
      hazards: {
        trojanTruck: {
          fill: "#061c0a",
          stroke: "#00cc44",
          headlight: "#a3ffa3",
        },
        firewallLaser: {
          fill: "#051809",
          strokeActive: "#33ff33",
          strokeInactive: "#0f4219",
          beamFill: "#a3ffa3",
        },
        packetFast: {
          fill: "#071f0d",
          stroke: "#66ff66",
          coreFill: "#33ff33",
        },
        glitchDdos: {
          fill: "#08240f",
          stroke: "#33ff33",
          coreFill: "#a3ffa3",
        },
      },
      frog: {
        bodyFill: "#33ff33",
        glowBlur: 8,
        glowColor: "rgba(51, 255, 51, 0.6)",
        jumpingGlowBlur: 14,
        visorFill: "#a3ffa3",
        visorGlowColor: "#a3ffa3",
        dashAuraStroke: "#a3ffa3",
        dashAuraGlowColor: "rgba(51, 255, 51, 0.8)",
        dashAuraGlowBlur: 12,
      },
      particles: {
        dash: ["#33ff33", "#66ff66", "#a3ffa3"],
        penetration: ["#a3ffa3", "#33ff33", "#ffffff"],
        death: ["#00cc44", "#33ff33", "#66ff66", "#a3ffa3"],
      },
    },
  },
};

export function getCyberFroggerSkinPalette(
  skin: GameSkinId = "clasico",
  retroVariant: RetroPaletteVariant = "amber"
): CyberFroggerSkinPalette {
  if (skin === "retro") {
    return retroVariant === "green"
      ? CYBER_FROGGER_SKINS.retro.green
      : CYBER_FROGGER_SKINS.retro.amber;
  }
  return CYBER_FROGGER_SKINS[skin] ?? CYBER_FROGGER_SKINS.clasico;
}
