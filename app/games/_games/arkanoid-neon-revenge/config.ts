import { GameExtendedDetails } from "@/types/launcher";
import { Game } from "@/types/game";

export const ARKANOID_SUMMARY: Game = {
  id: "arkanoid-neon-revenge",
  title: "ARKANOID: NEON REVENGE",
  category: "PUZZLE / ACCIÓN",
  categoryKey: ["puzzle", "action-maze", "classics-80s"],
  year: 1986,
  badge: "TORNEO ACTIVO",
  badgeVariant: "secondary",
  difficulty: "DIFÍCIL",
  description:
    "Destruye la barrera dimensional reflejando la esfera de energía cósmica.",
  record: {
    score: "98,420 PTS",
    rawScore: 98420,
    holder: "@PIXEL_KING",
  },
  artType: "arkanoid",
  playsCount: 52000,
};

export const ARKANOID_DETAILS: GameExtendedDetails = {
  id: "arkanoid-neon-revenge",
  title: "ARKANOID",
  subtitle: "NEON REVENGE",
  badge: "DESTACADO VAULT",
  version: "REV.2026.042 // BUILD 84",
  releaseYear: 1986,
  developer: "TAITO & ARCADE VAULT EMULATOR v2.4",
  genre: "Rompeladrillos Clásico • Reedición 1986-2026",
  maxScore: "984,520",
  recordHolder: "CYBER_GHOST",
  activePlayers: 42,
  cabinetNumber: "#042",
  materialIcon: "sports_baseball",
  missionLog: {
    story:
      "La nave nodriza ARKAIS ha sido corrompida por la entidad dimensional DOH. Como último piloto a bordo de la cápsula de escape VAUS, debes atravesar 33 sectores espaciales defendidos por murallas de fotones refractarios. Tu única arma es la esfera reflectora de plasma comprimido.",
    objective:
      "Destruye todas las matrices de ladrillos en cada sector sin dejar caer la esfera al vacío estelar para abrir la compuerta dimensional del siguiente cuadrante.",
    controls: [
      { key: "[A] [D] / [←] [→]", action: "Mover cápsula Vaus lateralmente" },
      {
        key: "[RATÓN]",
        action: "Desplazamiento horizontal directo de la cápsula",
      },
      { key: "[P] / [ESC]", action: "Pausar simulación del sistema" },
      { key: "[RESTART]", action: "Reiniciar partida en cabina" },
    ],
    powerups: [
      {
        name: "LÁSER OFENSIVO (L)",
        color: "border-secondary-container text-secondary-container",
        description:
          "Equipa a la nave Vaus con dos cañones láser para destruir ladrillos a distancia.",
      },
      {
        name: "EXPANSIÓN VAUS (E)",
        color: "border-primary-container text-primary-container",
        description:
          "Aumenta la longitud de la nave un 40% facilitando el rebote de la esfera.",
      },
      {
        name: "MULTI-ESFERA (D)",
        color: "border-tertiary-container text-tertiary-fixed",
        description:
          "Triplica la esfera de plasma en juego generando caos y alto puntaje.",
      },
      {
        name: "BRECHA PORTAL (B)",
        color: "border-surface-tint text-surface-tint",
        description:
          "Abre de inmediato la puerta de salida al siguiente nivel de sector.",
      },
    ],
  },
};
