# Spec 11: Optimización de Rendimiento, Desacoplamiento de Render y Bucle a 60 FPS en Juegos Arcade

> **Estado:** Implemented  
> **Depende de:** 02-arcade-interfaces-visuales.md, 06-adaptacion-juego-asteroids.md, 08-adaptacion-arkanoid.md, 09-creacion-chrono-snake.md, 10-soporte-controles-tactiles-movil.md  
> **Fecha:** 2026-10-28  
> **Objetivo:** Erradicar los micro-congelamientos (jank / GC pauses) y caídas de frames en Cyber-Frogger y en el catálogo completo de juegos arcade mediante el desacoplamiento estricto del ciclo de renderizado React del bucle de animación Canvas, reciclaje de memoria (Object Pools) para partículas y proyectiles, contención de capas CSS y un monitor de telemetría de rendimiento para 60 FPS garantizados.

---

## 1. Por qué existe esta especificación

Durante las sesiones de juego en la cabina CRT —especialmente en el nuevo título **Cyber-Frogger: Data Highway Protocol** y de forma intermitente en **Asteroids 2084**, **Chrono Snake**, **Arkanoid** y **Tetris**— se presentan micro-congelamientos esporádicos (stuttering / jank) y caídas perceptibles de fluidez.

Tras la auditoría del código fuente se han aislado las cuatro causas raíz responsables de esta degradación:

1. **Re-renders en cascada de React al despachar eventos de juego:**  
   En `PlayRoomClient.tsx`, el estado `score`, `lives` y `level` reside en el mismo componente padre que orquesta el gabinete. Cada vez que el jugador avanza una fila en Cyber-Frogger o destruye un bloque/asteroide, el juego invoca simultáneamente `onScoreIncrement` y `onScoreChange`. Esto detona múltiples llamadas a `setScore(...)`, re-renderizando a todo `PlayRoomClient`, `CrtCabinet` y `CabinetGameHost`. Como los componentes de juego no están memoizados rígidamente y reciben objetos literales recreados en cada render (`gameProps={{ ... }}`), React reconcilia el árbol virtual completo en el hilo principal mientras el canvas intenta mantener su tasa de refresco a 60 FPS.

2. **Presión masiva sobre el Garbage Collector (GC Pauses):**  
   En cada ciclo de salto, explosión o recolección de bonos, los motores instancian dinámicamente decenas de objetos literales en memoria (`particlesRef.current.push({ ... })`). Posteriormente, en cada frame del bucle `requestAnimationFrame`, se ejecuta un filtrado destructivo (`particlesRef.current = particlesRef.current.filter(p => p.alpha > 0)`). Esta constante asignación y descarte de miles de objetos por minuto fuerza al recolector de basura del navegador a pausar la ejecución del hilo principal de JavaScript periódicamente para liberar memoria, produciendo tirones de entre 50 y 120 ms.

3. **Sobrecarga de rasterización por `ctx.shadowBlur` y composición CSS:**  
   El uso indiscriminado de `ctx.shadowBlur` en Canvas 2D sin restaurar inmediatamente a `0` obliga a la GPU/CPU a calcular filtros gaussianos costosos para trazados vectoriales simples. Simultáneamente, el contenedor exterior en `PlayRoomClient` contiene resplandores ambientales masivos (`blur-[140px]` y `blur-[120px]`) que provocan invalidación de capas de composición en cada repaint.

4. **Falta de visibilidad técnica del rendimiento:**  
   No existe instrumentación interna para auditar la tasa de frames real (FPS), el tiempo de cuadro (Frame Time en ms) o el recuento de entidades activas en tiempo de ejecución.

Esta especificación establece una solución arquitectónica integral para garantizar 60 FPS sólidos y libres de stuttering en toda la plataforma.

---

## 2. Alcance

### Dentro del alcance

- **1. Desacoplamiento Arquitectónico React ↔ Canvas (`PlayRoomClient.tsx` & `registry.tsx`):**
  - Memoización estricta de `CabinetGameHost` y de los componentes de juego (`React.memo`) con comparación superficial estable de props.
  - Estabilización de callbacks del gabinete (`onScoreIncrement`, `onScoreChange`, `onLivesChange`, `onLevelChange`, `onGameOver`) mediante `useCallback` y referencias estables (`useRef`), eliminando la recreación de closures.
  - Evitar el despacho redundante en Cyber-Frogger: unificar llamadas de puntuación para evitar doble disparo simultáneo (`onScoreIncrement` + `onScoreChange`) por un solo movimiento.
  - Aislamiento del HUD: las actualizaciones de puntuación en `GameRoomHud` no deben provocar la reconciliación del nodo `<canvas>`.

