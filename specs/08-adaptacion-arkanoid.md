# Spec 08: Adaptación del Juego Arkanoid en Cabina CRT

**Estado:** Aprobado  
**Fecha:** 2026-10-26  
**Depende de:** 06-adaptacion-juego-asteroids.md, 07-leaderboard-y-tabla-de-juegos.md

---

## Objetivo

Adaptar e integrar el juego clásico de Arkanoid desde `references/started-games/04-arkanoid` como un componente React/Canvas interactivo dentro de la cabina CRT de Arcade Vault (`/games/arkanoid-neon-revenge/play`), desacoplando el HUD y sincronizando el ciclo de vida, niveles y puntuación con la plataforma.

---

## Alcance

### Dentro del alcance

- **1. Componente React/Canvas (`ArkanoidGame.tsx`):**
  - Migración y tipado estricto en TypeScript del motor original ubicado en `references/started-games/04-arkanoid/game.js`:
    - **Entidades del motor:** Paleta (`Paddle`), Bola (`Ball`), Bloques (`Block`), Partículas de explosión (`Explosion`).
    - **Física y cinemática:**
      - Paleta Vaus: dimensiones de 81x14 px, posición fija en Y (560 px), velocidad lateral de 400 px/s mediante teclas de dirección (`ArrowLeft`, `ArrowRight`, `A`, `D`) y seguimiento directo horizontal mediante puntero/ratón (`mousemove`).
      - Bola reflectora: dimensiones de 16x16 px, velocidad vectorial base (`vx = 200`, `vy = -300`), escalada según el multiplicador de velocidad del nivel activo.
      - Rebote en bordes: límites izquierdo (`x <= 0`), derecho (`x + w >= 800`) y superior (`y <= 0`).
      - Rebote en paleta: rebote ascendente (`vy = -|vy|`) con ángulo dependiente del punto de impacto relativo respecto al centro de la paleta.
      - Colisión AABB contra bloques: detección por eje alineado, destrucción de bloque, incremento de puntuación y activación de explosión animada de 150 ms en 4 fotogramas.
      - Pérdida de bola: cuando `ball.y > 600`, decrementar vida y reiniciar bola sobre la paleta; si vidas llegan a 0, transicionar a Game Over.
    - **Sistema de progresión (5 niveles):**
      - Migración de las configuraciones de `references/started-games/04-arkanoid/levels.js` a `levels.ts`:
        - Nivel 1 (Velocidad 1.00x): Matriz completa de 6 filas x 10 columnas en 6 colores neón.
        - Nivel 2 (Velocidad 1.10x): Formación en pirámide invertida escalonada.
        - Nivel 3 (Velocidad 1.21x): Patrón en tablero de ajedrez alternando amarillo y magenta.
        - Nivel 4 (Velocidad 1.33x): Columnas dispersas con huecos asimétricos.
        - Nivel 5 (Velocidad 1.46x): Marco perimetral con cruz central.
      - Transición de nivel automática al destruir el último bloque vivo. Al completar el nivel 5, declarar victoria del jugador (`win`).
    - **Renderizado gráfico y spritesheet:**
      - Carga asíncrona de `public/games/arkanoid/spritesheet-breakout.png` con renderizado mediante `ctx.drawImage` de los sprites de paleta, bola, bloques por color y secuencia de explosión.
      - Fallback procedimental con figuras vectoriales y resplandor neón (`ctx.shadowBlur` / `ctx.fillStyle`) para garantizar jugabilidad inmediata si la imagen aún no ha cargado.
    - **Ciclo de vida y gestión de memoria:**
      - Canvas lógico con resolución fija de 800x600 px y escalado CSS responsivo dentro del chasis `CrtCabinet`.
      - Loop de renderizado desacoplado mediante `requestAnimationFrame` con cálculo de delta time (`dt`) en segundos.
      - Limpieza estricta de suscripciones a eventos de ventana (`keydown`, `keyup`, `mousemove`) y cancelación del RAF en la función de desmontaje (`useEffect`).

- **2. Desacoplamiento Total del HUD (`CabinetGameProps`):**
  - Eliminación absoluta de textos de puntuación, vidas, nivel o textos de "GAME OVER" dibujados sobre el Canvas.
  - Sincronización bidireccional con el contenedor arcade mediante `CabinetGameProps`:
    - `onScoreChange(newScore)` / `onScoreIncrement(10)`: notificar 10 puntos por cada bloque destruido.
    - `onLivesChange(lives)`: inicializar en 3 vidas y notificar ante cada pérdida de bola.
    - `onLevelChange(level)`: notificar el nivel en curso (1 al 5) al arrancar y en cada transición.
    - `onGameOver(finalScore)`: disparar inmediatamente al perder la última vida o al completar con éxito los 5 niveles para activar el overlay de cabina (`GameRoomOverlay`).
    - `isPaused`: congelar la actualización física y el movimiento cuando la cabina esté en pausa, manteniendo el fotograma visible en el canvas.
    - `restartSignal`: reiniciar la partida a su estado inicial (Nivel 1, 3 vidas, puntuación 0, reposicionamiento de bola y paleta) al recibir un nuevo valor incremental.

