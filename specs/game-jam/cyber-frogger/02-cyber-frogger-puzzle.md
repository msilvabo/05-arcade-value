# Spec GJ-02: Creación del Juego Cyber-Frogger: Logic Core Protocol (Puzzle / Lógica) en Cabina CRT

**Estado:** Borrador  
**Fecha:** 2026-10-27  
**Tema del Jam:** "Cyber-Frogger"  
**Depende de:** 06-adaptacion-juego-asteroids.md, 07-leaderboard-y-tabla-de-juegos.md

---

## Objetivo

Diseñar e implementar el juego arcade **Cyber-Frogger: Logic Core Protocol** bajo el tema "Cyber-Frogger" como un componente React/Canvas 4:3 (800x600 px) para la cabina CRT de Arcade Vault (`/games/cyber-frogger-puzzle/play`), desacoplando completamente el HUD mediante `CabinetGameProps`, con 1 vida fija arcade, mecánica de pasos por Ciclos de Reloj (Clock Cycle Ticks), conmutación de polaridad de bits (Flip Bit) y persistencia híbrida en Supabase y modo offline.

---

## Giro Temático del Jam: "Cyber-Frogger"

En **Cyber-Frogger: Logic Core Protocol**, el movimiento no depende de reflejos mecánicos continuos, sino de la resolución lógica de circuitos y la sincronización estratégica de ciclos de ejecución de la CPU. El jugador controla al dron `Cyber-Frog` como un depurador cuántico que debe atravesar una matriz de registros lógicos y bus de memoria para reconfigurar los 5 Nodos Maestros del procesador.

El giro temático se fundamenta en la arquitectura computacional por ciclos y polaridades:

1. **Motor por Pasos (Execution Cycle Ticks):** Cada movimiento ortogonal del dron ejecuta exactamente 1 ciclo de reloj (`Clock Tick`). Con cada ciclo, todas las entidades del circuito (paquetes y registros de memoria) avanzan exactamente 1 casilla en su orientación vectorial.
2. **Dual-State Logic (Mecánica Flip Bit):** El dron opera en dos estados de polaridad cuántica: `POLARITY_CYAN (Bit 0)` o `POLARITY_MAGENTA (Bit 1)`. La tecla `Espacio` ejecuta la orden **Flip Bit**, alternando la polaridad sin moverse pero consumiendo 1 ciclo de reloj.
3. **Absorción de Paquetes vs Cortocircuito Lógico:**
   - En la matriz de autopista, los paquetes de datos transportan una carga de polaridad. Si el dron salta sobre un paquete de su **misma polaridad**, lo absorbe (+150 pts) y recarga su buffer temporal.
   - Si colisiona con un paquete de **polaridad opuesta**, ocurre un cortocircuito fatal inmediato (`Game Over`).
4. **Compuertas Lógicas en Bloques de Memoria RAM:**
   - La corriente de sobrecarga contiene bloques de RAM que funcionan como compuertas lógicas (AND, OR, XOR, NOT).
   - Para poder posarse sobre un bloque RAM, la polaridad actual del dron debe satisfacer la condición de la compuerta respecto a la señal del carril. Si no la satisface, el bloque rechaza la conexión y el dron colapsa en el sumidero de datos.
5. **Degradación por Garbage Collection:**
   - Permanecer inmóvil o en el mismo bloque de memoria más de 2 ciclos activa la purga de memoria (Garbage Collection), desintegrando el bloque y forzando al jugador a planificar rutas continuas.
6. **Penetración Criptográfica de los 5 Nodos Maestros:**
   - Cada uno de los 5 Nodos Maestros exige una polaridad y paridad específica visible en su display hexadecimal (`[N0: CYAN]`, `[N1: MAGENTA]`, etc.). Llegar al nodo con la polaridad errónea activa el firewall maestro y termina la partida.

---

## Alcance

### Dentro del alcance

