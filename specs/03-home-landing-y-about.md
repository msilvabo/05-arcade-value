# Spec 03: Landing Page (Home) y Acerca de (About)

**Estado:** Draft  
**Fecha:** 2026-10-22  
**Depende de:** 01-biblioteca-juegos-mvp.md, 02-arcade-interfaces-visuales.md  

## Objetivo
Implementar la página principal (Home Landing Page) y la vista Acerca de / Contacto (About) inspiradas en `references/home-about`, reubicando el catálogo de juegos actual en `/library` y unificando la barra de navegación global con soporte responsive.

---

## Alcance

### Dentro del alcance
- **1. Reubicación del Catálogo de Juegos:**
  - Trasladar la vista actual de la biblioteca (con filtros, buscador, CRT dock, modal y tarjetas) de `app/page.tsx` a `app/library/page.tsx` (y alias/soporte para `/biblioteca`).
  - Garantizar que la funcionalidad completa del catálogo de juegos permanezca intacta y sin regresiones.
- **2. Barra de Navegación Global Unificada (`Navbar`):**
  - Implementar o unificar un componente de navegación persistente accesible desde todas las rutas principales.
  - Enlaces de navegación: **Inicio** (`/`), **Biblioteca** (`/library`), **Salón de la Fama** (`/leaderboard`), **Acerca de** (`/about`), y **Autenticación** (`/auth`).
  - Indicador visual de ruta activa con resplandor neón cyan/magenta.
  - Panel móvil lateral desplegable (drawer / mobile menu) con animación, backdrop oscurecido y botón hamburguesa retro (`≡`).
  - Indicador de créditos disponibles (`CRÉDITOS · 03` o sincronizado con el estado global) y botón de acceso a cuenta / iniciar sesión.
- **3. Home Landing Page (`app/page.tsx`):**
  - **Hero Section:**
    - Siluetas decorativas pixel art animadas/flotantes en SVG (invasores espaciales, fantasmas, nave, retícula, OVNI, moneda dorada, corazón pixel y D-pad).
    - Eyebrow parpadeante: `▸ INSERTA UNA MONEDA_`.
    - Título retro tipográfico de gran impacto visual: "EL ARCADE CLÁSICO ESTÁ DE VUELTA".
    - Subtítulo descriptivo con llamadas a la acción duales: botón `▶ EXPLORAR JUEGOS` (navega a `/library`) y botón neón magenta `✦ CREAR CUENTA` (navega a `/auth`).
    - Indicador inferior de scroll animado (`DESLIZA ▼`).
  - **Sección 01: ¿Por qué Arcade Vault?:**
    - Grid de 4 tarjetas de características destacadas con iconos retro vectoriales y acentos de color neón:
      1. *Juegos Clásicos* (Gamepad / Cyan)
      2. *100% Gratis* (Free / Amarillo)
      3. *Ladder Boards* (Trofeo / Magenta)
      4. *Siempre Creciendo* (Cohete / Verde)
  - **Sección 02: Juegos Disponibles Ahora (Preview Rail):**
    - Riel horizontal / carrusel de minitarjetas (`MiniCard`) con portada estilizada, título y categoría.
    - Click en cualquier minitarjeta navega al lanzador de detalles `/games/[id]`.
    - Botón central `VER TODOS LOS JUEGOS →` que navega a `/library`.
  - **Sección de Estadísticas Rápidas:**
    - Bloque de estadísticas con tipografía neón: `12+ JUEGOS Y CONTANDO`, `MILES DE PARTIDAS JUGADAS CADA DÍA`, `GLOBAL RANKING COMPITE CON EL MUNDO`.
  - **Sección 03: Actividad en Vivo:**
    - *Últimas Puntuaciones:* Ticker animado de partidas recientes con nombre del jugador (color neón), juego, puntuación con formato y tiempo relativo (`hace 2 min`).
    - *Top Jugadores · Hoy:* Ranking diario con badges `#01`, `#02`, `#03`, barras de progreso visuales proporcionales al puntaje y botón `VER SALÓN →` que navega a `/leaderboard`.
  - **Sección 04: Precios / Free to Play:**
    - Tarjeta "Plan Único // Jugador Vault" con costo `$0 / SIEMPRE`, sello retro `FREE PLAY`, lista de ventajas y CTA `EMPEZAR GRATIS →`.
    - Preguntas Frecuentes (FAQ) con acordeón o visualización de respuestas a dudas comunes (gratuidad, necesidad de cuenta, sostenibilidad del proyecto).
  - **Sección Final CTA:**
    - Cierre de página de alto impacto con título "¿LISTO PARA JUGAR?", botón pulsante `INSERTAR MONEDA →` y texto de confianza.
  - **Efectos y Animaciones:**
    - Revelado progresivo al hacer scroll (`IntersectionObserver` o clases CSS `.reveal`).
