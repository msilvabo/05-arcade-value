# Spec 10: Soporte de Controles Táctiles y Experiencia Móvil en Cabina CRT

> **Estado:** Implemented  
> **Depende de:** 02-arcade-interfaces-visuales.md, 06-adaptacion-juego-asteroids.md, 08-adaptacion-arkanoid.md, 09-creacion-chrono-snake.md  
> **Fecha:** 2026-10-27  
> **Objetivo:** Implementar un sistema modular de controles táctiles virtuales arcade (Virtual Gamepad) y adaptaciones responsivas para la cabina CRT que permita jugar todos los títulos del catálogo en dispositivos móviles táctiles sin requerir teclado físico.

---

## 1. Por qué existe esta especificación

Arcade Vault fue concebido originalmente con un esquema de interacción centrado en teclado físico de escritorio (flechas direccionales, WASD, barra espaciadora, teclas T/S/M/Escape). Al acceder a la plataforma desde smartphones o tablets:

1. Los juegos resultan injugables debido a la ausencia de teclado físico o gamepad de hardware.
2. El contenedor 4:3 de la cabina CRT y los menús de HUD sufren recortes o desbordamientos en pantallas con alta relación de aspecto vertical (ej. 9:16 o 9:19.5 en smartphones).
3. Los eventos táctiles del navegador por defecto provocan gestos no deseados como zoom por doble toque (`double-tap zoom`), scroll inercial y recarga por arrastre (`pull-to-refresh`), arruinando la jugabilidad en tiempo real.

Esta especificación resuelve estos problemas mediante un gamepad virtual arcade modular desacoplado, adaptado a cada título activo y optimizado ergonómicamente tanto para orientación vertical (portrait) como horizontal (landscape).

---

## 2. Alcance

### Dentro del alcance

- **1. Detección Inteligente de Capacidades Táctiles:**
  - Hook y utilidad de detección basada en `pointer: coarse` y `navigator.maxTouchPoints > 0`.
  - Selector manual en la barra de ajustes de la cabina (`TOUCH: AUTO | ON | OFF`) para forzar visibilidad en emuladores o testing de escritorio.
  - Persistencia de la preferencia de visibilidad en `localStorage` (`arcade_vault_touch_controls_mode`).

- **2. Arquitectura del Virtual Gamepad Arcade (`components/game-room/virtual-controls/`):**
  - **Componente base `VirtualGamepad`:** Orquestador reactivo que renderiza el panel de controles según el juego activo (`gameId`) y la orientación del viewport (`portrait` vs `landscape`).
  - **Componente `VirtualDpad` (Cruzeta / Flechas Direccionales):**
    - Configurable en modo 4 direcciones (Up/Down/Left/Right para Snake/Tetris) o modo 2 direcciones laterales (Left/Right para Arkanoid/Tetris).
    - Soporte multi-touch con seguimiento de `identifier` de toque.
    - Emisión continua o por pulsación según el juego (ej. pulsación repetitiva para Tetris, retención sostenida para Snake y Asteroids).
  - **Componente `VirtualActionButton` (Botones de Acción Neón):**
    - Botones circulares con estética arcade retro (colores primarios neón cyan `#00f0ff`, magenta `#ff0055`, amber `#ffb700`, green `#00ff66`).
    - Feedback háptico opcional mediante `navigator.vibrate([15])` en dispositivos compatibles.
    - Estados visuales claros: reposo, activo/presionado (`glow` incrementado y escalado 0.95), y deshabilitado.

- **3. Configuraciones Modulares por Juego:**
  - **Chrono Snake:** D-Pad de 4 direcciones con flechas grandes + botón de Pausa rápida.
  - **Cyber Tetris 99:** D-Pad horizontal (Izquierda / Derecha) + botón de Caída Suave (Abajo) en la izquierda; botones de acción a la derecha para Rotar CW (A), Hard Drop (B) y Hold (C).
  - **Asteroids 2084:** Controles direccionales a la izquierda (Girar Izquierda / Girar Derecha) + botones de acción a la derecha para Propulsión (Thrust), Disparo (Fire) e Hiperspacio (Warp).
  - **Arkanoid Neon Revenge:** Botones de movimiento lateral (Izquierda / Derecha) + soporte táctil directo en el canvas (arrastrar el dedo sobre el área inferior de la pantalla para posicionar la pala directamente).