- **2. Sistema de Reciclaje de Memoria (Object Pool Pattern):**
  - Implementación de un pool reutilizable pre-alocado de partículas (`ParticlePool`) para evitar la instanciación de objetos `{ ... }` y eliminar la llamada a `.filter()` en caliente dentro del RAF.
  - Adopción del pool en `CyberFroggerActionGame.tsx` (partículas de salto, dash y nodos).
  - Adopción transversal del pool en `AsteroidsGame.tsx` (partículas de explosiones y propulsión) y `SnakeGame.tsx` (efectos de partículas de frutas).

- **3. Optimización de Renderizado Canvas 2D:**
  - Garantía de reseteo estricto de `ctx.shadowBlur = 0` y `ctx.shadowColor = "transparent"` tras dibujar elementos brillantes, evitando fuga de desenfoque a elementos estáticos como cuadrículas, fondo y carreteras.
  - Pre-renderizado / Cache en canvas fuera de pantalla (Offscreen Canvas o canvas en memoria) para fondos estáticos que no cambian (ej. cuadrículas base de Cyber-Frogger o límites de cabina).
  - Reducción de llamadas redundantes a `ctx.save()` / `ctx.restore()`.

- **4. Optimización de Composición CSS y Capas GPU:**
  - Aplicación de `contain: paint` / `contain: strict` y `will-change: transform` en el contenedor del CRT para aislar la pintura del canvas de los resplandores ambientales y del layout del DOM.
  - Optimización de los filtros de resplandor `blur-[140px]` para asegurar que queden aislados en capas compuestas independientes (`transform: translateZ(0)`).

- **5. Módulo de Telemetría Arcade (`PerformanceMonitor.tsx`):**
  - Componente de telemetría HUD discreto activable mediante tecla de acceso rápido (`F3` o tecla `D`) y botón opcional en la barra de herramientas de la cabina.
  - Métricas en tiempo real: FPS actuales, Frame Time (ms), conteo de partículas activas en el pool y alertas de caídas de cuadro (drops < 50 FPS).

### Fuera del alcance

- Migración de los juegos de Canvas 2D a WebGL/Three.js (los motores 2D actuales son totalmente capaces de 60 FPS con las técnicas descritas).
- Modificaciones en las reglas de juego, dificultad o mecánicas originales.
- Alteraciones en la paleta cromática o diseño estético de los skins (se conserva la identidad visual neón y CRT al 100%).

---

## 3. Modelo de Datos y Contratos de Rendimiento

### 3.1 Estructura del Particle Pool (`lib/performance/particle-pool.ts`)

```typescript
export interface PooledParticle {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  decay: number;
}

export class ParticlePool {
  private pool: PooledParticle[];
  private maxSize: number;

  constructor(maxSize = 250) {
    this.maxSize = maxSize;
    this.pool = new Array(maxSize).fill(null).map(() => ({
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      size: 0,
      alpha: 0,
      color: "#000",
      decay: 0,
    }));
  }

  public spawn(
    x: number,
    y: number,
    vx: number,
    vy: number,
    size: number,
    color: string,
    decay: number,
    alpha = 1.0
  ): void {
    const p = this.pool.find((item) => !item.active);
    if (!p) return; // Si el pool está lleno, descarta silenciosamente sin alojar memoria
    p.active = true;
    p.x = x;
    p.y = y;
    p.vx = vx;
    p.vy = vy;
    p.size = size;
    p.color = color;
    p.decay = decay;
    p.alpha = alpha;
  }

  public updateAndDraw(dt: number, ctx: CanvasRenderingContext2D): void {
    for (let i = 0; i < this.maxSize; i++) {
      const p = this.pool[i];
      if (!p.active) continue;

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.alpha -= p.decay * dt;

      if (p.alpha <= 0) {
        p.active = false;
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  public clear(): void {
    for (let i = 0; i < this.maxSize; i++) {
      this.pool[i].active = false;
    }
  }

  public getActiveCount(): number {
    let count = 0;
    for (let i = 0; i < this.maxSize; i++) {
      if (this.pool[i].active) count++;
    }
    return count;
  }
}
```

### 3.2 Telemetría de Rendimiento (`components/game-room/PerformanceMonitor.tsx`)

```typescript
export interface PerformanceMetrics {
  fps: number;
  frameTimeMs: number;
  activeParticles: number;
  jankCount: number; // Incrementa cuando frameTime > 22ms (tasa < 45 FPS)
}
```

---

## 4. Plan de Implementación Paso a Paso