- **4. Página Acerca de (`app/about/page.tsx`):**
  - Vista dedicada basada en `references/home-about/about.jsx`.
  - Encabezado con misión del proyecto y tarjetas destacadas (Hecho para jugadores, Juegos en HTML, Proyecto en crecimiento).
  - Divisor ornamental con animación de bloques pixel art neón.
  - Sección de contacto con tips ("Respuesta en 24-48h", "Sugerencias bienvenidas", "Sin spam").
  - Formulario interactivo en cliente con campos: Nombre, Correo Electrónico y Mensaje.
  - Validación con retroalimentación visual (efecto `shake` en campos vacíos) y estado de confirmación de envío exitoso con agradecimiento personalizado y opción para enviar otro mensaje.

### Fuera del alcance
- Backend o envío de correo SMTP real para el formulario de contacto (se gestiona con feedback interactivo en cliente).
- Base de datos en tiempo real mediante WebSockets para el ticker de puntuaciones (se alimenta de un dataset mock tipado con simulación de refresco en cliente).
- Pasarelas de pago o transacciones monetarias (la plataforma es 100% Free-to-Play).

---

## Modelo de Datos

Estructuras de tipos TypeScript ubicadas en `types/activity.ts`:

```typescript
export interface LiveScoreTickerItem {
  id: string;
  gamerTag: string;
  gameTitle: string;
  score: number;
  timeAgo: string;
  color: "cyan" | "magenta" | "yellow" | "green";
}

export interface DailyTopPlayer {
  rank: number;
  gamerTag: string;
  score: number;
  percentage: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}
```

Dataset mock en `data/activity.ts`:
- Lista de puntuaciones recientes para el feed en vivo (`LIVE_SCORES_FEED`).
- Lista del Top 5 de jugadores del día (`DAILY_TOP_PLAYERS`).
- Preguntas frecuentes (`FAQS_LIST`).

---

## Plan de Implementación

1. **Reorganización de Rutas:**
   - Crear `app/library/page.tsx` moviendo la lógica completa del catálogo actual desde `app/page.tsx`.
   - Opcionalmente agregar redirección o reescritura en `next.config.ts` o `app/biblioteca/page.tsx` que redirija a `/library`.
   - Verificar que `/library` funcione con todas sus características (filtros, búsqueda, CRT dock, modales).
2. **Definición de Tipos y Datos:**
   - Crear `types/activity.ts` con las interfaces de actividad, ranking diario y formulario de contacto.
   - Crear `data/activity.ts` con los datos mock realistas para el ticker, top diario y FAQs.
3. **Barra de Navegación Global Compartida:**
   - Crear o refactorizar `components/layout/Navbar.tsx` con enlaces a `/`, `/library`, `/leaderboard`, `/about`, `/auth`.
   - Incluir soporte para menú móvil responsive tipo drawer lateral con backdrop.
   - Mantener contador de créditos interactivo y botón de inicio de sesión.
   - Integrar el `Navbar` en el layout general de la aplicación (`app/layout.tsx`) o mantenerlo consistente en todas las vistas.