- **4. Integración y Despacho de Entradas:**
  - Módulo puente (`VirtualInputBridge`) que sintetiza y despacha eventos canónicos `KeyboardEvent` (`keydown` y `keyup`) al `window`, garantizando compatibilidad sin reescribir los bucles de físicas ni los motores internos de los juegos.
  - Opciones de callbacks de entrada directa a través de `CabinetGameProps` si un juego requiere entrada de coordenadas absolutas (como el arrastre de Arkanoid).

- **5. Adaptación Responsive de la Cabina CRT (`PlayRoomClient` & `CrtCabinet`):**
  - **Modo Vertical (Portrait):** La pantalla CRT se ubica en la mitad superior y el panel de control táctil arcade se renderiza en la mitad inferior (estilo consola portátil / Game Boy / Nintendo DS), evitando que los pulgares tapen el juego.
  - **Modo Horizontal (Landscape):** Controles flotantes semitransparentes en las esquinas inferiores izquierda y derecha superpuestos fuera del área activa del canvas 4:3.
  - Prevención estricta de gestos del sistema mediante CSS (`touch-action: none`, `user-select: none`, `-webkit-touch-callout: none`) en el contenedor del juego y controles.

### Fuera del alcance (para futuras especificaciones)

- Integración de API Gamepad física para mandos Bluetooth externos (DualShock, Xbox Controller).
- Modificación del catálogo de juegos no implementados (`pacman-neon-maze`, `space-invaders-galaxy`).
- Rediseño completo de la navegación del sitio (Header/Footer) en pantallas móviles más allá de la sala de juego (`/games/[id]/play`).

---

## 3. Modelo de Datos y Tipos

Ubicación: `components/game-room/virtual-controls/types.ts`

```typescript
export type TouchControlMode = "auto" | "on" | "off";

export type VirtualActionKey =
  | "ArrowUp"
  | "ArrowDown"
  | "ArrowLeft"
  | "ArrowRight"
  | "Space"
  | "KeyW"
  | "KeyA"
  | "KeyS"
  | "KeyD"
  | "KeyC"
  | "KeyT"
  | "Escape";

export interface VirtualButtonConfig {
  id: string;
  label: string;
  sublabel?: string;
  icon?: string;
  key: VirtualActionKey;
  keyCode?: string;
  color: "cyan" | "magenta" | "amber" | "green" | "surface";
  size?: "sm" | "md" | "lg";
}

export type DpadLayoutType = "4-way" | "2-way-horizontal" | "none";

export interface GameVirtualControlsConfig {
  gameId: string;
  dpadType: DpadLayoutType;
  primaryButtons: VirtualButtonConfig[];
  secondaryButtons?: VirtualButtonConfig[];
  directTouchCanvas?: boolean;
}
```

Mapeo de configuraciones canónicas por juego en `components/game-room/virtual-controls/configs.ts`:

```typescript
export const GAME_VIRTUAL_CONTROLS: Record<string, GameVirtualControlsConfig> =
  {
    "chrono-snake": {
      gameId: "chrono-snake",
      dpadType: "4-way",
      primaryButtons: [
        {
          id: "pause",
          label: "PAUSA",
          icon: "pause",
          key: "Escape",
          color: "amber",
          size: "sm",
        },
      ],
    },
    "cyber-tetris-99": {
      gameId: "cyber-tetris-99",
      dpadType: "4-way",
      primaryButtons: [
        {
          id: "rotate",
          label: "ROTAR",
          sublabel: "A",
          key: "ArrowUp",
          color: "cyan",
          size: "lg",
        },
        {
          id: "hard-drop",
          label: "DROP",
          sublabel: "B",
          key: "Space",
          color: "magenta",
          size: "md",
        },
        {
          id: "hold",
          label: "HOLD",
          sublabel: "C",
          key: "KeyC",
          color: "green",
          size: "sm",
        },
      ],
    },
    "asteroids-2084": {
      gameId: "asteroids-2084",
      dpadType: "2-way-horizontal", // Girar izquierda / derecha
      primaryButtons: [
        {
          id: "fire",
          label: "FUEGO",
          sublabel: "ESPACIO",
          key: "Space",
          color: "magenta",
          size: "lg",
        },
        {
          id: "thrust",
          label: "PROPULSIÓN",
          sublabel: "ARRIBA",
          key: "ArrowUp",
          color: "cyan",
          size: "md",
        },
        {
          id: "warp",
          label: "HIPER",
          sublabel: "W",
          key: "KeyW",
          color: "amber",
          size: "sm",
        },
      ],
    },
    "arkanoid-neon-revenge": {
      gameId: "arkanoid-neon-revenge",
      dpadType: "2-way-horizontal",
      directTouchCanvas: true, // Permite arrastrar la pala con el dedo sobre el canvas
      primaryButtons: [
        {
          id: "launch",
          label: "LANZAR",
          sublabel: "ESPACIO",
          key: "Space",
          color: "cyan",
          size: "md",
        },
      ],
    },
  };
```

