import { LiveScoreTickerItem, DailyTopPlayer, FaqItem, HomeFeature, StatItem } from "@/types/activity";

export const LIVE_SCORES_FEED: LiveScoreTickerItem[] = [
  { id: "ls-1", gamerTag: "NEONFOX", gameTitle: "Arkanoid: Neon Revenge", score: 184220, timeAgo: "hace 2 min", color: "magenta" },
  { id: "ls-2", gamerTag: "PX_KAI", gameTitle: "Pac-Man 84", score: 96400, timeAgo: "hace 5 min", color: "yellow" },
  { id: "ls-3", gamerTag: "Z3R0COOL", gameTitle: "Space Invaders DX", score: 54190, timeAgo: "hace 8 min", color: "green" },
  { id: "ls-4", gamerTag: "VAULT_07", gameTitle: "Asteroids Vector", score: 41200, timeAgo: "hace 12 min", color: "cyan" },
  { id: "ls-5", gamerTag: "GLITCHA", gameTitle: "Arkanoid: Neon Revenge", score: 28450, timeAgo: "hace 18 min", color: "cyan" },
  { id: "ls-6", gamerTag: "ARKADYA", gameTitle: "Snake Retro", score: 7820, timeAgo: "hace 24 min", color: "green" },
  { id: "ls-7", gamerTag: "CYBER_LU", gameTitle: "Frogger Highway", score: 18900, timeAgo: "hace 31 min", color: "yellow" },
];

export const DAILY_TOP_PLAYERS: DailyTopPlayer[] = [
  { rank: 1, gamerTag: "NEONFOX", score: 312840, percentage: 100 },
  { rank: 2, gamerTag: "PX_KAI", score: 248110, percentage: 84 },
  { rank: 3, gamerTag: "M00NRYU", score: 196720, percentage: 68 },
  { rank: 4, gamerTag: "VAULT_07", score: 154300, percentage: 52 },
  { rank: 5, gamerTag: "GLITCHA", score: 138900, percentage: 36 },
];

export const HOME_FEATURES: HomeFeature[] = [
  {
    id: "ft-1",
    icon: "GAMEPAD",
    title: "JUEGOS CLÁSICOS",
    description: "Arkanoid, Tetris, Space Invaders y muchos más. Los mejores arcades de todos los tiempos en un solo lugar.",
    color: "cyan",
  },
  {
    id: "ft-2",
    icon: "FREE",
    title: "100% GRATIS",
    description: "Sin suscripciones, sin pagos ocultos. Todos los juegos disponibles de forma gratuita y sin fricción.",
    color: "yellow",
  },
  {
    id: "ft-3",
    icon: "TROPHY",
    title: "LADDER BOARDS",
    description: "Compite con jugadores de todo el mundo. Escala el ranking en tiempo real y demuestra quién es el rey del arcade.",
    color: "magenta",
  },
  {
    id: "ft-4",
    icon: "ROCKET",
    title: "SIEMPRE CRECIENDO",
    description: "Agregamos nuevos títulos y mejoras constantemente. Vuelve seguido, siempre habrá un nuevo reto esperándote.",
    color: "green",
  },
];

export const HOME_STATS: StatItem[] = [
  { number: "12+", unit: "JUEGOS", subtitle: "Y CONTANDO" },
  { number: "MILES", unit: "DE PARTIDAS", subtitle: "JUGADAS CADA DÍA" },
  { number: "GLOBAL", unit: "RANKING", subtitle: "COMPITE CON EL MUNDO" },
];

export const FAQS_LIST: FaqItem[] = [
  {
    id: "faq-1",
    question: "¿REALMENTE ES GRATIS?",
    answer: "Sí. Arcade Vault es un proyecto comunitario hecho por amor a los clásicos arcade. No hay versiones 'premium' escondidas ni microtransacciones.",
  },
  {
    id: "faq-2",
    question: "¿NECESITO CREAR UNA CUENTA?",
    answer: "No es obligatorio. Puedes jugar como invitado inmediatamente. Si quieres registrar tu GamerTag, guardar récords en el Salón de la Fama y competir globalmente, el registro toma 10 segundos.",
  },
  {
    id: "faq-3",
    question: "¿CÓMO SOBREVIVEN SIN COBRAR?",
    answer: "Es un proyecto impulsado por la comunidad y el software libre. Si disfrutas la plataforma, compártela con tus amigos: esa es toda la moneda que necesitamos.",
  },
];