4. **Componentes Visuales de la Landing Page (`components/home/`):**
   - Crear `FloatingSilhouettes.tsx` con los 8 iconos vectoriales pixel art en SVG y animaciones flotantes suaves.
   - Crear `HomeHero.tsx` con eyebrow parpadeante, títulos neón, subtítulo y botones de acción.
   - Crear `FeaturesGrid.tsx` con las 4 tarjetas de beneficios y sus respectivos iconos SVG pixel art (`FeatureIcon`).
   - Crear `GamesPreviewRail.tsx` con las minitarjetas de vista previa de juegos basadas en `data/games.ts`.
   - Crear `HomeStats.tsx` con métricas globales destacadas.
   - Crear `LiveActivity.tsx` con el ticker de últimas puntuaciones y el Top 5 de jugadores diarios con barras de porcentaje.
   - Crear `PricingSection.tsx` con la tarjeta Free to Play `$0` y la sección de FAQs.
   - Crear `FinalCta.tsx` con el botón de "INSERTAR MONEDA".
5. **Implementación de la Página Home (`app/page.tsx`):**
   - Ensamblar las secciones de la Landing en `app/page.tsx`.
   - Añadir hook o efecto de Intersection Observer para el efecto de revelado suave (`.reveal.in`).
6. **Implementación de la Página Acerca de (`app/about/page.tsx`):**
   - Crear componentes `components/about/AboutHero.tsx` y `components/about/ContactForm.tsx`.
   - Implementar validación del formulario con animación de sacudida (`shake`) y confirmación de envío.
7. **Verificación y Calidad:**
   - Verificar la navegación fluida entre todas las rutas (`/`, `/library`, `/leaderboard`, `/about`, `/auth`, `/games/[id]`).
   - Verificar diseño responsivo en resoluciones desktop y mobile.
   - Ejecutar `npm run build` y `npm run lint` para garantizar 0 errores de compilación y de TypeScript.

---

## Criterios de Aceptación
- [ ] La ruta `/` renderiza la nueva Landing Page retro completa con Hero, Siluetas pixel art, Características, Preview de Juegos, Estadísticas, Actividad en Vivo, Precios y CTA final.
- [ ] La ruta `/library` renderiza la biblioteca de juegos completa previamente ubicada en `/`, sin pérdida de funcionalidades ni regresiones.
- [ ] La barra de navegación permite navegar fluidamente a Inicio (`/`), Biblioteca (`/library`), Salón de la Fama (`/leaderboard`), Acerca de (`/about`) y Autenticación (`/auth`).
- [ ] El menú móvil responsive se despliega y cierra correctamente en pantallas pequeñas con el botón hamburguesa `≡`.
- [ ] La sección de Actividad en Vivo muestra las puntuaciones recientes y el Top diario de jugadores con barras proporcionales.
- [ ] La minitarjetas de la sección "Juegos Disponibles Ahora" enlazan correctamente a `/games/[id]` y el botón "Ver todos" navega a `/library`.
- [ ] La ruta `/about` muestra la sección de misión, highlights y el formulario de contacto interactivo.
- [ ] El formulario de contacto valida campos vacíos con retroalimentación visual (`shake`) y muestra mensaje de éxito al completarse.
- [ ] La aplicación compila limpiamente con `npm run build` sin errores de TypeScript o ESLint.

---

## Decisiones Tomadas y Descartadas

- **Decisión:** Mover el catálogo existente a `/library` y ubicar la Landing Page en `/`.  
  *Justificación:* Es el estándar natural de la arquitectura web de videojuegos y aplicaciones donde la raíz (`/`) presenta el producto y capta usuarios, mientras `/library` es el catálogo de juegos.
- **Decisión:** Incluir la página `/about` en esta misma especificación.  
  *Justificación:* Los archivos de referencia en `references/home-about` (`home.jsx`, `about.jsx`, `nav.jsx`) forman un conjunto de navegación coherente e indivisible.
- **Decisión:** Utilizar un dataset mock tipado en `data/activity.ts` para la actividad en vivo en lugar de solo strings estáticos en el JSX.  
  *Justificación:* Mantiene la consistencia del proyecto con TypeScript estricto y facilita una futura integración con APIs o almacenamiento persistente.
- **Descartado:** Implementar envío de correos real mediante API/SMTP en `/about`.  
  *Justificación:* Excede el alcance de frontend del MVP y añade dependencias externas innecesarias en esta etapa.
