# Spec 02: Interfaces de Usuario Restantes (MVP Visual)

**Estado:** Implemented  
**Fecha:** 2026-10-21  
**Depende de:** 01-biblioteca-juegos-mvp.md  

## Objetivo
Implementar la interfaz visual completa y la interactividad en cliente de las cuatro vistas restantes de Arcade Vault (`/auth`, `/leaderboard`, `/games/[id]`, y `/games/[id]/play`) siguiendo fielmente los diseños de referencia de `references/`.

---

## Alcance

### Dentro del alcance
- **1. Interfaz de Autenticación y Registro (`/auth`):**
  - Vista basada en `references/arcade_vault_autenticaci_n_y_registro`.
  - Selector de pestañas ("INICIAR SESIÓN" vs "NUEVO REGISTRO") con animaciones de transición y estilos neón diferenciados (cyan para login, fucsia/magenta para registro).
  - Formulario con campos estilizados para GamerTag, Contraseña/PIN retro y confirmación en modo registro.
  - Botones de acceso social ("Google" y "GitHub") con estética arcade retro.
  - Simulación interactiva de login/registro en cliente con mensaje de confirmación y feedback visual.
  - Enlaces de retorno a la biblioteca principal.
- **2. Interfaz del Salón de la Fama (`/leaderboard`):**
  - Vista basada en `references/arcade_vault_sal_n_de_la_fama`.
  - Encabezado con estadísticas globales de competición (Total de partidas, Récord máximo, Campeón vigente).
  - Podio de Honor Neón para el Top 3 (1er lugar dorado/cyan destacado, 2do y 3er lugar estilizados) con avatars retro, insignias y puntuaciones.
  - Selector de filtros por juego y por período temporal (Semanal, Mensual, Histórico).
  - Tabla de clasificación Top 10 con rangos, badges de rango, GamerTags, fechas, multiplicador y puntajes con tipografía monoespaciada.
  - Barra de búsqueda o filtrado rápido de jugadores.
- **3. Interfaz del Lanzador de Juego (`/games/[id]`):**
  - Vista dinámica con Arkanoid: Neon Revenge como juego principal basado en `references/arcade_vault_lanzador_arkanoid_neon`.
  - Marquesina del juego con arte vectorial/SVG, año de lanzamiento, desarrollador y género.
  - Bitácora de misión con descripción lore, reglas de puntuación y diagrama visual de controles (teclado / arcade stick).
  - Selector interactivo de dificultad ("Cadete / Normal", "Veterano / Difícil", "Pesadilla / Hardcore") que actualiza dinámicamente multiplicadores de puntaje.
  - Panel lateral de mejores marcas del juego (Récords locales y mundiales).
  - Botón de acción principal destacado "INICIAR PARTIDA // INSERTAR CRÉDITO" que navega directamente a la sala de juego CRT (`/games/[id]/play`).
- **4. Interfaz de la Sala de Juego CRT (`/games/[id]/play`):**
  - Vista inmersiva de cabina arcade basada en `references/arcade_vault_sala_de_juego_crt`.
  - Monitor arcade con curvatura CRT, efecto de scanlines, viñeteado y resplandor de fósforo neón.
  - HUD superior retro con puntuación en tiempo real (1UP, HIGH SCORE), nivel actual y contador de vidas gráficas.
  - Presentación visual del juego Arkanoid: canvas o SVG interactivo/animado mostrando la paleta reflectora neón, pelota de energía y matriz de ladrillos destructibles (maquetación visual estética con animación CSS/requestAnimationFrame ligera).
  - Overlay modal simulado para estados de "PAUSA" y "FIN DEL JUEGO // GAME OVER" con opciones de "REINTENTAR", "VOLVER AL LANZADOR" y "GUARDAR RÉCORD".
  - Barra inferior de controles CRT (toggles para scanlines, curvatura, filtro de fósforo y volumen retro).
- **5. Navegación e Integración Global:**
  - Actualizar `components/library/Header.tsx` para que los enlaces "Salón de la Fama" y "Autenticación" naveguen a `/leaderboard` y `/auth` respectivamente.
  - Actualizar `components/library/GameCard.tsx` para que el botón "JUGAR" navegue al lanzador `/games/${game.id}`.

