import { GameExtendedDetails } from "@/types/launcher";
import { Game } from "@/types/game";

export const TETRIS_SUMMARY: Game = {
  id: "cyber-tetris-99",
  title: "CYBER TETRIS 99",
  category: "PUZZLE ESTRATÉGICO",
  categoryKey: ["puzzle", "classics-80s", "popular"],
  year: 1984,
  badge: "MÁS POPULAR",
  badgeVariant: "primary",
  difficulty: "NORMAL",
  description:
    "Encaja las matrices cuánticas antes de que el muro sature el búfer del sistema.",
  record: {
    score: "412,900 PTS",
    rawScore: 412900,
    holder: "@ALEXEY_K",
  },
  artType: "tetris",
  playsCount: 48000,
};

export const TETRIS_DETAILS: GameExtendedDetails = {
  id: "cyber-tetris-99",
  title: "CYBER TETRIS",
  subtitle: "99 PROTOCOL",
  badge: "MÁS POPULAR",
  version: "REV.1984.099",
  releaseYear: 1984,
  developer: "ACADEMY SOFT & VAULT LABS",
  genre: "Puzzle Estratégico Cuántico",
  maxScore: "842,100",
  recordHolder: "NEON_VALKYRIE",
  activePlayers: 67,
  cabinetNumber: "#014",
  missionLog: {
    story:
      "Los tetrominós cuánticos caen en cascada sobre la matriz de memoria del sistema central. Alinea los bloques para disipar el sobrecalentamiento antes de que la memoria se desborde.",
    objective:
      "Completa líneas horizontales consecutivas para activar combos Tetris y acumular créditos.",
    controls: [
      { key: "[←] [→]", action: "Mover tetrominó" },
      { key: "[↑]", action: "Rotar bloque 90°" },
      { key: "[↓]", action: "Caída suave" },
      { key: "[ESPACIO]", action: "Caída instantánea (Hard Drop)" },
    ],
    powerups: [
      {
        name: "T-SPIN MATRIX",
        color: "border-secondary-container text-secondary-container",
        description:
          "Multiplica x4 el puntaje por maniobras de rotación precisa.",
      },
      {
        name: "LINE CLEAR SHOCK",
        color: "border-primary-container text-primary-container",
        description:
          "Elimina dos líneas basales adicionales mediante sobrecarga.",
      },
    ],
  },
};
