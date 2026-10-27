# Spec GJ-01: Creación del Juego Cyber-Frogger: Data Highway Protocol (Acción / Reflejos) en Cabina CRT

**Estado:** Borrador  
**Fecha:** 2026-10-27  
**Tema del Jam:** "Cyber-Frogger"  
**Depende de:** 06-adaptacion-juego-asteroids.md, 07-leaderboard-y-tabla-de-juegos.md

---

## Objetivo

Diseñar e implementar el juego arcade **Cyber-Frogger: Data Highway Protocol** bajo el tema "Cyber-Frogger" como un componente React/Canvas 4:3 (800x600 px) para la cabina CRT de Arcade Vault (`/games/cyber-frogger-action/play`), desacoplando completamente el HUD mediante `CabinetGameProps`, con 3 vidas clásicas, habilidad de Cyber-Dash, físicas continuas de transporte sobre bloques RAM y persistencia híbrida en Supabase y modo offline.

---

## Giro Temático del Jam: "Cyber-Frogger"

En **Cyber-Frogger: Data Highway Protocol**, el jugador pilota un micro-dron de datos autónomo (`Cyber-Frog`) inyectado en la capa física de un super-servidor corrupto. Su misión es infiltrar la red central transportando paquetes de parche de seguridad hasta los 5 Nodos Maestros del procesador central.

La experiencia reinventa el clásico arcade de 1981 con una estética neón synthwave / cyberpunk de alta velocidad:

1. **La Autopista de Tráfico Corrupto:** 5 carriles de tráfico bidireccional donde circulan paquetes SYN-ACK de alta frecuencia, camiones troyanos acorazados de 3 celdas de longitud, ráfagas de proyectiles DDoS y firewalls láser pulsantes que exigen reflejos milimétricos.
2. **Buffer Cache Safe Zone:** Una zona de amortiguación intermedia donde el dron puede recargar su condensador de **Cyber-Dash** antes de acometer el tramo más letal.
3. **Corriente de Sobrecarga Térmica (Thermal Overheat Liquid):** Un río de refrigerante de plasma a 600 °C que fluye implacablemente. Para cruzarlo, el dron debe calcular sus saltos sobre módulos flotantes de memoria RAM (DDR Modules) y canales de Bus de Datos que viajan a diferentes velocidades, evitando microchips con disipadores térmicos que se sobrecalientan y sumergen periódicamente.
4. **Habilidad Cyber-Dash:** Una mecánica de acción pura donde pulsar la barra espaciadora proyecta al dron 2 casillas hacia adelante a hipervelocidad con 200 ms de invulnerabilidad temporal (cooldown de 4 s).

---

## Alcance

### Dentro del alcance