### Fuera del alcance
- Implementación de motores o bucles de emulación de juegos completos y funcionales (físicas complejas, colisiones de todos los juegos, niveles infinitos o IA avanzada).
- Conexión a bases de datos remotas, APIs de backend o servidores de autenticación OAuth reales.
- Persistencia remota en base de datos; la interactividad utiliza estado local de React (`useState`) y opcionalmente `localStorage`.

---

## Modelo de Datos

Estructuras de tipos TypeScript ubicadas en `types/`:

### 1. Leaderboard (`types/leaderboard.ts`)
```typescript
export interface LeaderboardEntry {
  rank: number;
  gamerTag: string;
  avatar: string;
  score: number;
  formattedScore: string;
  gameId: string;
  gameTitle: string;
  badge: "CHAMPION" | "MASTER" | "VETERAN" | "ROOKIE";
  date: string;
  accuracy: string;
  combo: string;
}

export type LeaderboardPeriod = "all-time" | "monthly" | "weekly";
```

### 2. Detalles del Juego y Lanzador (`types/launcher.ts`)
```typescript
export interface GameMissionLog {
  story: string;
  objective: string;
  controls: {
    key: string;
    action: string;
  }[];
  powerups: {
    name: string;
    color: string;
    description: string;
  }[];
}

export interface GameExtendedDetails {
  id: string;
  title: string;
  subtitle: string;
  version: string;
  releaseYear: number;
  developer: string;
  genre: string;
  maxScore: string;
  recordHolder: string;
  missionLog: GameMissionLog;
}
```

### 3. Colecciones Mock (`data/leaderboard.ts` y `data/game-details.ts`)
- `data/leaderboard.ts`: Arreglo tipado con el Top 10 histórico y semanal para Arkanoid y catálogo general.
- `data/game-details.ts`: Diccionario indexado por `id` de juego con la información ampliada de lore, controles y powerups para el lanzador y cabina de juego.

---

## Plan de Implementación

1. **Modelos de Datos y Mocks:**
   - Crear `types/leaderboard.ts` y `types/launcher.ts`.
   - Crear `data/leaderboard.ts` con el Top 10 y Podio de honor según `references/arcade_vault_sal_n_de_la_fama`.
   - Crear `data/game-details.ts` con los datos ampliados de Arkanoid y títulos arcade según `references/arcade_vault_lanzador_arkanoid_neon`.

2. **Ruta e Interfaz de Autenticación (`/auth`):**
   - Crear `components/auth/AuthCard.tsx` con tabs Login/Registro, formulario reactivo con estados de validación simulados y botones OAuth arcade.
   - Crear `app/auth/page.tsx` reutilizando el layout retro con CRT overlays y enlaces de regreso.

3. **Ruta e Interfaz del Salón de la Fama (`/leaderboard`):**
   - Crear `components/leaderboard/LeaderboardPodium.tsx` para el podio de los 3 mejores jugadores con iluminación neón.
   - Crear `components/leaderboard/LeaderboardTable.tsx` con filtros por período, juego y buscador de GamerTag.
   - Crear `app/leaderboard/page.tsx` integrando los componentes con el Header y Footer globales.

4. **Ruta e Interfaz del Lanzador de Juego (`/games/[id]`):**
   - Crear `components/launcher/LauncherHero.tsx` con la marquesina, detalles de versión y carátula retro del juego.
   - Crear `components/launcher/MissionLog.tsx` con controles arcade, historia de misión y selector interactivo de dificultad.
   - Crear `components/launcher/GameRecordsSidebar.tsx` con las mejores marcas y rankings del juego.
   - Crear `app/games/[id]/page.tsx` que cargue la información del juego según el parámetro dinámico (con fallback en Arkanoid) y botón CTA hacia `/games/[id]/play`.

5. **Ruta e Interfaz de Sala de Juego CRT (`/games/[id]/play`):**
   - Crear `components/game-room/CrtBezel.tsx` que renderice el marco de cabina arcade, curvatura CRT y scanlines.
   - Crear `components/game-room/ArkanoidPresentation.tsx` con la recreación visual estética de Arkanoid (animación suave de bola, paleta reactiva al cursor/teclas y bloques luminosos).
   - Crear `components/game-room/GameRoomHud.tsx` con 1UP, HIGH SCORE, vidas y nivel.
   - Crear `components/game-room/GameRoomOverlay.tsx` con modales interactivos de Pausa y Game Over simulados.
   - Crear `app/games/[id]/play/page.tsx` con barra de herramientas de simulación retro.