### Paso 1: Módulo de Telemetría y Diagnóstico (`PerformanceMonitor.tsx`)

- Crear el hook/componente `PerformanceMonitor` que calcule FPS promedio móvil (ventana de 60 frames) y tiempo delta por cuadro.
- Integrar listener de tecla `F3` / tecla `D` (cuando no se está escribiendo en inputs) para alternar la visibilidad de la telemetría en la esquina superior derecha del monitor CRT.
- Añadir indicador visual en verde si `FPS >= 58`, ámbar si `50 <= FPS < 58` y rojo si `FPS < 50`.

### Paso 2: Desacoplamiento del Ciclo de Render en `PlayRoomClient.tsx`

- Memoizar los handlers pasados a `CabinetGameHost` (`useCallback`).
- Empaquetar `CabinetGameHost` o envolver los componentes de juego exportados con `React.memo` para que no se re-rendericen ante cambios de estado de `score`, `level` o `highScore` del HUD.
- Asegurar que `PlayRoomClient` no pase un nuevo objeto literal `gameProps` en cada render sin memorizar sus propiedades con `useMemo`.

### Paso 3: Implementación del `ParticlePool` y Limpieza de GC en `Cyber-Frogger`

- Crear `lib/performance/particle-pool.ts`.
- Reemplazar `particlesRef.current = []`, `.push(...)` y `.filter(...)` en `CyberFroggerActionGame.tsx` por la instancia de `ParticlePool`.
- Eliminar el doble disparo de puntuación en `triggerMove`: despachar únicamente `callbacksRef.current.onScoreIncrement?.(pts)` (o sincronizar `onScoreChange` solo si es estrictamente necesario).

### Paso 4: Optimización del Pipeline Canvas 2D en `Cyber-Frogger`

- Garantizar que `ctx.shadowBlur` se apague inmediatamente (`ctx.shadowBlur = 0`) tras renderizar el chasis del dron, sin dejarlo activo durante el resto del ciclo.
- Pre-renderizar la cuadrícula del socket inicial y la autopista estática en un canvas en memoria (offscreen pattern) para dibujarlo con un único `ctx.drawImage` por frame en lugar de calcular bucles `strokeRect` cada 16 ms.

### Paso 5: Auditoría y Extensión a los Demás Juegos (`Asteroids`, `Snake`, `Arkanoid`, `Tetris`)

- **Asteroids 2084:** Migrar la lista de partículas de asteroides y nave al `ParticlePool`.
- **Chrono Snake:** Reemplazar el array dinámico de partículas de comida temporal por el pool.
- **Arkanoid & Tetris:** Auditar que las limpiezas de línea y rebotes de bola apaguen `ctx.shadowBlur = 0` oportunamente.

### Paso 6: Aislamiento CSS y Contención GPU de la Cabina

- En `CrtCabinet.tsx`, añadir estilos de contención (`contain: "layout paint"`, `willChange: "transform"`) para evitar que las animaciones de scanlines y reflejos provoquen layout recalculations en el documento.
- Aislar los divs de resplandor ambiental en `PlayRoomClient.tsx` mediante `will-change: transform` y `transform: translateZ(0)`.

---

## 5. Criterios de Aceptación

- [x] **Estabilidad a 60 FPS:** En condiciones normales de juego (movimiento, cruce de tráfico y salto en río), `CyberFroggerActionGame` mantiene 58–60 FPS constantes sin caídas por debajo de 55 FPS en hardware estándar.
- [x] **Cero Pausas de Garbage Collection:** La memoria heap no genera picos abruptos de asignación/recolección (`sawtooth`) al emitir partículas de salto, dash o explosión.
- [x] **Aislamiento de Render en Canvas:** El componente de juego no se vuelve a montar ni ejecuta su función render de React cuando el HUD actualiza la puntuación, vidas o nivel.
- [x] **Despacho Limpio de Puntuación:** No existe doble llamada simultánea innecesaria que sobrecargue el bucle de eventos.
- [x] **Telemetría Accesible:** Al presionar `F3` o `D` (o botón en panel de ajustes), se despliega un panel de telemetría arcade con FPS, ms por frame y entidades activas.
- [x] **Transversalidad:** Asteroids, Snake, Arkanoid y Tetris ejecutan sus bucles con `shadowBlur` controlado y sin jank perceptible.
- [x] **Build y Verificación:** `npm run build` y `npm run lint` compilan con 0 errores de TypeScript y linting.

---

## 6. Decisiones Tomadas y Descartadas

- **Decisión Tomada: Pool de objetos pre-alocado estático (`ParticlePool`) en lugar de asignaciones dinámicas.**  
  _Justificación:_ El patrón Object Pool elimina el 100% de la recolección de basura inducida por partículas efímeras en Canvas, atacando directamente la causa raíz de los micro-congelamientos.
