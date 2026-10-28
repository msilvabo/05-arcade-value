import { GameExtendedDetails } from "@/types/launcher";
import { Game } from "@/types/game";

export const CYBER_FROGGER_ACTION_SUMMARY: Game = {
  id: "cyber-frogger-action",
  title: "CYBER-FROGGER: DATA HIGHWAY",
  category: "ARCADE ACTION",
  categoryKey: ["action-maze", "classics-80s"],
  year: 2026,
  badge: "GAME JAM '26",
  badgeVariant: "secondary",
  difficulty: "DIFÍCIL",
  description:
    "Pilota el micro-dron Cyber-Frog a través de autopistas de tráfico corrupto y refrigerante de plasma para infiltrar 5 Nodos Maestros.",
  record: {
    score: "142,500 PTS",
    rawScore: 142500,
    holder: "@QUANTUM_HOPPER",
  },
  artType: "frogger",
  playsCount: 18400,
};

export const CYBER_FROGGER_ACTION_DETAILS: GameExtendedDetails = {
  id: "cyber-frogger-action",
  title: "CYBER-FROGGER: DATA HIGHWAY PROTOCOL",
  subtitle: "ACTION / REFLEX OVERCLOCK",
  badge: "ACTION PROTOCOL",
  version: "REV.2026.JAM01",
  releaseYear: 2026,
  developer: "CYBER VAULT LABS",
  genre: "Arcade Reflexes & Action",
  maxScore: "500,000",
  recordHolder: "QUANTUM_HOPPER",
  activePlayers: 42,
  cabinetNumber: "#084",
  materialIcon: "sports_esports",
  missionLog: {
    story:
      "El super-servidor central ha caído bajo una infección de código corrupto. Como micro-dron de datos Cyber-Frog, debes transportar parches críticos esquivando tráfico SYN-ACK, camiones troyanos acorazados y firewalls láser, navegando por corrientes de refrigerante térmico sobre módulos RAM flotantes hasta infiltrar los 5 Nodos Maestros.",
    objective:
      "Infiltra los 5 Nodos Maestros del procesador central evitando colisiones en la autopista de datos y caídas en el refrigerante de plasma. Usa el Cyber-Dash para maniobras evasivas críticas.",
    controls: [
      {
        key: "[Flechas] / [WASD]",
        action: "Saltos direccionales ortogonales (40 px por cuadrícula)",
      },
      {
        key: "[Espacio]",
        action:
          "Cyber-Dash: Salto de 2 casillas con invulnerabilidad temporal (Cooldown 4s)",
      },
      {
        key: "[P] / [Esc]",
        action: "Pausar cabina y congelar bucle de procesamiento",
      },
    ],
    powerups: [
      {
        name: "Cyber-Dash Condenser",
        color: "#00f0ff",
        description:
          "Teletransporte de emergencia de 2 celdas con escudo de inmunidad de 200 ms.",
      },
      {
        name: "Overclock Golden Pulse",
        color: "#ffb700",
        description:
          "Pulso cuántico en bahía que otorga +500 puntos antes de disiparse.",
      },
      {
        name: "RAM Buffer Carrier",
        color: "#00ff66",
        description:
          "Módulos de memoria con transporte cinético sobre plasma a 600 °C.",
      },
    ],
  },
};
