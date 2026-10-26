export interface FruitDefinition {
  key: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  points: number;
  tier: "common" | "special" | "legendary";
  colorFallback: string;
}

export const FRUITS_IMAGE_SRC = "/games/snake/fruits.png";

export const FRUIT_DEFINITIONS: Record<string, FruitDefinition> = {
  // Comunes (100 pts)
  apple: {
    key: "apple",
    name: "Manzana Cyber",
    x: 2786,
    y: 136,
    w: 110,
    h: 160,
    points: 100,
    tier: "common",
    colorFallback: "#ff3355",
  },
  banana: {
    key: "banana",
    name: "Plátano Cuántico",
    x: 34,
    y: 136,
    w: 110,
    h: 160,
    points: 100,
    tier: "common",
    colorFallback: "#ffe600",
  },
  orange: {
    key: "orange",
    name: "Naranja Neón",
    x: 186,
    y: 136,
    w: 150,
    h: 160,
    points: 100,
    tier: "common",
    colorFallback: "#ff8800",
  },
  strawberry: {
    key: "strawberry",
    name: "Fresa Láser",
    x: 894,
    y: 136,
    w: 110,
    h: 160,
    points: 100,
    tier: "common",
    colorFallback: "#ff2266",
  },
  cherry: {
    key: "cherry",
    name: "Cereza Dual",
    x: 1066,
    y: 136,
    w: 110,
    h: 160,
    points: 100,
    tier: "common",
    colorFallback: "#ff0044",
  },

  // Especiales (250 pts)
  grape: {
    key: "grape",
    name: "Uva Violeta",
    x: 378,
    y: 136,
    w: 110,
    h: 160,
    points: 250,
    tier: "special",
    colorFallback: "#b026ff",
  },
  lemon: {
    key: "lemon",
    name: "Limón Eléctrico",
    x: 2250,
    y: 136,
    w: 140,
    h: 160,
    points: 250,
    tier: "special",
    colorFallback: "#f0ff00",
  },
  peach: {
    key: "peach",
    name: "Melocotón Bit",
    x: 2432,
    y: 136,
    w: 130,
    h: 160,
    points: 250,
    tier: "special",
    colorFallback: "#ff9977",
  },
  kiwi: {
    key: "kiwi",
    name: "Kiwi Esmeralda",
    x: 2068,
    y: 136,
    w: 170,
    h: 160,
    points: 250,
    tier: "special",
    colorFallback: "#66cc33",
  },
  tomato: {
    key: "tomato",
    name: "Tomate Rojo",
    x: 2948,
    y: 136,
    w: 130,
    h: 160,
    points: 250,
    tier: "special",
    colorFallback: "#ff4422",
  },
  carrot: {
    key: "carrot",
    name: "Zanahoria Óptica",
    x: 1228,
    y: 136,
    w: 130,
    h: 160,
    points: 250,
    tier: "special",
    colorFallback: "#ff7700",
  },
  garlic: {
    key: "garlic",
    name: "Ajo Neutrón",
    x: 540,
    y: 136,
    w: 130,
    h: 160,
    points: 250,
    tier: "special",
    colorFallback: "#e0e6ed",
  },
  eggplant: {
    key: "eggplant",
    name: "Berenjena Synth",
    x: 712,
    y: 136,
    w: 130,
    h: 160,
    points: 250,
    tier: "special",
    colorFallback: "#7722aa",
  },

  // Legendarias (500 pts)
  watermelon: {
    key: "watermelon",
    name: "Sandía Holográfica",
    x: 1734,
    y: 136,
    w: 150,
    h: 160,
    points: 500,
    tier: "legendary",
    colorFallback: "#00ff88",
  },
  pineapple: {
    key: "pineapple",
    name: "Piña Galáctica",
    x: 3454,
    y: 136,
    w: 150,
    h: 160,
    points: 500,
    tier: "legendary",
    colorFallback: "#ffcc00",
  },
  melon: {
    key: "melon",
    name: "Melón de Plasma",
    x: 3637,
    y: 136,
    w: 130,
    h: 160,
    points: 500,
    tier: "legendary",
    colorFallback: "#88ff44",
  },
  pepper: {
    key: "pepper",
    name: "Pimiento Ígneo",
    x: 1906,
    y: 136,
    w: 150,
    h: 160,
    points: 500,
    tier: "legendary",
    colorFallback: "#ff1122",
  },
  mushroom: {
    key: "mushroom",
    name: "Seta Mutágena",
    x: 1400,
    y: 136,
    w: 130,
    h: 160,
    points: 500,
    tier: "legendary",
    colorFallback: "#ff5544",
  },
  broccoli: {
    key: "broccoli",
    name: "Brócoli Cuántico",
    x: 1582,
    y: 136,
    w: 110,
    h: 160,
    points: 500,
    tier: "legendary",
    colorFallback: "#22cc66",
  },
  peanut: {
    key: "peanut",
    name: "Cacahuate Retro",
    x: 2604,
    y: 136,
    w: 130,
    h: 160,
    points: 500,
    tier: "legendary",
    colorFallback: "#d4a373",
  },
  berries: {
    key: "berries",
    name: "Moras Cyberpunk",
    x: 3110,
    y: 136,
    w: 150,
    h: 160,
    points: 500,
    tier: "legendary",
    colorFallback: "#9933cc",
  },
  grapes2: {
    key: "grapes2",
    name: "Uvas Verdes Neón",
    x: 3302,
    y: 136,
    w: 110,
    h: 160,
    points: 500,
    tier: "legendary",
    colorFallback: "#76ff03",
  },
};

export const ALL_FRUITS = Object.values(FRUIT_DEFINITIONS);

/**
 * Retorna una fruta aleatoria ponderada ligeramente por rareza:
 * 50% común, 35% especial, 15% legendaria.
 */
export function getRandomFruit(): FruitDefinition {
  const rand = Math.random();
  let pool: FruitDefinition[];
  if (rand < 0.5) {
    pool = ALL_FRUITS.filter((f) => f.tier === "common");
  } else if (rand < 0.85) {
    pool = ALL_FRUITS.filter((f) => f.tier === "special");
  } else {
    pool = ALL_FRUITS.filter((f) => f.tier === "legendary");
  }
  return pool[Math.floor(Math.random() * pool.length)];
}