- **1. Componente React/Canvas (`CyberFroggerPuzzleGame.tsx`):**
  - **Sistema de Coordenadas y Tablero Lógico:**
    - Canvas lógico fijo de 800x600 px (relación de aspecto 4:3) renderizado dentro de `CrtCabinet` con `image-rendering: pixelated`.
    - Tablero lógico discreto de 20 columnas x 15 filas con celdas de 40x40 px (`GRID_COLS = 20`, `GRID_ROWS = 15`, `CELL_SIZE = 40`).
    - Estructura de filas:
      - **Fila 0:** 5 Nodos Maestros con requisitos de polaridad específicos.
      - **Fila 1:** Bus de Enlace Cuántico (Receptores de bus).
      - **Filas 2 a 6:** Sumidero de Datos con Bloques RAM y Compuertas Lógicas (AND/OR/XOR/NOT).
      - **Fila 7:** Registro de Enlace Central (Buffer de alineación seguro).
      - **Filas 8 a 12:** Autopista de Paquetes Polarizados (Cyan y Magenta) y Filtros de Paridad.
      - **Filas 13 a 14:** Registro de Inyección (Zona de inicio del depurador).
  - **Físicas y Cinemática por Pasos de Reloj:**
    - Movimiento estrictamente discreto celda a celda. Cada pulsación de `Flechas` o `WASD` desencadena un ciclo de avance de 1 tick.
    - Tecla `Espacio`: Ejecuta **Flip Bit** (invierte polaridad de `CYAN` a `MAGENTA` o viceversa, consumiendo 1 tick del sistema sin desplazar al dron).
    - Presión temporal: **Buffer Overflow Bar** (temporizador de colapso continuo de 20 segundos que se recarga con cada absorción de paquete válida y cada avance exitoso hacia adelante).
  - **Sistema de Colisiones y Reglas de Derrota (1 Vida Fija):**
    - 1 sola vida arcade (`onLivesChange(1)`).
    - Colisiones letales inmediatas:
      - Colisión o salto hacia un paquete de polaridad contraria.
      - Salto sobre sumidero de datos vacío (sin bloque RAM debajo).
      - Pisar un bloque RAM cuya compuerta lógica evalúe en falso (`FALSE`).
      - Pisar un bloque desintegrado por Garbage Collection (permanencia de > 2 ciclos en la misma celda).
      - Aterrizar en un Nodo Maestro con polaridad contraria a la clave del nodo.
      - Agotamiento del temporizador de desbordamiento de buffer.
    - Cualquier colisión letal dispara animación de desintegración cuántica (partículas de código binario) y llamada inmediata a `onGameOver(finalScore)`.
  - **Progresión de Niveles y Complejidad de Circuitos:**
    - Nivel inicial: 1.
    - Al penetrar con éxito los 5 Nodos Maestros con sus polaridades correctas, se otorga bono de resolución (+4000 pts), se incrementa el nivel (`onLevelChange(level + 1)`), se restablecen los 5 nodos con nuevas claves criptográficas y se acelera el decaimiento del Buffer Overflow un 10%.
    - En niveles superiores (Nivel 2+), se introducen paquetes conmutadores de paridad (XOR) que invierten su polaridad automáticamente cada 3 ciclos.
  - **Estética Neón Cyber Arcade:**
    - Dron `Cyber-Frog`: Glifo cibernético brillante que alterna entre Cyan puro (`#00f0ff`) y Magenta vibrante (`#ff0055`) según su bit activo, con resplandor neón intenso (`ctx.shadowBlur = 14`).
    - Tablero: Estructura de placa de circuito impreso (PCB) con pistas grabadas en verde fósforo oscuro (`#051a0d`).
    - Bloques de memoria: Circuitos con compuertas lógicas grabadas que brillan según compatibilidad de estado.
    - Barra de Buffer Overflow: Indicador estético en el marco inferior de la matriz que pasa de verde neón a ámbar y rojo pulsante al decaer.
  - **Gestión de Ciclo de Vida y Memoria en React 19:**
    - Render loop con `requestAnimationFrame` que procesa transiciones visuales suaves e interpolación de partículas.
    - Suscripción y desuscripción estricta de listeners de teclado en `window`.
    - Congelamiento físico si `isPaused === true`.
    - Reinicio limpio ante `restartSignal`.

- **2. Desacoplamiento Total del HUD (`CabinetGameProps`):**
  - Cero texto de HUD en el Canvas (sin puntuación, vidas, nivel ni textos flotantes).
  - Vidas fijas: 1 vida (`onLivesChange(1)`).
  - Puntuación:
    - Salto hacia adelante válido: +20 pts.
    - Absorción de paquete de misma polaridad: +150 pts.
    - Evaluación exitosa de compuerta lógica RAM: +250 pts.
    - Infiltración exitosa de Nodo Maestro: +1500 pts.
    - Despeje de los 5 Nodos Maestros (Nivel completo): +4000 pts.
  - Callbacks `onScoreIncrement`, `onScoreChange`, `onLivesChange`, `onLevelChange`, `onGameOver`.

