import { GameExtendedDetails } from "@/types/launcher";

export const GAME_DETAILS: Record<string, GameExtendedDetails> = {
  arkanoid: {
    id: "arkanoid",
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
    missionLog: {
      story:
        "La nave nodriza ARKAIS ha sido corrompida por la entidad dimensional DOH. Como último piloto a bordo de la cápsula de escape VAUS, debes atravesar 33 sectores espaciales defendidos por murallas de fotones refractarios. Tu única arma es la esfera reflectora de plasma comprimido.",
      objective:
        "Destruye todas las matrices de ladrillos en cada sector sin dejar caer la esfera al vacío estelar para abrir la compuerta dimensional del siguiente cuadrante.",
      controls: [
        { key: "[A] [D] / [←] [→]", action: "Mover cápsula Vaus lateralmente" },
        { key: "[ESPACIO]", action: "Lanzar esfera / Disparar cañones láser" },
        { key: "[P]", action: "Pausar simulación del sistema" },
        { key: "[TAB]", action: "Alternar telemetría de rendimiento CRT" },
      ],
      powerups: [
        {
          name: "LÁSER OFENSIVO (L)",
          color: "border-secondary-container text-secondary-container",
          description: "Equipa a la nave Vaus con dos cañones láser para destruir ladrillos a distancia.",
        },
        {
          name: "EXPANSIÓN VAUS (E)",
          color: "border-primary-container text-primary-container",
          description: "Aumenta la longitud de la nave un 40% facilitando el rebote de la esfera.",
        },
        {
          name: "MULTI-ESFERA (D)",
          color: "border-tertiary-container text-tertiary-fixed",
          description: "Triplica la esfera de plasma en juego generando caos y alto puntaje.",
        },
        {
          name: "BRECHA PORTAL (B)",
          color: "border-surface-tint text-surface-tint",
          description: "Abre de inmediato la puerta de salida al siguiente nivel de sector.",
        },
      ],
    },
  },
  tetris: {
    id: "tetris",
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
      objective: "Completa líneas horizontales consecutivas para activar combos Tetris y acumular créditos.",
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
          description: "Multiplica x4 el puntaje por maniobras de rotación precisa.",
        },
        {
          name: "LINE CLEAR SHOCK",
          color: "border-primary-container text-primary-container",
          description: "Elimina dos líneas basales adicionales mediante sobrecarga.",
        },
      ],
    },
  },
  "space-invaders": {
    id: "space-invaders",
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
    cabinetNumber: "#007",
    missionLog: {
      story:
        "Una armada alienígena desciende rítmicamente hacia la base orbital terrestre. Defiende los búnkeres de protección y elimina la nave nodriza de mando misteriosa.",
      objective: "Aniquila todas las oleadas de invasores antes de que alcancen el suelo de tu base.",
      controls: [
        { key: "[←] [→]", action: "Desplazar cañón láser" },
        { key: "[ESPACIO]", action: "Fuego continuo" },
      ],
      powerups: [
        {
          name: "UFO SCANNER",
          color: "border-secondary-container text-secondary-container",
          description: "Predice la ruta de la nave nodriza misteriosa de 300 puntos.",
        },
      ],
    },
  },
  pacman: {
    id: "pacman",
    title: "PAC-MAN",
    subtitle: "NEON MAZE",
    badge: "PERFECT SCORE",
    version: "REV.1980.256",
    releaseYear: 1980,
    developer: "NAMCO LEGENDS",
    genre: "Laberinto de Acción Clásico",
    maxScore: "3,333,360",
    recordHolder: "BILLY_HERO",
    activePlayers: 54,
    cabinetNumber: "#001",
    missionLog: {
      story:
        "Atrapado en el laberinto de neón cibernético, debes devorar todas las píldoras de energía mientras evitas a los cuatro fantasmas guardianes del sistema.",
      objective: "Devora todas las píldoras del cuadrante e ingiere las pastillas de poder para contraatacar a los fantasmas.",
      controls: [
        { key: "[W] [A] [S] [D] / [Flechas]", action: "Navegar laberinto" },
        { key: "[P]", action: "Pausar partida" },
      ],
      powerups: [
        {
          name: "POWER PELLET",
          color: "border-tertiary-container text-tertiary-fixed",
          description: "Vuelve vulnerables a los fantasmas y multiplica la puntuación en cadena.",
        },
      ],
    },
  },
  snake: {
    id: "snake",
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
    missionLog: {
      story:
        "Guía el pulso de energía Chrono a través de una cuadrícula de vectores. Con cada nodo de datos consumido, el tren de impulsos se alarga y la frecuencia cardíaca aumenta.",
      objective: "Consume todos los orbes de energía sin colisionar con los bordes de la red ni con tu propia estela.",
      controls: [
        { key: "[Flechas]", action: "Cambiar vector de desplazamiento" },
      ],
      powerups: [
        {
          name: "CHRONO SLOWDOWN",
          color: "border-primary-container text-primary-container",
          description: "Ralentiza la frecuencia de la cuadrícula durante 5 segundos.",
        },
      ],
    },
  },
  asteroids: {
    id: "asteroids",
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
      objective: "Fracciona y destruye los asteroides gigantes y esquiva los platillos voladores hostiles.",
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
          description: "Teletransporte aleatorio para escapar de colisiones inminentes.",
        },
      ],
    },
  },
};

// Aliases para soportar tanto IDs cortos como IDs largos de GAMES
GAME_DETAILS["arkanoid-neon-revenge"] = { ...GAME_DETAILS["arkanoid"], id: "arkanoid-neon-revenge" };
GAME_DETAILS["cyber-tetris-99"] = { ...GAME_DETAILS["tetris"], id: "cyber-tetris-99" };
GAME_DETAILS["space-invaders-galaxy"] = { ...GAME_DETAILS["space-invaders"], id: "space-invaders-galaxy" };
GAME_DETAILS["pacman-neon-maze"] = { ...GAME_DETAILS["pacman"], id: "pacman-neon-maze" };
GAME_DETAILS["chrono-snake"] = { ...GAME_DETAILS["snake"], id: "chrono-snake" };
GAME_DETAILS["asteroids-2084"] = { ...GAME_DETAILS["asteroids"], id: "asteroids-2084" };
