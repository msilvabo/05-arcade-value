import { GameExtendedDetails } from "@/types/launcher";
import { getAllGameConfigs, getGameConfig } from "@/app/games/_lib/registry";

// Objeto base para compatibilidad con código existente
export const GAME_DETAILS: Record<string, GameExtendedDetails> = new Proxy(
  {},
  {
    get: (_target, prop: string) => {
      return getGameConfig(prop);
    },
  }
);

// Rellenar propiedades explícitas para Object.keys() / enumeración
getAllGameConfigs().forEach((cfg) => {
  GAME_DETAILS[cfg.id] = cfg;
});