- **3. Módulo de Juego y Registro Modular (`app/games/_games/cyber-frogger-puzzle/`):**
  - Archivos modulares:
    - `config.ts`: Metadatos de catálogo (`CYBER_FROGGER_PUZZLE_SUMMARY`), detalles extendidos (`CYBER_FROGGER_PUZZLE_DETAILS`), icono Material Symbols (`memory` o `terminal`), controles (`[Flechas] / [WASD] + [Espacio: Flip Bit]`).
    - `CyberFroggerPuzzleGame.tsx`: Componente interactivo React/Canvas compatible con `CabinetGameProps`.
    - `index.ts`: Exportación del módulo cumpliendo el contrato `GameModule`.
  - Registro en `GAME_MODULES` de `app/games/_lib/registry.tsx`.

- **4. Persistencia Híbrida y Récords (Supabase + Fallback Offline):**
  - Migración SQL en `supabase/migrations/20261027151000_add_cyber_frogger_puzzle_game.sql`.
  - Inserción en `public.games` y récords semilla en `public.scores`.
  - 5 récords de muestra en `data/leaderboard.ts` para modo offline.

- **5. Verificación de Calidad y Rendimiento:**
  - TypeScript en modo estricto (`strict: true`), sin uso de `any`.
  - Ejecución de `npm run lint` y `npm run build` con código de salida 0.

### Fuera del alcance

- Efectos de sonido o sintetizadores Web Audio (silencioso por diseño base).
- Soporte para entrada táctil o mandos arcade físicos externos.
- Modos cooperativos en red o resolución multijugador simultánea.

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

### 2. Estructuras y Entidades del Motor (`CyberFroggerPuzzleGame.tsx`)

```typescript
export type BitPolarity = "CYAN" | "MAGENTA";

export interface LogicFrogEntity {
  col: number; // Columna en la cuadrícula (0 a 19)
  row: number; // Fila en la cuadrícula (0 a 14)
  visualX: number; // Coordenada gráfica interpolada
  visualY: number; // Coordenada gráfica interpolada
  polarity: BitPolarity; // Estado actual del bit
  cyclesStationary: number; // Ciclos en la misma celda (Garbage Collection a > 2)
  isTransitioning: boolean; // Animación de paso en progreso
}

export interface LogicPacketEntity {
  id: string;
  col: number; // Columna discreta en la cuadrícula
  row: number; // Fila en la autopista (8 a 12)
  polarity: BitPolarity; // Polaridad que debe coincidir con el dron
  dir: 1 | -1; // Dirección de avance por ciclo (1: derecha, -1: izquierda)
  isXorMutable?: boolean; // Si conmuta de polaridad periódicamente
  xorCycleCount?: number;
}

export type LogicGateType = "AND" | "OR" | "XOR" | "NOT";

export interface LogicRamBlockEntity {
  id: string;
  col: number; // Columna de inicio
  row: number; // Fila en el sumidero (2 a 6)
  length: number; // Longitud en celdas (2 a 4 celdas)
  dir: 1 | -1; // Dirección de desplazamiento por ciclo
  gateType: LogicGateType; // Tipo de compuerta para validación de paso
  requiredPolarity: BitPolarity; // Entrada requerida para compuertas AND/OR
  isPurged: boolean; // Si fue eliminada por Garbage Collection
}

export interface MasterPuzzleNodeEntity {
  id: number; // Índice del nodo (0 a 4)
  col: number; // Columna del nodo (2, 6, 10, 14, 18)
  row: number; // Fila (0)
  targetPolarity: BitPolarity; // Polaridad requerida para penetrar con éxito
  penetrated: boolean; // Si ya fue completado
  hexCode: string; // Código decorativo visual ("0x0F", "0xAA", "0xFF")
}

export interface BinaryParticleEntity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  text: "0" | "1";
  alpha: number;
  color: string;
  decay: number;
}

export interface PuzzleGameState {
  frog: LogicFrogEntity;
  packets: LogicPacketEntity[];
  ramBlocks: LogicRamBlockEntity[];
  nodes: MasterPuzzleNodeEntity[];
  particles: BinaryParticleEntity[];
  score: number;
  lives: number; // Siempre 1
  level: number;
  bufferOverflowTimer: number; // Segundos restantes de buffer (max 20 s)
  totalCyclesExecuted: number; // Contador de turnos ejecutados
  gameOver: boolean;
  nodesResolvedCount: number;
}
```

