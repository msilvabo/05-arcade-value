# Spec 09: Creación del Juego Chrono Snake con Sprites de Frutas en Cabina CRT

**Estado:** Aprobado  
**Fecha:** 2026-10-26  
**Depende de:** 06-adaptacion-juego-asteroids.md, 07-leaderboard-y-tabla-de-juegos.md

---

## Objetivo

Diseñar e implementar el juego arcade clásico de la serpiente bajo la identidad "Chrono Snake" como un componente React/Canvas 4:3 (800x600) para la cabina CRT de Arcade Vault (`/games/chrono-snake/play`), integrando el sprite sheet de frutas retro desde `references/source-assets/snake-assets/`, desacoplando completamente el HUD mediante `CabinetGameProps` y habilitando persistencia híbrida en Supabase y modo offline.

---

## Alcance

### Dentro del alcance

- **1. Componente React/Canvas (`SnakeGame.tsx`):**
  - **Cuadrícula y coordenadas:**
    - Resolución lógica fija de 800x600 px adaptada al chasis CRT.
    - Cuadrícula de 32 columnas x 24 filas con celdas cuadradas de 25x25 px (`GRID_COLS = 32`, `GRID_ROWS = 24`, `CELL_SIZE = 25`).
  - **Física y movimiento discreto de la Serpiente:**
    - Cuerpo representado como un array de coordenadas en cuadrícula: `[{ x, y }, ...]`.
    - Inicio con longitud inicial de 3 segmentos centrados horizontalmente, moviéndose inicialmente hacia la derecha (`Direction.RIGHT`).
    - Buffer/cola de dirección para registrar entradas del teclado (`ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `W`, `A`, `S`, `D`) evitando giros instantáneos en reversa de 180° que provoquen auto-colisión involuntaria.
    - Avance por "ticks" de tiempo sincronizados mediante acumulador de delta time (`dt`) en el ciclo de `requestAnimationFrame`.
  - **Reglas de colisión y condición de derrota:**
    - **Muros sólidos mortales:** Chocar contra cualquier borde del área de juego (`x < 0 || x >= 32 || y < 0 || y >= 24`) provoca colisión fatal inmediata.
    - **Auto-canibalismo:** Chocar con cualquier segmento de su propio cuerpo provoca colisión fatal inmediata.
    - Al detectar colisión fatal: congelar movimiento, emitir partículas de dispersión y disparar `onGameOver(finalScore)`.
  - **Sistema de progresión y aceleración por niveles:**
    - Nivel inicial: Nivel 1 con velocidad de refresco base (~130 ms por tick, ~7.7 celdas/s).
    - Cada 5 frutas consumidas: incremento de nivel (`onLevelChange(level)`).
    - Con cada nivel: reducción progresiva del intervalo de tick (ej. 130 ms -> 115 ms -> 100 ms -> 88 ms -> 78 ms -> 68 ms ...) hasta un tope ultra veloz de 45 ms.
  - **Integración del Atlas de Frutas (`fruits.png` y `sprites.js`):**
    - Migración del sprite sheet a `public/games/snake/fruits.png`.
    - Mapeo en `spritesheet.ts` de las 22 frutas de `references/source-assets/snake-assets/sprites.js` (banana, orange, grape, garlic, eggplant, strawberry, cherry, carrot, mushroom, broccoli, watermelon, pepper, kiwi, lemon, peach, peanut, apple, tomato, berries, grapes2, pineapple, melon).
    - Aparición aleatoria de frutas en casillas vacías (excluyendo cualquier casilla ocupada por la serpiente).
    - Renderizado con `ctx.drawImage` recortando con exactitud `{ x, y, w, h }` del atlas original escalado a la celda de 25x25 px manteniendo nitidez pixelada.
    - Fallback visual procedimental (círculo neón brillante con resplandor) si la imagen aún no completa la carga.
    - **Tabla de puntajes según rareza de la fruta:**
      - _Frutas Comunes (100 pts):_ Apple, Banana, Orange, Strawberry, Cherry.
      - _Frutas Especiales (250 pts):_ Grape, Lemon, Peach, Kiwi, Tomato, Carrot, Garlic, Eggplant.
      - _Frutas Legendarias (500 pts):_ Watermelon, Pineapple, Melon, Pepper, Mushroom, Broccoli, Peanut, Berries, Grapes2.
  - **Estética Neón Cyber Arcade:**
    - Cabeza de la serpiente con color cyan brillante (`#00f0ff`) y ojos/indicador de dirección.
    - Cuerpo con gradiente neón verde/esmeralda (`#00ff88`) y brillo retro (`shadowColor`, `shadowBlur`).
    - Cuadrícula de fondo sutil con líneas de trama cian oscuro (`rgba(0, 240, 255, 0.05)`).
    - Sistema de partículas de chispas neón al devorar frutas y al impactar Game Over.
  - **Gestión de Ciclo de Vida y Memoria:**
    - Loop desacoplado con `requestAnimationFrame` y delta time.
    - Suscripción y desuscripción estricta de listeners en `window` (`keydown`).
    - Cancelación segura de la animación en desmontaje de React 19 (`useEffect`).

- **2. Desacoplamiento Total del HUD (`CabinetGameProps`):**
  - **Cero texto de HUD en el Canvas:** Prohibido renderizar "SCORE", "LIVES", "LEVEL" o "GAME OVER" sobre la pantalla de juego.
  - **Manejo de vidas:** 1 vida fija arcade (`onLivesChange(1)` al inicio).
  - **Puntaje:** Notificación incremental (`onScoreIncrement(pts)`) y acumulativa (`onScoreChange(newScore)`).
  - **Niveles:** Notificación en cada incremento (`onLevelChange(level)`).
  - **Pausa:** Congelamiento físico inmediato al recibir `isPaused === true`.
  - **Reinicio:** Restauración limpia sin recargar la página al recibir `restartSignal`.

- **3. Módulo de Juego y Registro Modular (`app/games/_games/chrono-snake/`):**
  - Estructuración de archivos del juego:
    - `config.ts`: Metadatos de catálogo (`SNAKE_SUMMARY`), detalles extendidos de la cabina (`SNAKE_DETAILS`), icono Material Symbols (`gesture` o `pest_control`), controles (`[Flechas] / [WASD]`).
    - `spritesheet.ts`: Coordenadas de corte `{ x, y, w, h }` del atlas de frutas, catálogo tipado de frutas y asignación de puntajes.
    - `SnakeGame.tsx`: Componente interactivo React/Canvas compatible con `CabinetGameProps`.
    - `index.ts`: Exportación modular conectando `CabinetComponent: SnakeGame`.
  - Verificación de registro en `GAME_MODULES` de `app/games/_lib/registry.tsx`.

- **4. Persistencia Híbrida y Supabase (Spec 07):**
  - Migración SQL incremental en `supabase/migrations/20261026120000_add_chrono_snake_game.sql`:
    - Registro de `chrono-snake` en `public.games` con categoría `PUZZLE ESTRATÉGICO / ACTION MAZE`.
    - Siembra de puntuaciones récord iniciales en `public.scores` asociadas a perfiles del salón de la fama.
  - Adición de 5 récords de muestra en `data/leaderboard.ts` para soporte offline y renderizado instantáneo en `/leaderboard`.

- **5. Verificación de Calidad y Rendimiento:**
  - TypeScript estricto sin tipo `any` sin justificar.
  - Ejecución de `npm run lint` y `npm run build` con código de salida 0.

### Fuera del alcance

- Efectos de sonido sintetizados (SFX) o banda sonora en streaming (mantenido en silencio de acuerdo al estándar de la plataforma).
- Modo de paredes envolventes (wrap-around estilo Pac-Man), respetando la elección de muros sólidos mortales clásica.
- Controles táctiles en pantalla o soporte gamepad.
- Modo multijugador online o dos serpientes simultáneas.

---

## Modelo de Datos y Tipos

### 1. Contrato de Cabina (`CabinetGameProps`)

```typescript
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

### 2. Entidades y Estructuras del Motor (`spritesheet.ts` y `SnakeGame.tsx`)

```typescript
export type GridCoord = {
  x: number;
  y: number;
};

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export interface FruitDefinition {
  key: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  points: number;
  tier: "common" | "special" | "legendary";
}

export interface ActiveFruit {
  position: GridCoord;
  fruit: FruitDefinition;
  spawnTime: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  decay: number;
}

export interface SnakeGameState {
  body: GridCoord[];
  direction: Direction;
  nextDirection: Direction;
  score: number;
  level: number;
  fruitsEaten: number;
  activeFruit: ActiveFruit | null;
  particles: Particle[];
  gameOver: boolean;
  tickInterval: number; // en milisegundos
  lastTickTime: number;
}
```

---

## Plan de Implementación

1. **Copia de Assets y Definición de Sprites:**
   - Copiar el archivo `references/source-assets/snake-assets/fruits.png` a `public/games/snake/fruits.png`.
   - Crear `app/games/_games/chrono-snake/spritesheet.ts` con la definición tipada de las 22 frutas de `sprites.js` y sus categorías de puntaje.

2. **Desarrollo del Componente `SnakeGame.tsx`:**
   - Crear el canvas con resolución lógica 800x600 y context 2D configurado con suavizado desactivado (`imageSmoothingEnabled = false`).
   - Implementar la precarga de la imagen de frutas con fallback gráfico procedimental.
   - Diseñar el loop con `requestAnimationFrame` que procese ticks según `dt` acumulado y renderizado a 60 fps con interpolación visual.
   - Implementar la cola de comandos de teclado para giros ortogonales suaves.
   - Programar la detección de colisiones (muros y cuerpo) y dispersión de partículas.
   - Sincronizar callbacks con `CabinetGameProps` (`onScoreChange`, `onLivesChange`, `onLevelChange`, `onGameOver`).
   - Implementar el reinicio ante cambios en `restartSignal` y pausa con `isPaused`.

3. **Consolidación del Módulo en Arcade Vault:**
   - Actualizar `app/games/_games/chrono-snake/config.ts` ajustando las instrucciones de controles y datos del lanzador.
   - Actualizar `app/games/_games/chrono-snake/index.ts` asignando `CabinetComponent: SnakeGame`.
   - Validar la integración en `app/games/_lib/registry.tsx`.

4. **Persistencia Híbrida y Leaderboard:**
   - Crear la migración SQL `supabase/migrations/20261026120000_add_chrono_snake_game.sql` registrando el juego en `public.games` y añadiendo récords iniciales en `public.scores`.
   - Incorporar puntuaciones de prueba para `chrono-snake` en `data/leaderboard.ts`.

5. **Verificación y Pruebas de Compilación:**
   - Ejecutar `npm run lint` para garantizar ausencia de advertencias y errores de formato.
   - Ejecutar `npm run build` confirmando la generación estática sin fallos de TypeScript ni rutas dinámicas.

---

## Criterios de Aceptación

- [ ] Archivo de especificación guardado en `specs/09-creacion-chrono-snake.md`.
- [ ] La imagen `fruits.png` se sirve desde `public/games/snake/fruits.png` y se recortan correctamente los 22 tipos de frutas.
- [ ] El canvas opera a 800x600 px dentro de `CrtCabinet` sin scrollbars ni desproporción visual.
- [ ] Ningún elemento de texto HUD (Score, Level, Vidas, Game Over) se dibuja en el canvas; se delegan a `CabinetGameProps`.
- [ ] La serpiente inicia con 1 vida, longitud de 3 segmentos y se desplaza con teclas `Flechas` y `WASD`.
- [ ] La serpiente muere inmediatamente al colisionar con los bordes de la pantalla (muros sólidos) o con su propio cuerpo.
- [ ] Comer frutas incrementa el tamaño de la serpiente, añade el puntaje correspondiente a la fruta y genera chispas neón.
- [ ] Cada 5 frutas el nivel avanza y la velocidad de desplazamiento aumenta.
- [ ] Al perder, se llama a `onGameOver(finalScore)` y se despliega `GameRoomOverlay`.
- [ ] El botón de reinicio (`restartSignal`) y la pausa (`isPaused`) responden de inmediato y de forma predecible.
- [ ] `chrono-snake` está disponible en la cabina `/games/chrono-snake/play` y cartuchos de `/leaderboard`.
- [ ] `npm run lint` y `npm run build` finalizan con código de salida 0.

---

## Decisiones Tomadas y Descartadas

- **Muros sólidos mortales frente a bordes envolventes (wrap-around):**  
  _Decisión:_ Muros sólidos mortales (800x600 px delimitado).  
  _Justificación:_ Seleccionado expresamente por el usuario para alinearse con la experiencia arcade clásica y el diseño original de Nokia Snake 1997.
- **Frutas aleatorias con tiers de rareza y puntaje:**  
  _Decisión:_ Las 22 frutas de `fruits.png` aparecen aleatoriamente clasificadas en tres categorías (Común: 100 pts, Especial: 250 pts, Legendaria: 500 pts).  
  _Justificación:_ Aporta dinamismo y alta rejugabilidad al aprovechar la riqueza gráfica del atlas suministrado.
- **Cuadrícula de 25x25 px (32x24 celdas):**  
  _Decisión:_ Dividir 800x600 exactamente en 32 columnas y 24 filas.  
  _Justificación:_ Ofrece una escala ideal para apreciar el arte detallado de las frutas de 160 px escaladas a 25 px y proporciona suficiente espacio de maniobra arcade en la cabina.

---

## Riesgos Identificados y Mitigaciones

| Riesgo                                                                            | Mitigación                                                                                                                      |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Retraso en la carga de la imagen `fruits.png` que impida renderizar la comida     | Implementación de fallback vectorial inmediato (círculo neón palpitante) hasta que el evento `onload` de la imagen se complete. |
| Giros de dirección rápidos que causen auto-colisión involuntaria en el mismo tick | Implementar una cola de direcciones (`nextDirection`) que solo acepte un giro perpendicular por cada tick de movimiento.        |
| Fuga de memoria por listeners huérfanos o loops descontrolados                    | Limpieza estricta de event listeners en `window` y cancelación del RAF en el return del `useEffect`.                            |
| Desincronización del estado de pausa en cabina                                    | Evaluación de la bandera `isPaused` antes de computar el tick de física y el avance temporal.                                   |