- **3. Módulo de Juego y Registro en Plataforma (`app/games/_games/arkanoid-neon-revenge/`):**
  - Refactorizar y consolidar la estructura modular:
    - `config.ts`: metadatos de catálogo (`ARKANOID_SUMMARY`), ficha extendida de lanzador (`ARKANOID_DETAILS`), icono de Material Symbols (`sports_baseball`) e instrucciones de control.
    - `levels.ts`: tipos e inicializador de los 5 niveles.
    - `spritesheet.ts`: mapas de coordenadas de corte (`SPRITES`, `EXPLOSION_FRAMES`) y constantes.
    - `ArkanoidGame.tsx`: componente funcional de juego conectado a `CabinetGameProps`.
    - `index.ts`: exportación de `arkanoidModule` cumpliendo el contrato `GameModule`.
  - Verificar el registro en `GAME_MODULES` de `app/games/_lib/registry.tsx`.

- **4. Persistencia Híbrida y Récords (Supabase + Fallback Offline):**
  - Asegurar la presencia del juego `arkanoid-neon-revenge` y sus récords en Supabase.
  - Mantener los récords offline y mocks actualizados en `data/leaderboard.ts` con claves consistentes (`arkanoid` / `arkanoid-neon-revenge`).

- **5. Verificación de Calidad y Rendimiento:**
  - Validación con TypeScript en modo estricto (`strict: true`).
  - Verificación mediante `npm run lint` y `npm run build` con código de salida 0.

### Fuera del alcance

- Reproducción de efectos de sonido (SFX) o música de fondo (los archivos de audio se mantienen en `public/games/arkanoid/sounds/` pero silenciados por defecto dentro de la cabina).
- Controles táctiles en pantalla o soporte para mandos de juego/gamepads (experiencia nativa orientada a teclado y ratón de cabina CRT).
- Modos multijugador cooperativo o competitivo en tiempo real.
- Mecánicas de power-ups no existentes en el código base de referencia (cápsulas de disparo láser, multibola, ensanchamiento de paleta o compuertas dimensionales).

---

## Modelo de Datos y Tipos

### 1. Contrato de Cabina (`CabinetGameProps`)

```typescript
import { FC } from "react";

export interface CabinetGameProps {
  isPaused: boolean;
  onScoreIncrement?: (pts: number) => void;
  onScoreChange?: (score: number) => void;
  onLivesChange?: (lives: number) => void;
  onLevelChange?: (level: number) => void;
  onGameOver?: (finalScore: number) => void;
  restartSignal?: number;
}
```

### 2. Estructuras y Entidades del Motor (`ArkanoidGame.tsx`)

```typescript
export type BlockColor =
  "red" | "yellow" | "cyan" | "magenta" | "hotpink" | "green" | "gray";

export interface PaddleEntity {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface BallEntity {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
}

export interface BlockEntity {
  x: number;
  y: number;
  w: number;
  h: number;
  color: BlockColor | string;
  alive: boolean;
}

export interface ExplosionEntity {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  elapsed: number;
}

export interface BlockDef {
  col: number;
  row: number;
  color: string;
}

export interface LevelDef {
  speed: number;
  blocks: BlockDef[];
}

export type GamePlayState = "playing" | "gameover" | "win";
```

### 3. Registro de Metadatos del Catálogo (`config.ts`)

```typescript
import { Game } from "@/types/game";
import { GameExtendedDetails } from "@/types/launcher";

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
```

---

## Plan de Implementación

1. **Revisión y Consolidación de Definición de Niveles y Sprites (`levels.ts` y `spritesheet.ts`):**
   - Verificar la completitud de los 5 niveles en `app/games/_games/arkanoid-neon-revenge/levels.ts`.
   - Ajustar `app/games/_games/arkanoid-neon-revenge/spritesheet.ts` con tipado estricto para `SPRITES` y `EXPLOSION_FRAMES`.

2. **Reescritura Completa de `ArkanoidGame.tsx` con Motor de Canvas 800x600:**
   - Configurar el canvas con resolución lógica interna fija de 800x600 y escalado adaptable `w-full h-full [image-rendering:pixelated]`.
   - Implementar la precarga no bloqueante del spritesheet `spritesheet-breakout.png` con renderizador vectorial de rescate.
   - Migrar la física original de paleta (movimiento teclado + ratón), bola, rebotes angulares y colisiones AABB contra bloques.
   - Sincronizar callbacks de cabina (`onScoreChange`, `onLivesChange`, `onLevelChange`, `onGameOver`).
   - Implementar congelamiento del loop en pausa (`isPaused`) y reinicio íntegro con `restartSignal`.

