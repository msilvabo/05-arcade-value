# Spec 01: Biblioteca de Juegos (MVP Visual)

**Estado:** Aprobado  
**Fecha:** 2026-10-21  
**Depende de:** Ninguna  

## Objetivo
Implementar la interfaz visual completa y la interactividad en cliente del catálogo principal de Arcade Vault siguiendo el diseño y estructura de referencia de `references/arcade_vault_biblioteca_de_juegos`.

---

## Alcance

### Dentro del alcance
- **Navegación superior (Header):**
  - Logotipo de Arcade Vault con efecto de resplandor neón.
  - Enlaces de navegación (`Biblioteca`, `Salón de la Fama`, `Autenticación`).
  - Toggles simulados de audio (`SFX: ON`, `MÚSICA: 8-BIT`).
  - Contador de créditos interactivo sincronizado con el botón de inserción de fichas.
  - Perfil de usuario retro con estado en línea (`RETRO_PRO_84 // ONLINE`).
- **Sección Hero / Marquesina Arcade:**
  - Píldoras de telemetría de servidores en vivo (jugadores en línea, cabinas activas, estado del sistema).
  - Título marquesina con gradiente neón y badge de revisión `REV.84`.
  - Botón interactivo "INSERTAR CRÉDITO (+1)" que incrementa el contador y despliega un micro-display de feedback temporal.
  - Botón de acceso a "Salón de Récords".
- **Ticker de Torneo Semanal:**
  - Banner informativo del premio y contador regresivo estilizado (`02D 14H 32M`).
- **Barra de Búsqueda y Filtros:**
  - Campo de búsqueda interactivo con soporte para tecla `ESC` para limpiar.
  - Selector de ordenamiento (Más jugados, Mejor puntuación, Año).
  - Pestañas de categorías tipo cartucho (`TODOS`, `SHOOT 'EM UP`, `PUZZLE`, `ACCIÓN / LABERINTO`, `CLÁSICOS 80s`, `POPULARES`) que filtran activamente la grilla.