6. **Integración de Enlaces Globales:**
   - Actualizar `components/library/Header.tsx` para enlazar activamente a `/`, `/leaderboard` y `/auth`.
   - Actualizar `components/library/GameCard.tsx` para dirigir a `/games/[id]` al pulsar "JUGAR".

---

## Criterios de Aceptación

- [ ] La ruta `/auth` renderiza fielmente el diseño de `references/arcade_vault_autenticaci_n_y_registro`.
- [ ] La pestaña de alternancia en `/auth` cambia limpiamente entre Iniciar Sesión y Registro actualizando los textos, colores de acento y campos del formulario.
- [ ] La ruta `/leaderboard` renderiza el Podio Top 3 y la tabla de clasificación Top 10 fielmente a `references/arcade_vault_sal_n_de_la_fama`.
- [ ] Los filtros de período y juego en `/leaderboard` actualizan la visualización de la lista de puntuaciones.
- [ ] La ruta `/games/[id]` renderiza la ficha y lanzador del juego correspondiente (ej. `/games/arkanoid`) según `references/arcade_vault_lanzador_arkanoid_neon`.
- [ ] El selector de dificultad en `/games/[id]` permite alternar entre dificultades y actualiza el multiplicador visual.
- [ ] El botón de iniciar partida en `/games/[id]` navega correctamente a `/games/[id]/play`.
- [ ] La ruta `/games/[id]/play` renderiza la sala de juego CRT con el marco de monitor, scanlines, HUD de puntuación y la escena visual de Arkanoid basada en `references/arcade_vault_sala_de_juego_crt`.
- [ ] Existen controles visuales interactivos en `/games/[id]/play` para activar y desactivar estados simulados de Pausa o Fin de Juego (Game Over).
- [ ] La navegación entre todas las pantallas (`/`, `/auth`, `/leaderboard`, `/games/[id]`, `/games/[id]/play`) es fluida y coherente con el Header de la aplicación.
- [ ] La aplicación compila sin errores (`npm run build`) y pasa las validaciones de TypeScript y linter (`npm run lint`).

---

## Decisiones Tomadas y Descartadas

- **Tomada:** Consolidar las 4 interfaces visuales en un único Spec 02.  
  *Justificación:* Las 4 interfaces comparten la misma paleta cromática de diseño (`references/retro_neon_arcade/DESIGN.md`), componentes comunes (CRT scanlines, Header/Footer) y forman un flujo de usuario natural continuo: Biblioteca -> Auth -> Ficha/Lanzador -> Sala de Juego -> Salón de la Fama.
- **Tomada:** Rutas dinámicas `/games/[id]` y `/games/[id]/play` centradas en Arkanoid como demo principal.  
  *Justificación:* Permite reutilizar el modelo de datos de `data/games.ts` ya existente y abre la puerta a que futuros juegos compartan la misma estructura de ruta sin necesidad de crear rutas estáticas redundantes.
- **Tomada:** Implementación puramente visual con interactividad y animaciones CSS/SVG simuladas en cliente.  
  *Justificación:* El requerimiento especifica que no se requiere emulación ni lógica compleja de juego, sino una presentación visual premium e inmersiva que replique fielmente los archivos de referencia.
- **Descartada:** Rutas planas `/launcher` y `/play`.  
  *Justificación:* Las rutas anidadas RESTful `/games/[id]` y `/games/[id]/play` son mucho más semánticas y escalables en Next.js App Router.
- **Descartada:** Dependencia de backend o APIs externas para autenticación y leaderboard.  
  *Justificación:* Mantener el proyecto autocontenido como MVP visual ejecutable localmente sin infraestructura adicional.

---

## Riesgos Identificados

- **Riesgo:** Alto consumo de CPU o artefactos visuales si se sobrecargan múltiples capas simultáneas de scanlines y blur en pantallas de baja resolución.  
  *Mitigación:* Usar capas fijas optimizadas con CSS `backdrop-filter` moderado y aceleración por GPU con `transform: translateZ(0)`.
- **Riesgo:** Inconsistencias de navegación si los IDs de juego no coinciden con `data/games.ts`.  
  *Mitigación:* Normalizar los slugs con el catálogo existente (`arkanoid`, `tetris`, etc.) y proveer un fallback controlado al juego demo *Arkanoid: Neon Revenge* en caso de un ID no reconocido.