3. **Alineación de Metadatos y Exportación Modular (`config.ts` e `index.ts`):**
   - Asegurar que `ARKANOID_DETAILS.missionLog.controls` refleje los controles de teclado y ratón activos.
   - Exportar `arkanoidModule` en `index.ts` e integrar o verificar su presencia en `app/games/_lib/registry.tsx`.

4. **Sincronización de Persistencia y Leaderboard:**
   - Comprobar que las claves en `data/leaderboard.ts` incluyan alias compatibles (`arkanoid` y `arkanoid-neon-revenge`).
   - Verificar que no existan discrepancias con el identificador en `supabase/migrations/20261023000000_create_games_and_scores_tables.sql`.

5. **Verificación y Pruebas de Calidad:**
   - Ejecutar `npm run lint` y corroborar 0 advertencias o errores.
   - Ejecutar `npm run build` para asegurar la compilación estática de `/games/arkanoid-neon-revenge` y `/games/arkanoid-neon-revenge/play`.

---

## Criterios de Aceptación

- [ ] Archivo de spec `specs/08-adaptacion-arkanoid.md` aprobado y guardado.
- [ ] Componente `ArkanoidGame.tsx` compila limpiamente sin errores de TypeScript (`strict: true`).
- [ ] El canvas se renderiza en resolución lógica 800x600 sin distorsión de aspecto dentro de `CrtCabinet`.
- [ ] No se renderiza ningún texto de HUD en el Canvas; el HUD exterior de React refleja puntuación, nivel (1-5) y vidas (3).
- [ ] La paleta responde de forma suave tanto a las teclas (`←`/`→`, `A`/`D`) como al movimiento horizontal del ratón.
- [ ] La bola rebota correctamente en paredes, paleta con ángulo según punto de impacto y destruye bloques otorgando 10 puntos por impacto.
- [ ] Las partículas de explosión se dibujan durante 150 ms con su respectivo color según el bloque destruido.
- [ ] Al destruir todos los bloques de un nivel se carga automáticamente el siguiente hasta el nivel 5.
- [ ] Al perder todas las vidas o terminar el nivel 5, se invoca `onGameOver(finalScore)` y se despliega `GameRoomOverlay`.
- [ ] Al activarse `isPaused`, la física y el movimiento se congelan por completo.
- [ ] Al recibir un nuevo `restartSignal`, el juego reinicia limpiamente sus variables sin recargar el navegador.
- [ ] Todos los event listeners y el bucle `requestAnimationFrame` se cancelan al desmontar el componente.
- [ ] `npm run lint` y `npm run build` finalizan con código de salida 0.

---

## Decisiones Tomadas y Descartadas

- **Desacoplamiento total del HUD:**  
  _Decisión:_ Eliminar el HUD dibujado en canvas y usar `CabinetGameProps`.  
  _Justificación:_ Cumplimiento estricto de la arquitectura de la cabina CRT unificada de Arcade Vault (Spec 06).
- **Resolución lógica 800x600 con aspecto 4:3:**  
  _Decisión:_ Canvas fijo de 800x600 px escalado mediante CSS.  
  _Justificación:_ Preserva las proporciones matemáticas exactas de la rejilla de bloques y la velocidad balística original.
- **Soporte híbrido de renderizado (Spritesheet + Neón Procedimental):**  
  _Decisión:_ Cargar spritesheet pero contar con dibujo vectorial inmediato en canvas como salvaguarda.  
  _Justificación:_ Previene parpadeos o errores visuales durante cargas lentas o fallos de red sobre el asset.
- **Exclusión de audio en cabina:**  
  _Decisión:_ Mantener el juego silencioso por defecto dentro de la cabina arcade.  
  _Justificación:_ Coherencia con el estándar de Asteroids (Spec 06) y prevención de saturación de sonido no solicitado en el navegador.

---

## Riesgos Identificados y Mitigaciones

| Riesgo                                                                                   | Mitigación                                                                                                                 |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Fuga de memoria o eventos colgados de mouse/teclado                                      | Centralizar registros en `useEffect` con remoción explícita en su cleanup (`removeEventListener`, `cancelAnimationFrame`). |
| Desincronización del estado de pausa                                                     | Evaluar `isPaused` al inicio de cada fotograma antes de integrar delta time y físicas.                                     |
| Inconsistencia de identificadores (`arkanoid` vs `arkanoid-neon-revenge`) en Leaderboard | Configurar alias en `arkanoidModule.aliases` y mantener mapeo resiliente en servicios de scores.                           |

---

## Lo que NO está en esta spec

- Power-ups adicionales (cápsulas de expansión de pala, disparos láser o multibola).
- Efectos de sonido sintetizados o bandas sonoras de fondo.
- Controles táctiles para dispositivos móviles.
- Modalidad multijugador en red.