- **1. Componente React/Canvas (`CyberFroggerActionGame.tsx`):**
  - **Sistema de Coordenadas y Cuadrícula:**
    - Canvas lógico fijo de 800x600 px (relación de aspecto 4:3) renderizado dentro de `CrtCabinet` con `image-rendering: pixelated`.
    - Cuadrícula fija de 20 columnas x 15 filas con celdas de 40x40 px exactas (`GRID_COLS = 20`, `GRID_ROWS = 15`, `CELL_SIZE = 40`).
    - Distribución vertical de zonas (Filas 0 a 14):
      - **Fila 0 (y = 0 a 40):** 5 Nodos Maestros del Servidor (Bahías de meta en cols 2, 6, 10, 14 y 18).
      - **Fila 1 (y = 40 a 80):** Plataforma de Enlace del Núcleo (Core Bus Link).
      - **Filas 2 a 6 (y = 80 a 280):** Zona de Refrigerante Térmico (5 carriles de plataformas RAM y disipadores flotantes).
      - **Fila 7 (y = 280 a 320):** Zona Segura de Memoria Intermedia (Buffer Cache Lane).
      - **Filas 8 a 12 (y = 320 a 520):** Autopista de Datos Corruptos (5 carriles de tráfico de red y firewalls láser).
      - **Filas 13 a 14 (y = 520 a 600):** Socket de Inyección de Datos (Zona de inicio del dron, spawn centrado en x = 400, y = 560).
  - **Físicas y Cinemática del Dron:**
    - Posición espacial discreta por celdas con interpolación gráfica continua de salto (duración del salto: 120 ms).
    - Tecla `Espacio`: Habilidad **Cyber-Dash** (desplazamiento instantáneo de 2 celdas hacia la dirección activa, 200 ms de inmunidad y ráfaga de partículas cian, con cooldown de 4.0 segundos).
    - Arrastre en plataformas flotantes: cuando el dron está en una plataforma sobre el refrigerante térmico (Filas 2 a 6), hereda su velocidad horizontal (`x += platform.vx * dt`).
    - Si el dron se desborda fuera de los límites de la pantalla (`x < 0` o `x > 800`), muere aplastado por los marcos del chasis.
  - **Reglas de Detección de Colisión y Muerte:**
    - **Autopista (Filas 8 a 12):** Detección AABB entre el dron (32x32 px centrado en su celda) y cualquier paquete corrupto o láser activo. Impacto = destrucción inmediata.
    - **Refrigerante Térmico (Filas 2 a 6):** Al completar un salto en estas filas, se verifica si el centro del dron coincide con la bounding box de una plataforma RAM o disipador activo. Si pisa el refrigerante vacío o un disipador sumergido/sobrecalentado = vaporización térmica instantánea.
    - **Nodos Maestros (Fila 0):** Aterrizar con éxito en una bahía de nodo no penetrada lo asegura (+1000 pts). Aterrizar sobre los muros de contención divisorios entre nodos = colisión fatal.
    - Consecuencia de muerte: Explosión de 30 partículas ámbar/magenta, reducción de 1 vida (`onLivesChange(lives - 1)`) y reaparición en el socket de inyección tras 800 ms. Si `lives === 0`, disparar `onGameOver(finalScore)`.
  - **Temporizador de Ciclo de Datos:**
    - Tiempo límite por vida: 45 segundos.
    - Si el temporizador llega a 0, sobrecarga de conexión crítica y destrucción del dron.
  - **Progresión de Niveles y Curva de Dificultad:**
    - Nivel inicial: 1.
    - Penetrar los 5 Nodos Maestros otorga un bono de finalización de nivel (+3000 pts), reinicia los 5 nodos a estado inactivo y avanza de nivel con `onLevelChange(level + 1)`.
    - Cada nuevo nivel incrementa la velocidad de todos los carriles de tráfico y plataformas un 12% (`speedMultiplier = 1 + (level - 1) * 0.12`), reduce el tiempo de ciclo en 2 segundos (mínimo 25 s) y aumenta la frecuencia de pulsos del firewall láser.
  - **Estética Neón Cyber Arcade:**
    - Dron `Cyber-Frog`: Estructura biomecánica retro-cyberpunk en verde esmeralda (`#00ff66`) con visor cian brillante (`#00f0ff`) y pulso de estela neón.
    - Autopista: Líneas de cuadrícula de fibra óptica en azul oscuro y tráfico en rojo neón (`#ff0055`) y ámbar (`#ffb700`).
    - Refrigerante térmico: Flujo de partículas ondulantes en magenta profundo (`rgba(255, 0, 85, 0.25)`).
    - Bloques RAM: Circuitos cian con conectores dorados y resplandor neón (`shadowBlur = 12`).
    - Nodos Maestros: Esferas holográficas vacías que se iluminan intensamente en verde neón al ser penetradas.
  - **Gestión de Ciclo de Vida y Memoria en React 19:**
    - Loop desacoplado con `requestAnimationFrame` y delta time (`dt`) en segundos.
    - Suscripción limpia a `keydown` / `keyup` en `window`.
    - Congelamiento estricto si `isPaused === true`.
    - Reinicio instantáneo sin recargar página ante cambios en `restartSignal`.

- **2. Desacoplamiento Total del HUD (`CabinetGameProps`):**
  - Cero texto de HUD dibujado en el Canvas (sin puntuación, vidas, nivel ni textos flotantes).
  - Vidas iniciales: 3 vidas (`onLivesChange(3)`).
  - Puntuación:
    - Salto hacia adelante a nueva fila: +10 pts por cada fila alcanzada por primera vez en la vida activa.
    - Penetrar un Nodo Maestro: +1000 pts.
    - Capturar pulso dorado de Overclock (bonus esporádico en nodo): +500 pts.
    - Bono de tiempo al penetrar nodo: +20 pts por cada segundo restante en el temporizador de ciclo.
    - Completar los 5 nodos (fin de nivel): +3000 pts.
  - Callbacks `onScoreIncrement`, `onScoreChange`, `onLivesChange`, `onLevelChange`, `onGameOver`.

