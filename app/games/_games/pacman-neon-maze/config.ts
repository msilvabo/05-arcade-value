import { GameExtendedDetails } from "@/types/launcher";
import { Game } from "@/types/game";

export const PACMAN_SUMMARY: Game = {
  id: "pacman-neon-maze",
  title: "PAC-MAN: NEON MAZE",
  category: "LABERINTO",
  categoryKey: ["action-maze", "classics-80s", "popular"],
  year: 1980,
  badge: "PERFECT SCORE",
  badgeVariant: "tertiary",
  difficulty: "DIFÍCIL",
  description:
    "Devora todos los puntos cuánticos esquivando a los cuatro espectros cibernéticos.",
  record: {
    score: "3,333,360 PTS",
    rawScore: 3333360,
    holder: "@BILLY_CHAMP",
  },
  artType: "pacman",
  playsCount: 36000,
};

export const PACMAN_DETAILS: GameExtendedDetails = {
  id: "pacman-neon-maze",
  title: "PAC-MAN",
  subtitle: "NEON MAZE",
  badge: "PERFECT SCORE",
  version: "REV.1980.256",
  releaseYear: 1980,
  developer: "NAMCO & VAULT CORE",
  genre: "Laberinto Arcade Clásico",
  maxScore: "3,333,360",
  recordHolder: "BILLY_CHAMP",
  activePlayers: 53,
  cabinetNumber: "#021",
  materialIcon: "motion_photos_on",
  missionLog: {
    story:
      "Atraviesa el laberinto de neón recolectando píldoras de energía cuántica mientras eres perseguido por los cuatro algoritmos fantasma: Blinky, Pinky, Inky y Clyde.",
    objective:
      "Consume todos los puntos del circuito y utiliza las píldoras de poder para revertir la persecución.",
    controls: [
      {
        key: "[W] [A] [S] [D] / [Flechas]",
        action: "Dirección de desplazamiento",
      },
    ],
    powerups: [
      {
        name: "POWER PELLET",
        color: "border-tertiary-container text-tertiary-fixed",
        description:
          "Vuelve vulnerables a los espectros cibernéticos durante 8 segundos.",
      },
    ],
  },
};