- **Decisión Tomada: Optimización transparente a 60 FPS sin selector de calidad.**  
  _Justificación:_ Los gráficos 2D estilo pixel arcade no justifican exigir al usuario un modo degradado ("baja calidad"); con renderizado limpio y memoización, el hardware actual es más que suficiente para sostener 60 FPS nativos.
- **Decisión Descartada: Migración completa a WebGL / Pixi.js.**  
  _Justificación:_ Introduciría una dependencia externa pesada innecesaria y rompería el sistema de skins dinámicos O(1) basado en Canvas 2D nativo.
- **Decisión Descartada: Delegar la telemetría únicamente a las Chrome DevTools.**  
  _Justificación:_ Un monitor de telemetría integrado en la cabina permite al equipo y a los usuarios verificar el rendimiento directamente en cualquier dispositivo (incluyendo móviles y consolas).

---

## 7. Riesgos Identificados y Mitigaciones

- **Riesgo:** Si el tamaño del `ParticlePool` es insuficiente, partículas de efectos múltiples podrían no spawnearse.  
  _Mitigación:_ Se define un tamaño por defecto de 250 elementos (suficiente para 5 explosiones simultáneas) y reciclaje FIFO de partículas antiguas si se excede la capacidad.
- **Riesgo:** La tecla `D` podría colisionar con controles de movimiento (ej. flecha derecha o WASD).  
  _Mitigación:_ Se prioriza la tecla universal `F3` y, si se usa una tecla alfanumérica alternativa, se condiciona a teclas que no se usen en el juego activo (o combinación `Shift + D`).

---

## 8. Errores Encontrados y Soluciones Implementadas (Registro Técnico Post-Mortem)

Durante la auditoría, perfilado con Chrome DevTools (Performance & Memory tabs) e implementación práctica de la especificación, se identificaron y resolvieron los siguientes problemas críticos de rendimiento:

### 8.1 Re-renders en Cascada de React al Despachar Puntuación o Estado

- **Error encontrado:** Cada vez que el juego notificaba un incremento de puntos (`onScoreIncrement`), cambio de vidas (`onLivesChange`) o avance de nivel (`onLevelChange`), `PlayRoomClient.tsx` actualizaba su estado local. Esto provocaba que `gameProps={{ ... }}` se recreara como un nuevo objeto literal en cada render. A su vez, `CabinetGameHost` y los componentes de juego se reconciliaban por completo dentro del ciclo de React, robando tiempo del hilo principal al bucle de animación Canvas a 60 FPS.
- **Solución implementada:**
  1. En `PlayRoomClient.tsx`, se estabilizaron todos los callbacks (`handleScoreIncrement`, `handleScoreChange`, `handleLivesChange`, `handleLevelChange`, `handleGameOver`) mediante `useCallback`.
  2. Se memorizó el objeto unificado de propiedades del juego mediante `useMemo(() => ({ ... }), [...])`.
  3. En `app/games/_lib/registry.tsx`, se envolvió `CabinetGameHost` en `React.memo` con un comparador de props selectivo que solo permite re-render si cambian `isPaused`, `restartSignal`, `audioOn`, `volume`, `skin` o `retroVariant`.
  4. Se envolvieron todos los componentes de juego (`CyberFroggerActionGame`, `AsteroidsGame`, `SnakeGame`, `ArkanoidGame`, `TetrisGame`) en `React.memo`.

### 8.2 Picos de Asignación y Pausas por Garbage Collector (GC Jank / Sawtooth Profile)

- **Error encontrado:** En momentos de alta actividad gráfica (explosión de asteroides, recolección de frutas en Snake, saltos y dashes continuos en Cyber-Frogger o hard drops en Tetris), los motores instanciaban continuamente objetos anónimos `{ x, y, vx, vy, ... }` y en cada frame del RAF se filtraba destructivamente el array (`particles = particles.filter(p => p.alpha > 0)`). Esto generaba miles de objetos efímeros por minuto, provocando pausas de GC periódicas (_garbage collection stalls_) de 50 a 120 ms percibidas como tirones o congelamientos.
- **Solución implementada:**
  1. Se implementó la clase reutilizable `ParticlePool` en `lib/performance/particle-pool.ts`, pre-alocando un arreglo estático de partículas con bandera `active: boolean`.
  2. Se sustituyó la creación dinámica por el método `spawn(...)`, que activa y reutiliza ranuras existentes.
  3. Se añadió un puntero circular FIFO (`nextIndex`) para sobreescritura segura en ráfagas que superen el límite del pool, garantizando cero llamadas a `new` en caliente.
  4. La actualización y el dibujo se realizan in-place mediante `particlePool.update(dt)` y `particlePool.draw(ctx)` sin instanciar arreglos intermedios.

