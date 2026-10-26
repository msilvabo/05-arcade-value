import { GameExtendedDetails } from "@/types/launcher";
import { Game } from "@/types/game";

export const SNAKE_SUMMARY: Game = {
  id: "chrono-snake",
  title: "CHRONO SNAKE",
  category: "ARCADE PUZZLE",
  categoryKey: ["puzzle", "action-maze"],
  year: 1997,
  badge: "MULTI-PULSO",
  badgeVariant: "surface",
  difficulty: "NORMAL",
  description:
    "Aliméntate de condensadores de pulso y desafía los límites del hiper-espacio.",
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
  version: "REV.1997.008",
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
      "Guía el pulso de energía Chrono a través de una cuadrícula de vectores. Con cada nodo de datos consumido, el tren de impulsos se alarga y la frecuencia cardíaca aumenta.",
    objective:
      "Consume todos los orbes de energía sin colisionar con los bordes de la red ni con tu propia estela.",
    controls: [
      { key: "[Flechas]", action: "Cambiar vector de desplazamiento" },
    ],
    powerups: [
      {
        name: "CHRONO SLOWDOWN",
        color: "border-primary-container text-primary-container",
        description:
          "Ralentiza la frecuencia de la cuadrícula durante 5 segundos.",
      },
    ],
  },
};
