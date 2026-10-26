import { GameExtendedDetails } from "@/types/launcher";
import { Game } from "@/types/game";

export const SPACE_INVADERS_SUMMARY: Game = {
  id: "space-invaders-galaxy",
  title: "SPACE INVADERS: GALAXY",
  category: "SHOOT 'EM UP",
  categoryKey: ["shoot-em-up", "classics-80s", "popular"],
  year: 1978,
  badge: "HARDCORE",
  badgeVariant: "surface",
  difficulty: "HARDCORE",
  description:
    "Defiende los últimos bastiones terrestres de la invasión alienígena pixelada.",
  record: {
    score: "154,600 PTS",
    rawScore: 154600,
    holder: "@VOID_HUNTER",
  },
  artType: "space-invaders",
  playsCount: 41000,
};

export const SPACE_INVADERS_DETAILS: GameExtendedDetails = {
  id: "space-invaders-galaxy",
  title: "SPACE INVADERS",
  subtitle: "GALAXY HARDCORE",
  badge: "HARDCORE",
  version: "REV.1978.001",
  releaseYear: 1978,
  developer: "TAITO CLASSICS",
  genre: "Shoot 'em Up Vectorial",
  maxScore: "620,000",
  recordHolder: "RETRO_BLASTER",
  activePlayers: 29,
  cabinetNumber: "#001",
  materialIcon: "rocket_launch",
  missionLog: {
    story:
      "Una flota masiva de invasores extraterrestres desciende en formaciones sincronizadas. Pilota el cañón láser terrestre tras los cuatro búnkeres de protección antes de que alcancen la superficie.",
    objective:
      "Elimina todas las oleadas invasoras y destruye la nave nodriza de bonificación.",
    controls: [
      { key: "[←] [→]", action: "Desplazar cañón láser" },
      { key: "[ESPACIO]", action: "Disparo vertical de plasma" },
    ],
    powerups: [
      {
        name: "DOBLE CAÑÓN",
        color: "border-secondary-container text-secondary-container",
        description: "Dispara dos proyectiles paralelos simultáneos.",
      },
    ],
  },
};