---

## 4. Plan de Implementación

1. **Creación de tipos y definiciones de configuración:**
   - Crear `components/game-room/virtual-controls/types.ts` con interfaces de botones, D-Pad y configuraciones.
   - Crear `components/game-room/virtual-controls/configs.ts` con las configuraciones específicas de los 4 juegos jugables.

2. **Hook de detección y preferencias táctiles:**
   - Crear `components/game-room/virtual-controls/useTouchControls.ts` para detectar automáticamente soporte táctil (`pointer: coarse`, touch events, user agent móvil) y sincronizar el estado `mode: "auto" | "on" | "off"` con `localStorage`.

3. **Módulo de puente de entradas (`VirtualInputBridge`):**
   - Crear utilidad `virtualInput.ts` que implemente `pressKey(key)` y `releaseKey(key)` emitiendo `KeyboardEvent` nativos (`bubbles: true`, `cancelable: true`) sobre `window` con prevención de repetición indebida.
   - Agregar soporte para feedback háptico seguro (`try { navigator.vibrate?.(15); } catch {}`).

4. **Componentes atómicos de control virtual:**
   - Crear `components/game-room/virtual-controls/VirtualActionButton.tsx` con estilos Tailwind v4 neón, `touch-action: none`, `onPointerDown`/`onPointerUp`/`onPointerCancel`/`onPointerLeave`.
   - Crear `components/game-room/virtual-controls/VirtualDpad.tsx` con cruz direccional neón o botones direccionales independientes, soportando deslizamiento del dedo entre flechas adyacentes.

5. **Componente orquestador `VirtualGamepad`:**
   - Crear `components/game-room/virtual-controls/VirtualGamepad.tsx`.
   - Manejar layout adaptativo:
     - En **vertical**: panel horizontal inferior con distribución ergonómica (D-Pad a la izquierda, botones de acción a la derecha).
     - En **horizontal**: overlay flotante con esquinas translúcidas y botón de visibilidad mínima.

6. **Soporte táctil directo en `ArkanoidGame.tsx`:**
   - Actualizar el canvas de Arkanoid para registrar `touchstart`, `touchmove`, `touchend` además de los eventos de ratón existentes, calculando la coordenada `clientX` mapeada al ancho interno 800px para mover la pala suavemente con el dedo.

7. **Integración en la sala de juego (`PlayRoomClient.tsx` y `CrtCabinet.tsx`):**
   - Incorporar `useTouchControls` en `PlayRoomClient`.
   - Añadir botón de control táctil en la barra de herramientas CRT de `PlayRoomClient` (`TOUCH: AUTO | ON | OFF`).
   - Integrar `VirtualGamepad` debajo del chasis CRT en orientación vertical o como capa auxiliar en horizontal.
   - Aplicar clases CSS `touch-none` y `select-none` para blindar la experiencia táctil en pantallas móviles.

8. **Ajustes de estilos y viewport en CSS (`app/globals.css`):**
   - Asegurar `touch-action: manipulation` global excepto en la zona de juego donde rige `touch-action: none`.
   - Prevenir comportamiento elástico de scroll (overscroll-behavior-y: contain) en la sala de juego.

---

## 5. Criterios de Aceptación

