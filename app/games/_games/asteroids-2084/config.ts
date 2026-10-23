import { GameExtendedDetails } from "@/types/launcher";
import { Game } from "@/types/game";

export const ASTEROIDS_SUMMARY: Game = {
  id: "asteroids-2084",
  title: "ASTEROIDS 2084",
  category: "VECTOR COMBAT",
  categoryKey: ["shoot-em-up", "classics-80s"],
  year: 1979,
  badge: "VECTOR MONO",
  badgeVariant: "surface",
  difficulty: "DIFÍCIL",
  description:
    "Navega y sobrevive a una tormenta de asteroides en gravedad cero espacial.",
  record: {
    score: "231,800 PTS",
    rawScore: 231800,
    holder: "@SOLAR_ACE",
  },
  artType: "asteroids",
  playsCount: 22000,
};

export const ASTEROIDS_DETAILS: GameExtendedDetails = {
  id: "asteroids-2084",
  title: "ASTEROIDS",
  subtitle: "VECTOR COMBAT",
  badge: "VECTOR MONO",
  version: "REV.1979.084",
  releaseYear: 1979,
  developer: "ATARI VECTOR LABS",
  genre: "Vector Space Combat",
  maxScore: "510,900",
  recordHolder: "VECTOR_ACE",
  activePlayers: 19,
  cabinetNumber: "#084",
  missionLog: {
    story:
      "Navega un caza triangular en un campo denso de asteroides interestelares con inercia pura newtoniana en un monitor vectorial de alta frecuencia.",
    objective:
      "Fracciona y destruye los asteroides gigantes y esquiva los platillos voladores hostiles.",
    controls: [
      { key: "[←] [→]", action: "Rotar nave espacial" },
      { key: "[↑]", action: "Propulsión vectorial" },
      { key: "[ESPACIO]", action: "Disparar proyectil" },
      { key: "[↓]", action: "Salto al hiperespacio" },
    ],
    powerups: [
      {
        name: "HYPERDRIVE EMERGENCY",
        color: "border-secondary-container text-secondary-container",
        description:
          "Teletransporte aleatorio para escapar de colisiones inminentes.",
      },
    ],
  },
};