- **3. Módulo de Juego y Registro Modular (`app/games/_games/cyber-frogger-action/`):**
  - Archivos modulares:
    - `config.ts`: Metadatos de catálogo (`CYBER_FROGGER_ACTION_SUMMARY`), ficha técnica (`CYBER_FROGGER_ACTION_DETAILS`), icono Material Symbols (`pest_control` o `sports_esports`), controles (`[Flechas] / [WASD] + [Espacio]`).
    - `CyberFroggerActionGame.tsx`: Componente interactivo React/Canvas compatible con `CabinetGameProps`.
    - `index.ts`: Exportación del módulo cumpliendo el contrato `GameModule`.
  - Registro en `GAME_MODULES` de `app/games/_lib/registry.tsx`.

- **4. Persistencia Híbrida y Récords (Supabase + Fallback Offline):**
  - Migración SQL en `supabase/migrations/20261027150000_add_cyber_frogger_action_game.sql`.
  - Inserción en `public.games` y récords iniciales en `public.scores`.
  - Fallback con 5 récords temáticos en `data/leaderboard.ts`.

- **5. Verificación de Calidad y Rendimiento:**
  - TypeScript en modo estricto (`strict: true`), sin uso de `any`.
  - Ejecución de `npm run lint` y `npm run build` con código de salida 0.

### Fuera del alcance

- Soporte para audio o sintetizadores SFX en esta fase (silencioso por diseño del catálogo base).
- Controles táctiles en pantalla o soporte gamepad.
- Modo multijugador online cooperativo o versus.

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

### 2. Estructuras y Entidades del Motor (`CyberFroggerActionGame.tsx`)

```typescript
export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export interface CyberFrogEntity {
  col: number; // Columna en la cuadrícula (0 a 19)
  row: number; // Fila en la cuadrícula (0 a 14)
  visualX: number; // Coordenada X renderizada (interpolada para salto suave)
  visualY: number; // Coordenada Y renderizada (interpolada para salto suave)
  isJumping: boolean; // Verdadero durante la animación del salto
  jumpProgress: number; // Normalizado 0.0 a 1.0 durante el salto
  direction: Direction; // Orientación visual del dron
  isInvulnerable: boolean; // Verdadero durante el Cyber-Dash
  invulnerableTimer: number; // Tiempo restante de invulnerabilidad
  dashCooldown: number; // Tiempo de recarga del Cyber-Dash (en segundos)
  maxRowReached: number; // Fila mínima (más alta en pantalla) para puntuar avances
  attachedToPlatformId: string | null; // ID de plataforma sobre la que viaja
}

export type HazardType =
  | "PACKET_FAST"
  | "TROJAN_TRUCK"
  | "DDOS_CLUSTER"
  | "FIREWALL_LASER"
  | "GLITCH_RUNNER";

export interface HighwayHazardEntity {
  id: string;
  row: number; // Fila fija en autopista (8 a 12)
  x: number; // Posición continua X
  y: number; // Posición fija Y
  width: number; // Ancho en píxeles
  height: number; // Alto en píxeles
  vx: number; // Velocidad horizontal en px/s (positiva o negativa)
  type: HazardType;
  laserActiveTimer?: number; // Para FIREWALL_LASER: ciclo de encendido/apagado
  laserIsOn?: boolean;
}

export type PlatformType = "RAM_BLOCK" | "DATA_BUS" | "HEAT_SINK";

export interface FloatingPlatformEntity {
  id: string;
  row: number; // Fila fija en refrigerante (2 a 6)
  x: number; // Posición continua X
  y: number; // Posición fija Y
  width: number; // Ancho en píxeles (80 a 160 px)
  height: number; // Alto (36 px)
  vx: number; // Velocidad horizontal en px/s
  type: PlatformType;
  submerged?: boolean; // Para HEAT_SINK: si está sumergido/sobrecalentado
  submergeCycleTimer?: number; // Temporizador de ciclo sumergido
}

export interface MasterNodeEntity {
  id: number; // Índice del nodo (0 a 4)
  col: number; // Columna central de la bahía (2, 6, 10, 14, 18)
  x: number; // Coordenada X fija (80, 240, 400, 560, 720)
  y: number; // Coordenada Y fija (0)
  width: number; // Ancho de bahía de entrada (40 px)
  height: number; // Alto (40 px)
  penetrated: boolean; // Si ya fue infiltrado en el nivel actual
  hasBonusBug: boolean; // Si alberga un pulso bonus temporal
  bonusTimer: number; // Tiempo restante del bonus
}

export interface ParticleEntity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  decay: number;
}

export interface ActionGameState {
  frog: CyberFrogEntity;
  hazards: HighwayHazardEntity[];
  platforms: FloatingPlatformEntity[];
  nodes: MasterNodeEntity[];
  particles: ParticleEntity[];
  score: number;
  lives: number;
  level: number;
  roundTimer: number; // Segundos restantes en la vida actual (inicia en 45 s)
  gameOver: boolean;
  nodesPenetratedCount: number;
}
```