- [ ] **Detección y Activación:** En dispositivos móviles táctiles o con emulación táctil activada en el navegador, el Virtual Gamepad aparece automáticamente sin necesidad de configuración manual.
- [ ] **Selector Manual:** Existe un botón en la barra de herramientas de ajustes CRT (`TOUCH: AUTO | ON | OFF`) que permite forzar los controles visibles u ocultarlos en cualquier dispositivo, guardando la preferencia en `localStorage`.
- [ ] **Chrono Snake jugable en móvil:** Se puede cambiar de dirección (arriba, abajo, izquierda, derecha) usando el D-Pad táctil sin que se produzcan giros inversos accidentales de 180° ni retardo perceptible.
- [ ] **Cyber Tetris 99 jugable en móvil:** Se pueden mover piezas lateralmente, acelerar la caída (Down), rotar (Up/Rotate) y realizar Hard Drop (Space) con botones virtuales independientes.
- [ ] **Asteroids 2084 jugable en móvil:** Permite rotar la nave con el pulgar izquierdo mientras simultáneamente se presiona propulsión (Thrust) o disparo (Fire) con el pulgar derecho (soporte multi-touch sin bloqueo).
- [ ] **Arkanoid Neon Revenge jugable en móvil:** La pala responde tanto a los botones de movimiento lateral como al arrastre continuo con el dedo directamente sobre la pantalla de juego.
- [ ] **Protección contra gestos del navegador:** Ningún toque repetitivo, rápido o mantenido produce zoom (`double-tap zoom`), selección de texto azul ni recarga de página por arrastre (`pull-to-refresh`).
- [ ] **Responsividad de Cabina:** En pantallas móviles estrechas (ancho < 640px en vertical), el chasis CRT y los controles se acomodan en una sola columna sin desbordamiento horizontal (`horizontal overflow` ni barra de scroll horizontal indeseada).

---

## 6. Decisiones Tomadas y Descartadas

- **Tomada: Emulación de `KeyboardEvent` mediante puente centralizado (`VirtualInputBridge`).**  
  _Justificación:_ Permite que los 4 juegos ya construidos (y futuros juegos) funcionen de inmediato sin modificar sus bucles principales ni su gestión de inputs probada.
- **Tomada: Layout dual diferenciado para Portrait y Landscape.**  
  _Justificación:_ En modo vertical, colocar los controles debajo del monitor CRT emula una máquina recreativa o consola portátil clásica y evita que los dedos tapen la visibilidad del juego; en horizontal, el overlay flotante maximiza el tamaño del monitor CRT.
- **Tomada: Detección automática + Override manual persistente.**  
  _Justificación:_ Garantiza que los usuarios móviles disfruten de la experiencia de inmediato, mientras desarrolladores y usuarios de escritorio pueden activar los controles para pruebas o jugar con ratón/touchpad.
- **Descartada: Gestos puros de swipe como única forma de control.**  
  _Justificación:_ Los swipes en juegos arcade rápidos de alta precisión (como Tetris o Asteroids) provocan alta latencia, fatiga gestual y falta de respuesta inmediata frente a botones con feedback táctil y estados claros de pulsación.
- **Descartada: Mandos analógicos virtuales (Virtual Joysticks) complejos para juegos de cuadrícula.**  
  _Justificación:_ Un joystick analógico introduce imprecisión en juegos discretos de 4 direcciones (Tetris y Snake); un D-Pad digital bien diseñado ofrece mejor respuesta arcade.

---

## 7. Riesgos Identificados y Mitigaciones

- **Riesgo 1: Interferencia de gestos nativos de navegación en iOS Safari y Android Chrome (swipe back, pull-to-refresh).**  
  _Mitigación:_ Aplicar `touch-action: none` y `overscroll-behavior: none` explícitamente en el contenedor de juego y controles virtuales, junto con `e.preventDefault()` en los eventos `pointerdown`/`touchstart` de los botones.
- **Riesgo 2: Bloqueo multi-touch (incapacidad de disparar mientras se gira en Asteroids).**  
  _Mitigación:_ Usar la API de Puntero moderna (`Pointer Events`) con punteros independientes (`pointerId`) o `targetTouches` para que cada botón o D-Pad registre su propio ciclo de vida de pulsación sin interferir entre sí.
- **Riesgo 3: Desfase de escalado entre el canvas CRT (800x600) y las coordenadas táctiles en Arkanoid.**  
  _Mitigación:_ Usar `canvas.getBoundingClientRect()` para normalizar dinámicamente `clientX` relativo al ancho real renderizado del canvas.