- **Grilla de Juegos (6 tarjetas):**
  - Renderizado dinámico de los 6 títulos clásicos:
    1. *Arkanoid: Neon Revenge* (1986, Puzzle / Acción, Difícil, Torneo Activo)
    2. *Cyber Tetris 99* (1984, Puzzle Estratégico, Normal, Más Popular)
    3. *Space Invaders: Galaxy* (1978, Shoot 'em Up, Hardcore)
    4. *Pac-Man: Neon Maze* (1980, Laberinto, Difícil, Perfect Score)
    5. *Chrono Snake* (1997, Arcade Puzzle, Normal, Multi-Pulso)
    6. *Asteroids 2084* (1979, Vector Combat, Difícil, Vector Mono)
  - Carátulas pixel-art en formato SVG idénticas a la referencia.
  - Indicadores de récord mundial y jugador titular.
  - Botón interactivo "JUGAR" en cada tarjeta que abre un modal retro de "Próximamente / En Desarrollo".
- **Dock de Configuración CRT:**
  - Barra inferior con controles simulados de emulación CRT y botones de ajuste.
- **Pie de Página (Footer):**
  - Copyright y telemetría de red arcade (latencia, potencia, cabinas disponibles).
- **Estética Global:**
  - Capas fijas de scanlines y CRT overlay integradas con Tailwind CSS v4.

### Fuera del alcance
- Implementación de la lógica jugable de cualquiera de los juegos (emuladores, canvas games o bucles de juego).
- Persistencia remota en base de datos o backend de autenticación real.
- Rutas secundarias operativas para "Salón de la Fama" o "Autenticación" (se mantienen como enlaces visuales o anclas).

---

## Modelo de Datos

Estructura de tipos TypeScript ubicada en `types/game.ts`:

```typescript
export type GameCategory =
  | "all"
  | "shoot-em-up"
  | "puzzle"
  | "action-maze"
  | "classics-80s"
  | "popular";

export type GameDifficulty = "NORMAL" | "DIFÍCIL" | "HARDCORE";

export interface GameRecord {
  score: string;
  holder: string;
}

export interface Game {
  id: string;
  title: string;
  category: string;
  categoryKey: GameCategory[];
  year: number;
  badge?: string;
  difficulty: GameDifficulty;
  description: string;
  record: GameRecord;
  artType: "arkanoid" | "tetris" | "space-invaders" | "pacman" | "snake" | "asteroids";
  playsCount: number;
}
```

Colección tipada en `data/games.ts` con los 6 juegos definidos con sus correspondientes metadatos e identificación de carátula artística.

---

## Plan de Implementación

1. **Configuración de Fuentes, Iconos y Estilos CRT:**
   - Incorporar Google Material Symbols Outlined y fuentes necesarias en `app/layout.tsx`.
   - Asegurar en `app/globals.css` las clases utilitarias para efectos scanline, CRT overlay y sombras de brillo neón.
2. **Definición de Tipos y Mock Data:**
   - Crear `types/game.ts` con las interfaces de `Game`, `GameCategory` y filtros.
   - Crear `data/games.ts` con la información de los 6 títulos y la lista de categorías.
3. **Componentes Atómicos de Ilustración:**
   - Crear `components/library/GameArtwork.tsx` para renderizar con fidelidad los SVGs vectoriales y pixel-art de cada juego.
4. **Componentes de Encabezado y Telemetría:**
   - Crear `components/library/Header.tsx` con navegación, controles de sonido y contador de créditos interactivo.
   - Crear `components/library/HeroSection.tsx` con título arcade, indicadores de servidores y botón "INSERTAR CRÉDITO" con animación y flash de mensaje.
   - Crear `components/library/TournamentBanner.tsx` con el anuncio del torneo semanal.
5. **Componentes de Catálogo y Filtrado:**
   - Crear `components/library/GameFilters.tsx` con input de búsqueda, selector de orden y botones de categoría interactivos.
   - Crear `components/library/GameCard.tsx` que reciba un `Game` y emita el evento para jugar.
   - Crear `components/library/GameModal.tsx` para notificar al usuario en estilo retro que el juego está en fase de desarrollo.
6. **Componentes de Base y Ensamblado Principal:**
   - Crear `components/library/CrtDock.tsx` y `components/library/Footer.tsx`.
   - Modificar `app/page.tsx` para orquestar el estado unificado (créditos, filtro de texto, categoría seleccionada, ordenamiento y juego seleccionado para el modal).
7. **Verificación y Compilación:**
   - Probar interactividad en navegador (filtrado en tiempo real, suma de créditos, tecla ESC, apertura y cierre de modal).
   - Validar con `npm run lint` y `npm run build`.

---

## Criterios de Aceptación

- [ ] La página principal (`/`) replica con alta fidelidad la composición visual de `references/arcade_vault_biblioteca_de_juegos/code.html`.
- [ ] El efecto CRT y las scanlines se visualizan sutilmente sobre el fondo sin bloquear la interacción con los elementos.
- [ ] El botón "INSERTAR CRÉDITO (+1)" incrementa el valor en el contador del Header y muestra el mensaje retro de confirmación durante ~2.2 segundos.
- [ ] La barra de búsqueda filtra las tarjetas de juego por título o género en tiempo real. Presionar `ESC` limpia el campo.
- [ ] Las pestañas de categoría filtran correctamente la grilla de juegos según la categoría seleccionada y marcan el botón activo con brillo cyan.
- [ ] Se muestran las 6 carátulas con el arte vectorial SVG de referencia intacto.
- [ ] Al pulsar "JUGAR" en cualquiera de las tarjetas se despliega un diálogo retro con el nombre del juego e información de "Próximamente / En Desarrollo", permitiendo cerrarlo sin errores.
- [ ] No existen advertencias ni errores en `npm run lint` y la compilación con `npm run build` es exitosa.

---

## Decisiones Tomadas y Descartadas

- **Modularización en `components/library/` vs. Monolito:** Se optó por separar la pantalla en componentes limpios y reutilizables en vez de replicar un único archivo HTML/JSX gigante, facilitando el mantenimiento y testeo futuro.
- **Mock de datos tipado (`data/games.ts`) vs. JSX estático:** Se decidió estructurar los juegos en un dataset tipado en TypeScript para habilitar filtrado real en cliente por búsqueda y categorías.
- **Material Symbols y SVGs originales vs. Lucide:** Se preservan los iconos y artes SVG originales para respetar la estética exacta del prototipo de referencia.
- **Modal de "Próximamente" vs. Enlaces rotos:** Al hacer clic en "JUGAR", se optó por un feedback visual explicativo (modal retro) para brindar una experiencia de usuario completa y pulida en el MVP sin requerir emulación real.

---

## Riesgos Identificados

- **Compatibilidad de estilos en Tailwind CSS v4:** La referencia utiliza clases arbitrarias con variables de tema personalizadas de un CDN de Tailwind 3. En Tailwind v4, se deben declarar adecuadamente las variables CSS o mapear a clases estándar para asegurar idéntica apariencia cromática.
