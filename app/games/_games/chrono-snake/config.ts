import { GameExtendedDetails } from "@/types/launcher";
import { Game } from "@/types/game";

export const SNAKE_SUMMARY: Game = {
  id: "chrono-snake",
  title: "CHRONO SNAKE",
  category: "ARCADE PUZZLE",
  categoryKey: ["puzzle", "action-maze"],
  year: 1997,
  badge: "CLÁSICO RETRO",
  badgeVariant: "surface",
  difficulty: "NORMAL",
  description:
    "Devora frutas cibernéticas del atlas cuántico y evita los muros sólidos de la cabina.",
  record: {
    score: "87,150 PTS",
    rawScore: 87150,
    holder: "@RETRO_VIPER",
  },
  artType: "snake",
  playsCount: 29000,
};

export const SNAKE_DETAILS: GameExtendedDetails = {
  id: "chrono-snake",
  title: "CHRONO SNAKE",
  subtitle: "MULTI-PULSE",
  badge: "POPULAR",
  version: "REV.1997.009",
  releaseYear: 1997,
  developer: "NOKIA & RETRO VAULT",
  genre: "Arcade Reflexes",
  maxScore: "450,800",
  recordHolder: "SNAKE_MASTER",
  activePlayers: 31,
  cabinetNumber: "#033",
  materialIcon: "gesture",
  missionLog: {
    story:
      "Guía la serpiente de impulsos Chrono a través de una cuadrícula retro de vectores. Con cada fruta consumida, tu estela se alarga y la velocidad del sistema se acelera.",
    objective:
      "Recoge la mayor cantidad de frutas del atlas evitando colisionar contra los muros de la pantalla o contra tu propio cuerpo.",
    controls: [
      {
        key: "[Flechas] / [WASD]",
        action:
          "Dirección de desplazamiento (Arriba, Abajo, Izquierda, Derecha)",
      },
      { key: "[Espacio] / [P]", action: "Pausar cabina" },
    ],
    powerups: [
      {
        name: "FRUTAS LEGENDARIAS",
        color: "border-primary-container text-primary-container",
        description:
          "Sandías, piñas y melones otorgan 500 puntos de bonificación.",
      },
    ],
  },
};
