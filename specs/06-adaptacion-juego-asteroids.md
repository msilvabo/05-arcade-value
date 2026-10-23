# Spec 06: Adaptación del Juego Asteroids en Cabina CRT

**Estado:** Implemented  
**Fecha:** 2026-10-23  
**Depende de:** 02-arcade-interfaces-visuales.md, 05-supabase-auth-y-perfiles.md

---

## Objetivo

Adaptar e integrar el juego clásico de Asteroids desde `references/started-games/02-asteroids` como un componente React/Canvas completamente interactivo dentro de la cabina CRT de la plataforma Next.js (`/games/asteroids-2084/play`), sincronizando su ciclo de vida y telemetría con el HUD y los overlays arcade.

---

## Alcance

### Dentro del alcance

- **1. Componente de Juego React/Canvas (`AsteroidsGame.tsx`):**
  - Migración y tipado TypeScript estricto de la lógica original de `references/started-games/02-asteroids/game.js`:
    - Clases y entidades: `Ship`, `Asteroid`, `Bullet`, `PowerUp`, `Particle`.
    - Físicas espaciales: envolvente toroidal de bordes (`wrap`), aceleración/inercia de nave, rotación angular, fricción, dispersión y rebote.
    - Sistema de colisiones: bala vs asteroide, nave vs asteroide, nave vs power-up.
    - Sistema de niveles progresivos y generación dinámica de asteroides.
    - Power-ups temporales (triple disparo con temporizador visual).
    - Partículas y animaciones vectoriales de explosión y propulsión.
  - Renderizado en `<canvas>` HTML5 responsivo y nítido, adaptado a la relación de aspecto dentro del chasis `CrtCabinet`.
  - Limpieza rigurosa de ciclo de vida en React (`requestAnimationFrame`, event listeners de teclado `keydown`/`keyup`) para prevenir memory leaks al desmontar o pausar.

- **2. Sincronización con Cabina y HUD Arcade:**
  - Desacoplar el HUD dibujado en canvas y sincronizar en tiempo real el estado con el `GameRoomHud` superior de React:
    - Puntuación actual (`score`).
    - Nivel actual (`level`).
    - Vidas restantes (`lives`).
  - Control de estados desde la cabina CRT:
    - Pausa/Reanudación: la pausa disparada desde `GameRoomHud` o `GameRoomOverlay` detiene el loop y la física del juego.
    - Game Over: al agotar las 3 vidas, notificar a `PlayRoomClient` para desplegar el modal `GameRoomOverlay`.
    - Reinicio de partida: reset de vidas, asteroides, nave y puntuación sin recargar la página.

- **3. Integración Dinámica en la Sala de Juego (`PlayRoomClient.tsx`):**
  - Renderizado condicional del juego según el parámetro `gameId`:
    - Si `gameId === 'asteroids-2084'` (o `'asteroids'`), montar el componente `AsteroidsGame`.
    - Si es otro juego, mantener el fallback visual existente (`ArkanoidPresentation`).
  - Preservar los efectos visuales del gabinete CRT (scanlines, curvatura de monitor, resplandores neón).

- **4. Persistencia de Puntuación (High Score):**
  - Servicio utilitario para registrar la mejor puntuación obtenida al finalizar la partida:
    - Guardado primario en `localStorage` bajo la clave `arcade_vault_highscore_asteroids-2084`.
    - Integración con Supabase: si existe una sesión activa de usuario, intentar registrar el récord en la tabla `game_scores` / `scores` de Supabase; si no hay sesión o falla la red, garantizar persistencia local transparente en `localStorage`.

### Fuera del alcance

- Efectos de sonido (SFX) o música de fondo (se mantiene silencioso fiel al código de referencia).
- Soporte para controles táctiles en pantalla o gamepads (enfocado en teclado: flechas / WASD y barra espaciadora).
- Modos multijugador en línea o cooperativo.
- Modificación del arte de carátulas o de la biblioteca general más allá de verificar el enlace hacia la sala de juego.

---

## Modelo de Datos y Tipos

### 1. Props del Componente AsteroidsGame (`components/game-room/AsteroidsGame.tsx`)