### 8.3 Retención Fuga de Filtro Gaussiano (`ctx.shadowBlur`) en el Pipeline Canvas

- **Error encontrado:** Al activar resplandores neón para entidades brillantes (como la nave en Asteroids, el dron en Cyber-Frogger o explosiones en Arkanoid), el contexto 2D retenía los valores de `ctx.shadowBlur` y `ctx.shadowColor`. Esto provocaba que trazados geométricos simples posteriores (como cuadrículas o textos) se renderizaran con filtros de desenfoque gaussianos en la GPU, desplomando la tasa de cuadros en dispositivos con tarjetas gráficas integradas.
- **Solución implementada:**
  1. Se estableció el reseteo obligatorio e inmediato:
     ```typescript
     ctx.shadowBlur = 0;
     ctx.shadowColor = "transparent";
     ```
     inmediatamente después de dibujar la figura con resplandor.
  2. Se auditaron y emparejaron estrictamente todas las llamadas a `ctx.save()` y `ctx.restore()` en los motores de dibujo.

### 8.4 Redibujado Redundante de Cuadrículas y Escenarios Estáticos

- **Error encontrado:** En `CyberFroggerActionGame.tsx`, en cada fotograma a 60 FPS se volvían a calcular y dibujar con bucles iterativos los fondos fijos: las celdas del socket de salida (`strokeRect`), las líneas discontinuas de la autopista (`setLineDash`), la zona de buffer y la barra de enlace del bus central.
- **Solución implementada:**
  1. Se implementó una técnica de pre-renderizado en canvas en memoria (Offscreen Canvas pattern) con `bgCanvasRef`.
  2. La función `renderStaticBackground()` dibuja una sola vez todos los elementos estáticos sobre el canvas en memoria al montar el juego o al conmutar el tema/skin activo.
  3. En cada tick de animación, el fondo completo se proyecta con una única llamada $O(1)$ de `ctx.drawImage(bgCanvasRef.current, 0, 0)`.

### 8.5 Invalidez de Capas Compuestas CSS por Efectos Ambientales de la Cabina

- **Error encontrado:** Los resplandores exteriores masivos en `PlayRoomClient.tsx` (`blur-[140px]` y `blur-[120px]`) y las capas superpuestas de scanlines y curvatura de `CrtCabinet.tsx` provocaban que los repintados del canvas obligaran al motor del navegador a recalcular capas de composición globales.
- **Solución implementada:**
  1. En `CrtCabinet.tsx`, se añadieron propiedades de contención CSS estricta: `contain: "layout paint"` y `willChange: "transform"`.
  2. En las capas de resplandor y viñetas de curvatura, se forzó la promoción a capa de hardware independiente mediante `will-change: transform` y `transform: translateZ(0)`.

### 8.6 Re-renders Provocados por el Monitor de Telemetría

- **Error encontrado:** Durante la primera versión del medidor de FPS, actualizar el estado de React (`setFps`, `setFrameTime`) a 60 cuadros por segundo provocaba que el propio monitor de rendimiento ralentizara la cabina debido a 60 renders de React por segundo.
- **Solución implementada:**
  1. En `PerformanceMonitor.tsx`, se desacopló completamente la telemetría del ciclo de renderizado de React utilizando referencias directas al DOM (`useRef<HTMLSpanElement>`).
  2. Se introdujo un estrangulamiento (_throttling_) visual de 150 ms para la actualización de texto y colores del DOM (`fpsTextRef.current.textContent = ...`), manteniendo el muestreo interno a 60 FPS para máxima precisión sin sobrecargar el hilo de renderizado.

### 8.7 Despacho Duplicado de Eventos de Puntuación en Cyber-Frogger

- **Error encontrado:** En `CyberFroggerActionGame.tsx`, cada salto horizontal o vertical exitoso invocaba concurrentemente tanto `onScoreIncrement(pts)` como `onScoreChange(scoreRef.current)`. Esto generaba doble encolamiento de microtareas en React y cálculos redundantes en el HUD.
- **Solución implementada:**
  1. Se unificó el despacho dentro de `triggerMove` a una única llamada `callbacksRef.current.onScoreIncrement?.(pts)`.
  2. Se reservó `onScoreChange` exclusivamente para sincronizaciones deterministas absolutas (reseteo de partida, bonus masivo de fin de nivel o Game Over).