---

## Fórmulas de Física y Puntaje

### 1. Fórmulas de Cinemática y Dificultad por Nivel

- **Escalado de velocidad por nivel:**
  $$\text{speedMultiplier} = 1 + (\text{level} - 1) \times 0.12$$
- **Velocidades base por carril de autopista:**
  - Carril 12 ($y = 480\text{ px}$): $\text{vx} = -180\text{ px/s} \times \text{speedMultiplier}$ (Paquetes rápidos)
  - Carril 11 ($y = 440\text{ px}$): $\text{vx} = +90\text{ px/s} \times \text{speedMultiplier}$ (Camiones Troyanos de 120 px)
  - Carril 10 ($y = 400\text{ px}$): $\text{vx} = -120\text{ px/s} \times \text{speedMultiplier}$ (Láseres: ciclo $1.6\text{ s}$ apagado, $1.2\text{ s}$ activo)
  - Carril 9 ($y = 360\text{ px}$): $\text{vx} = +140\text{ px/s} \times \text{speedMultiplier}$ (Ráfagas DDoS)
  - Carril 8 ($y = 320\text{ px}$): $\text{vx} = -160\text{ px/s} \times \text{speedMultiplier}$ (Glitch runners)
- **Velocidades base por carril de refrigerante térmico:**
  - Carril 6 ($y = 240\text{ px}$): $\text{vx} = +100\text{ px/s} \times \text{speedMultiplier}$ (RAM Blocks de 120 px)
  - Carril 5 ($y = 200\text{ px}$): $\text{vx} = -130\text{ px/s} \times \text{speedMultiplier}$ (Data Buses de 160 px)
  - Carril 4 ($y = 160\text{ px}$): $\text{vx} = +80\text{ px/s} \times \text{speedMultiplier}$ (Heat Sinks: $3.0\text{ s}$ seguro, $1.5\text{ s}$ sobrecalentado)
  - Carril 3 ($y = 120\text{ px}$): $\text{vx} = -110\text{ px/s} \times \text{speedMultiplier}$ (RAM Blocks de 80 px)
  - Carril 2 ($y = 80\text{ px}$): $\text{vx} = +150\text{ px/s} \times \text{speedMultiplier}$ (Data Buses rápidos de 100 px)
- **Arrastre horizontal sobre plataformas:**
  Si el centro del dron está contenido dentro de los límites de una plataforma activa:
  $$x_{\text{frog}} = x_{\text{frog}} + \text{platform.vx} \times \Delta t$$
- **Regla de muerte por chasis:**
  Si $x_{\text{frog}} < 10$ o $x_{\text{frog}} > 790$ mientras viaja en una plataforma, el dron colisiona fatalmente con el chasis.

### 2. Tabla de Puntajes

| Evento                                    | Puntos Otorgados                  | Condiciones                                                              |
| :---------------------------------------- | :-------------------------------- | :----------------------------------------------------------------------- |
| Avance a fila superior                    | $+10\text{ pts}$                  | Se otorga solo la primera vez que se alcanza esa fila en la vida actual. |
| Infiltración de Nodo Maestro              | $+1000\text{ pts}$                | El nodo no estaba penetrado previamente en el nivel activo.              |
| Bonus de tiempo al penetrar               | $+20\text{ pts} / \text{segundo}$ | Segundos enteros restantes en el `roundTimer`.                           |
| Pulso Dorado Overclock                    | $+500\text{ pts}$                 | Recolectado en una bahía con bonus activo antes de expirar.              |
| Penetración de los 5 Nodos (Fin de Nivel) | $+3000\text{ pts}$                | Despeje completo del mapa. Incrementa nivel con `onLevelChange`.         |

---

## Plan de Implementación

1. **Creación del Módulo Base (`app/games/_games/cyber-frogger-action/`):**
   - Crear `config.ts` definiendo `CYBER_FROGGER_ACTION_SUMMARY`, `CYBER_FROGGER_ACTION_DETAILS`, iconos Material Symbols y controles recomendados.