---

## Fórmulas de Física y Puntaje

### 1. Mecánica de Avance por Ciclos de Ejecución (Execution Cycle Tick)

Cada vez que el jugador introduce una tecla (`ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight` o `Space` para Flip Bit):

1. **Consumo de Tick:** $\text{totalCyclesExecuted} = \text{totalCyclesExecuted} + 1$.
2. **Desplazamiento del Dron:**
   - Si fue `Space`: $\text{frog.polarity} = \text{frog.polarity} === \text{"CYAN"} \;?\;\text{"MAGENTA"} : \text{"CYAN"}$.
   - Si fue tecla direccional: actualización de $(\text{frog.col}, \text{frog.row})$.
3. **Avance Vectorial de Entidades:**
   - Para cada paquete en autopista:
     $$\text{col}_{\text{packet}} = (\text{col}_{\text{packet}} + \text{dir} + 20) \pmod{20}$$
   - Para cada bloque de memoria RAM:
     $$\text{col}_{\text{ram}} = (\text{col}_{\text{ram}} + \text{dir} + 20) \pmod{20}$$
4. **Verificación de Compuerta Lógica:**
   Al posarse sobre una celda $(c, r)$ ocupada por un bloque RAM con compuerta:
   - `AND`: Requiere que $\text{frog.polarity} === \text{ram.requiredPolarity}$ Y que el carril sea par.
   - `OR`: Válido si $\text{frog.polarity} === \text{ram.requiredPolarity}$ O si el carril es impar.
   - `XOR`: Válido únicamente si $\text{frog.polarity} \neq \text{ram.requiredPolarity}$.
   - `NOT`: Invierte automáticamente la polaridad del dron tras cruzarlo con éxito.
     Si la evaluación de la compuerta es `FALSE`, se produce cortocircuito lógico inmediato (`GameOver`).
5. **Drenaje del Buffer Overflow Timer:**
   - Decae continuamente con delta time: $\text{bufferTimer} = \text{bufferTimer} - \Delta t \times (1 + (\text{level} - 1) \times 0.10)$.
   - Cada absorción de paquete válida añade $+3.0\text{ s}$ al temporizador (tope de $20.0\text{ s}$).

### 2. Tabla de Puntajes

| Acción de Lógica                                    | Puntos Otorgados   | Justificación                                                 |
| :-------------------------------------------------- | :----------------- | :------------------------------------------------------------ |
| Avance ortogonal hacia adelante                     | $+20\text{ pts}$   | Progreso hacia el núcleo.                                     |
| Absorción de paquete de misma polaridad             | $+150\text{ pts}$  | Paridad de datos correcta; recarga buffer en $+3.0\text{ s}$. |
| Validación de compuerta lógica RAM                  | $+250\text{ pts}$  | Tránsito exitoso por bloque condicional.                      |
| Penetración de Nodo Maestro con polaridad requerida | $+1500\text{ pts}$ | Cumplimiento del hash criptográfico del nodo.                 |
| Completar los 5 Nodos Maestros (Fin de Circuito)    | $+4000\text{ pts}$ | Despeje completo del circuito. Dispara `onLevelChange`.       |

---

## Plan de Implementación

1. **Creación del Módulo Base (`app/games/_games/cyber-frogger-puzzle/`):**
   - Crear `config.ts` definiendo `CYBER_FROGGER_PUZZLE_SUMMARY`, `CYBER_FROGGER_PUZZLE_DETAILS`, controles e icono de terminal.
2. **Implementación del Componente React/Canvas (`CyberFroggerPuzzleGame.tsx`):**
   - Configurar canvas 800x600 px y ciclo de vida React 19 (`useRef`, `requestAnimationFrame`).
   - Implementar el motor de turnos por pasos de reloj (Execution Cycles) y la cola de entradas.
   - Programar la mecánica Flip Bit (`Space`) y la conmutación visual instantánea de polaridades (Cyan / Magenta).
   - Desarrollar la lógica de evaluación de compuertas (AND, OR, XOR, NOT) y absorción de paquetes.
   - Implementar el sistema de partículas binarias ("0" y "1") y la barra de Buffer Overflow.
   - Sincronizar callbacks con `CabinetGameProps` (`onScoreChange`, `onLivesChange(1)`, `onLevelChange`, `onGameOver`).