```typescript
export interface AsteroidsGameProps {
  isPaused: boolean;
  onScoreChange: (score: number) => void;
  onLivesChange: (lives: number) => void;
  onLevelChange: (level: number) => void;
  onGameOver: (finalScore: number) => void;
  restartSignal?: number; // contador incremental para reiniciar la partida
}
```

### 2. Estructura de Entidades del Juego

```typescript
export interface AsteroidEntity {
  x: number;
  y: number;
  size: 1 | 2 | 3;
  radius: number;
  dead: boolean;
  vx: number;
  vy: number;
  rotSpeed: number;
  rot: number;
  verts: [number, number][];
  update: (dt: number, width: number, height: number) => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
  split: () => AsteroidEntity[];
}

export interface BulletEntity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ttl: number;
  radius: number;
  dead: boolean;
  update: (dt: number, width: number, height: number) => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

export interface PowerUpEntity {
  x: number;
  y: number;
  ttl: number;
  dead: boolean;
  update: (dt: number) => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

export interface ParticleEntity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  dead: boolean;
  update: (dt: number) => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}
```

### 3. Persistencia de Puntuación (`lib/scores.ts`)

```typescript
export interface GameScorePayload {
  gameId: string;
  score: number;
  userId?: string | null;
  createdAt?: string;
}

export interface HighScoreResult {
  highScore: number;
  isNewRecord: boolean;
  persistedToSupabase: boolean;
}
```

Esquema SQL de referencia para Supabase (si la tabla `game_scores` existe o se crea):