2. **Implementación del Componente React/Canvas (`CyberFroggerActionGame.tsx`):**
   - Configurar canvas 800x600 px y ciclo de vida React 19 (`useRef`, `requestAnimationFrame`, `dt`).
   - Implementar renderizado de carriles, autopista corrupta, flujo térmico de plasma y nodos maestros.
   - Diseñar la cinemática de salto ortogonal de 40 px, cooldown de Cyber-Dash y arrastre horizontal de plataformas.
   - Programar el gestor de colisiones (AABB para obstáculos, detección de plataforma/refrigerante para saltos y bahías de nodos).
   - Integrar sistema de partículas neón (explosiones de muerte, estela de dash y chispas de infiltración).
   - Sincronizar callbacks con `CabinetGameProps` (`onScoreChange`, `onLivesChange`, `onLevelChange`, `onGameOver`).
3. **Exportación e Integración Modular:**
   - Crear `index.ts` exportando `cyberFroggerActionModule` cumpliendo el contrato `GameModule`.
   - Registrar el cartucho en `GAME_MODULES` de `app/games/_lib/registry.tsx`.
4. **Persistencia Híbrida y Leaderboard:**
   - Crear migración SQL incremental en `supabase/migrations/20261027150000_add_cyber_frogger_action_game.sql`.
   - Añadir puntuaciones semilla en `data/leaderboard.ts` para modo offline.
5. **Verificación y Pruebas de Calidad:**
   - Ejecutar `npm run lint` y verificar 0 errores.
   - Ejecutar `npm run build` confirmando generación estática limpia de las rutas.

---

## Criterios de Aceptación

- [ ] Archivo de especificación guardado en `specs/game-jam/cyber-frogger/01-cyber-frogger-action.md` y revisado en estado Borrador.
- [ ] El canvas opera exactamente a 800x600 px dentro de `CrtCabinet` con nitidez pixelada y proporción 4:3.
- [ ] Cero texto de HUD dibujado en el Canvas; el HUD React refleja puntuación, nivel y 3 vidas.
- [ ] El dron responde a las teclas `Flechas` y `WASD` con saltos de 40 px y animación de 120 ms.
- [ ] La tecla `Espacio` ejecuta el Cyber-Dash de 2 casillas con invulnerabilidad temporal y cooldown de 4 s.
- [ ] Los 5 carriles de la autopista generan tráfico continuo con colisión fatal precisa.
- [ ] En los carriles de refrigerante térmico, el dron hereda la velocidad de la plataforma en la que aterriza y muere si pisa el líquido vacío o disipadores sobrecalentados.
- [ ] Penetrar los 5 nodos maestros otorga el bono, incrementa el nivel (`onLevelChange`) y acelera los carriles.
- [ ] Agotar las 3 vidas o el tiempo de ciclo dispara `onGameOver` y despliega `GameRoomOverlay`.
- [ ] La señal `restartSignal` reinicia la partida limpiamente y la bandera `isPaused` congela el bucle físico.
- [ ] `npm run lint` y `npm run build` finalizan con código de salida 0.

---

## Decisiones Tomadas y Descartadas

- **Cuadrícula de 20 columnas x 15 filas (40x40 px por celda):**  
  _Decisión:_ Dividir 800x600 exactamente en celdas de 40x40 px.  
  _Justificación:_ Permite una correspondencia geométrica perfecta con la resolución nativa 800x600 de la cabina CRT, asegurando que 5 bahías de nodos queden perfectamente distribuidas en filas simétricas.
- **Mecánica de Cyber-Dash con cooldown:**  
  _Decisión:_ Tecla `Espacio` para un salto de 2 casillas con inmunidad de 200 ms y recarga de 4 s.  
  _Justificación:_ Aporta dinamismo moderno y profundidad táctica a la experiencia de acción clásica sin desvirtuar la tensión del esquive.
- **3 Vidas iniciales desacopladas:**  
  _Decisión:_ Notificar `onLivesChange(3)` al montar el componente.  
  _Justificación:_ Cumple con el estándar de Arcade Vault para juegos de acción continua y reflejos motrices.

---

## Riesgos Identificados y Mitigaciones

| Riesgo                                                        | Mitigación                                                                                                                                                                  |
| :------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Discontinuidad de arrastre en plataformas al cambiar de celda | Calcular la adherencia a la plataforma en cada tick mediante verificación de inclusión de punto central `(frog.visualX, frog.visualY)` en el bounding box de la plataforma. |
| Inconsistencia de colisión por salto rápido                   | Desactivar la detección de colisiones de refrigerante mientras `frog.isJumping === true`, evaluando la caída solo al asentarse el salto.                                    |
| Fuga de memoria por listeners en `window`                     | Limpieza estricta de `keydown`/`keyup` en el retorno de `useEffect` y cancelación de RAF.                                                                                   |