3. **Exportación e Integración Modular:**
   - Crear `index.ts` exportando `cyberFroggerPuzzleModule` cumpliendo el contrato `GameModule`.
   - Registrar el cartucho en `GAME_MODULES` de `app/games/_lib/registry.tsx`.
4. **Persistencia Híbrida y Leaderboard:**
   - Crear migración SQL incremental en `supabase/migrations/20261027151000_add_cyber_frogger_puzzle_game.sql`.
   - Añadir puntuaciones semilla en `data/leaderboard.ts` para modo offline.
5. **Verificación y Pruebas de Calidad:**
   - Ejecutar `npm run lint` y verificar 0 errores.
   - Ejecutar `npm run build` confirmando compilación estática limpia.

---

## Criterios de Aceptación

- [ ] Archivo de especificación guardado en `specs/game-jam/cyber-frogger/02-cyber-frogger-puzzle.md` y revisado en estado Borrador.
- [ ] El canvas opera exactamente a 800x600 px dentro de `CrtCabinet` con nitidez pixelada y proporción 4:3.
- [ ] Cero texto de HUD dibujado en el Canvas; el HUD React refleja puntuación, nivel y 1 vida fija.
- [ ] Cada pulsación direccional avanza el dron exactamente 1 celda y desplaza las entidades del circuito 1 paso de reloj.
- [ ] La tecla `Espacio` conmuta la polaridad del dron (Cyan / Magenta) sin alterar su posición.
- [ ] Colisionar con un paquete de polaridad opuesta produce Game Over inmediato; absorber uno de la misma polaridad otorga puntos y recarga el buffer.
- [ ] Los bloques RAM con compuertas lógicas evalúan correctamente la compatibilidad del dron.
- [ ] Penetrar los 5 nodos con la polaridad correcta avanza de nivel (`onLevelChange`) y otorga el bono.
- [ ] Agotar el temporizador de Buffer Overflow produce Game Over inmediato.
- [ ] La pausa (`isPaused`) y reinicio (`restartSignal`) responden de forma inmediata y limpia.
- [ ] `npm run lint` y `npm run build` finalizan con código de salida 0.

---

## Decisiones Tomadas y Descartadas

- **1 Vida fija arcade (`onLivesChange(1)`):**  
  _Decisión:_ Cero margen de error motriz; 1 sola vida como estándar para el género puzzle de Arcade Vault.  
  _Justificación:_ Resalta el pensamiento analítico riguroso y la toma de decisiones metódica bajo la presión del Buffer Overflow.
- **Motor por pasos de reloj (Execution Cycle Ticks) frente a física continua:**  
  _Decisión:_ Las entidades avanzan por ticks al moverse el jugador o por decaimiento del buffer.  
  _Justificación:_ Ofrece una experiencia profundamente estratégica y contrastante con la propuesta de acción clásica.
- **Dual-State Polarity (Cyan vs Magenta):**  
  _Decisión:_ Mecánica central basada en la alternancia de bits de paridad con la tecla `Espacio`.  
  _Justificación:_ Integra de forma orgánica el tema cyberpunk de computación cuántica sin sobrecargar los controles arcade.

---

## Riesgos Identificados y Mitigaciones

| Riesgo                                                                | Mitigación                                                                                                                              |
| :-------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| Entradas de teclado ultra rápidas que desincronicen el ciclo de reloj | Bloquear entradas mientras la interpolación de movimiento de la celda actual esté activa (~80 ms) mediante un flag `isTransitioning`.   |
| Situaciones de bloqueo matemático imposible (Soft-lock)               | Garantizar algorítmicamente en la generación de carriles que siempre exista al menos un camino de polaridad válido hacia los nodos.     |
| Ambigüedad visual de las compuertas lógicas                           | Renderizar símbolos tipográficos claros (AND, OR, XOR) sobre los bloques RAM y utilizar bordes de resplandor neón según compatibilidad. |