```sql
create table if not exists public.game_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  game_id text not null,
  score integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

---

## Plan de Implementación

1. **Crear el helper de persistencia de puntajes (`lib/scores.ts`):**
   - Implementar `saveGameScore(gameId: string, score: number)`:
     - Leer y actualizar `localStorage` con la clave `arcade_vault_highscore_[gameId]`.
     - Detectar sesión de usuario mediante el cliente de Supabase (`lib/supabase/client.ts`). Si hay usuario, insertar en `game_scores`.
   - Implementar `getHighScore(gameId: string)` leyendo `localStorage` como valor inicial inmediato.
   - _Verificación:_ Pruebas unitarias/manuales de lectura y escritura en `localStorage`.

2. **Crear el componente `AsteroidsGame.tsx` (`components/game-room/AsteroidsGame.tsx`):**
   - Portar y tipar todas las clases del juego (`Ship`, `Asteroid`, `Bullet`, `PowerUp`, `Particle`) desde `references/started-games/02-asteroids/game.js`.
   - Implementar el componente usando `useRef<HTMLCanvasElement>` con resolución lógica de 800x600 ajustada por CSS al contenedor CRT.
   - Conectar listeners de teclado aislados que se limpian en el cleanup del `useEffect`.
   - Controlar el bucle `requestAnimationFrame(loop)` respetando la prop `isPaused`.
   - Emitir callbacks `onScoreChange`, `onLivesChange`, `onLevelChange`, y `onGameOver`.
   - _Verificación:_ Montar el canvas y validar que los asteroides y la nave se renderizan y responden al teclado sin fugas de memoria.

3. **Integrar `AsteroidsGame` en `PlayRoomClient.tsx`:**
   - Detectar si `gameId === 'asteroids-2084'` o `'asteroids'`.
   - Renderizar `AsteroidsGame` dentro de `CrtCabinet` pasando las funciones de actualización del estado local de React (`setScore`, `setLives`, `setLevel`, `setIsGameOver`).
   - Cargar el `highScore` inicial desde `lib/scores.ts`.
   - Enlazar la acción de reinicio (`handleRestart`) para resetear tanto el estado de React como el bucle interno del juego.
   - Al dispararse `onGameOver`, llamar a `saveGameScore` y actualizar el High Score si fue superado.
   - _Verificación:_ Navegar a `/games/ -2084/play`, verificar que se inicia el juego y que el HUD superior muestra 3 vidas y puntaje sincronizado.

4. **Ajuste de controles y metadatos en Lanzador (`app/games/[id]/page.tsx` y `data/games.ts`):**
   - Asegurar que la ficha de `asteroids-2084` refleje los controles correctos (`Rotar: Flechas / A-D`, `Propulsar: Arriba / W`, `Disparar: Espacio`).
   - _Verificación:_ Acceder a `/games/asteroids-2084` y comprobar que la bitácora de controles instruye adecuadamente al jugador antes de entrar a la sala.

5. **Verificación de Calidad y Compilación:**
   - Ejecutar `npm run build` y `npm run lint` para garantizar cero errores de TypeScript y linting.

---

## Criterios de Aceptación

- [ ] Al acceder a `/games/asteroids-2084/play`, se renderiza el juego de Asteroids dentro del monitor CRT con efectos de scanlines y curvatura activos.
- [ ] La nave espacial responde a los controles del teclado: rotación izquierda/derecha (`←`/`→` o `A`/`D`), propulsión (`↑` o `W`) y disparo (`Espacio`).
- [ ] La física espacial toroidal funciona correctamente: tanto la nave como los proyectiles y asteroides envuelven los bordes de la pantalla.
- [ ] Los asteroides grandes se dividen en medianos al ser impactados, y los medianos en pequeños, otorgando 20, 50 y 100 puntos respectivamente.
- [ ] La puntuación obtenida en el juego se refleja en tiempo real en el HUD superior de React (`GameRoomHud`).
- [ ] Al ser impactada la nave, se descuenta una vida en el HUD y se activa la invencibilidad temporal (parpadeo visual).
- [ ] Al perder las 3 vidas, el juego se detiene y se despliega el modal arcade de Game Over (`GameRoomOverlay`).
- [ ] Al hacer clic en "REINICIAR PARTIDA" en el modal de Game Over, la partida comienza de nuevo con 3 vidas y puntuación en 0.
- [ ] Al pausar desde el HUD superior o mediante el overlay de pausa, la nave y los asteroides congelan su movimiento.
- [ ] El récord máximo se almacena en `localStorage` y se sincroniza con Supabase si el usuario tiene sesión activa.
- [ ] No existen errores en la consola del navegador ni fugas de eventos `keydown`/`keyup` al salir de la pantalla.
- [ ] `npm run build` compila con éxito sin errores de tipos TypeScript.

---

## Decisiones Tomadas y Descartadas

- **Decisión:** Renderizado condicional en `PlayRoomClient` en lugar de una ruta nueva dedicada.  
  _Justificación:_ Reutiliza al 100% la infraestructura de cabina CRT (`CrtCabinet`), scanlines, controles de emulación y el HUD ya construidos en la Spec 02, manteniendo consistente la experiencia de usuario para cualquier título de la biblioteca.

- **Decisión:** Sincronizar el HUD en React y eliminar textos duplicados del canvas.  
  _Justificación:_ El canvas original dibujaba "SCORE", "NIVEL" y las vidas con fuentes monospace genéricas. La plataforma ya cuenta con un HUD arcade inmersivo estilizado con Tailwind CSS v4 y efectos neón; utilizar el HUD de React evita redundancia visual y desacopla la UI del motor de juego.

- **Decisión:** Persistencia híbrida (Supabase con fallback a `localStorage`).  
  _Justificación:_ Permite que cualquier visitante sin cuenta guarde su récord localmente en el navegador de inmediato, y que usuarios registrados mantengan su puntuación para el ranking global sin bloquear la jugabilidad si no hay conexión o sesión.

- **Descartado:** Incluir sintetizador de audio Web Audio API en esta etapa.  
  _Justificación:_ El juego de referencia original no poseía pistas de audio. Desarrollar un subsistema de sonido 8-bit añade complejidad no solicitada y amerita su propia especificación técnica dedicada para toda la plataforma.

---

## Riesgos Identificados

- **Riesgo:** Desincronización del bucle `requestAnimationFrame` en transiciones de React o modo estricto de desarrollo (doble montado).  
  _Mitigación:_ Gestionar el ID de animación en una referencia (`useRef<number | null>`) y cancelar explícitamente `cancelAnimationFrame` en la función de limpieza del efecto, además de reiniciar flags de teclas presionadas.

- **Riesgo:** Escalado borroso del `<canvas>` en pantallas con alta densidad de píxeles (Retina / HiDPI).  
  _Mitigación:_ Mantener la resolución lógica interna fija (800x600) y escalar el canvas mediante CSS con `aspect-ratio: 4 / 3` y renderizado nítido (`image-rendering: pixelated` o vector clásico).
