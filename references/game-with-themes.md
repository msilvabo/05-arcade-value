# Control de Skins y Temas de Juegos — Arcade Vault

Este documento es la **fuente de verdad persistente** para el seguimiento, auditoría y certificación de skins arcade en los juegos de la plataforma Arcade Vault. Es mantenido y sincronizado activamente por el agente especializado **`@skin-designer`**.

---

## 🏛️ Estándar de Skins Canónicos y Modo Oscuro

Para que un juego cumpla con el estándar de calidad visual de Arcade Vault, debe soportar los **3 skins canónicos** y garantizar visibilidad y contraste estricto en **Modo Oscuro (Dark Mode)**:

1. **`clasico` (Default):**
   - **Estilo:** Recreativa clásica de los 80s (Vector / Raster). Alta nitidez geométrica, resplandor mínimo o ausente (`shadowBlur: 0-4px`).
   - **Lienzo Dark Mode:** Negro espacial profundo (`#050608`).
   - **Acentos:** Blanco fósforo puro (`#f0f0f0`), amarillo arcade (`#ffcf3a`), cian puro (`#00f5ff`), rojo carmesí (`#ff3b30`).
2. **`neon`:**
   - **Estilo:** Cyberpunk / Synthwave 2084. Resplandor fosforescente multicapa (`shadowBlur: 14-22px`).
   - **Lienzo Dark Mode:** Azul abisal profundo (`#04050e`).
   - **Acentos:** Cian hiperbrillante (`#00f5ff`), magenta láser (`#ff006e`), violeta cuántico (`#a855f7`).
3. **`retro` (Dual Phosphor):**
   - **Estilo:** Monitor catódico analógico vintage monocromo/bitonal con resplandor difuso (`shadowBlur: 8-12px`).
   - **Variante Ámbar P3 (Default):** Fondo carbón oscuro cálido (`#090805`), acentos ámbar dorado (`#ffaa00`, `#ffc247`, `#7a4800`).
   - **Variante Fósforo Verde P1:** Fondo fósforo oscuro (`#040a05`), acentos verde terminal (`#33ff33`, `#1aff1a`, `#006611`).
4. **Modo Oscuro Ready (WCAG AAA):**
   - Contraste $\ge 7:1$ entre fondo oscuro y entidades activas. Cero fondos claros que saturen el filtro CRT.

---

## 📊 Matriz de Cumplimiento de Skins

| ID / Slug               | Título                 | Clásico (Default) |      Neón       | Retro (Ámbar / Verde) | Modo Oscuro AAA |   Estado Global   | Archivo de Paleta                |
| :---------------------- | :--------------------- | :---------------: | :-------------: | :-------------------: | :-------------: | :---------------: | :------------------------------- |
| `asteroids-2084`        | ASTEROIDS 2084         |  ✅ Implementado  | ✅ Implementado |    ✅ Implementado    |   ✅ Aprobado   | ✅ 3/3 (Completo) | `asteroids-2084/skins.ts`        |
| `arkanoid-neon-revenge` | ARKANOID: NEON REVENGE |  ✅ Implementado  | ✅ Implementado |    ✅ Implementado    |   ✅ Aprobado   | ✅ 3/3 (Completo) | `arkanoid-neon-revenge/skins.ts` |
| `chrono-snake`          | CHRONO SNAKE           |   ⚠️ Hardcoded    |  ❌ Pendiente   |     ❌ Pendiente      |   ✅ Aprobado   | ⚠️ 1/3 (Parcial)  | Pendiente `skins.ts`             |
| `cyber-tetris-99`       | CYBER TETRIS 99        |  ✅ Implementado  | ✅ Implementado |    ✅ Implementado    |   ✅ Aprobado   | ✅ 3/3 (Completo) | `cyber-tetris-99/skins.ts`       |
| `space-invaders-galaxy` | SPACE INVADERS: GALAXY |    🚧 Cartucho    |   🚧 Cartucho   |      🚧 Cartucho      |     🚧 N/A      |  🚧 Próximamente  | En desarrollo                    |
| `pacman-neon-maze`      | PAC-MAN: NEON MAZE     |    🚧 Cartucho    |   🚧 Cartucho   |      🚧 Cartucho      |     🚧 N/A      |  🚧 Próximamente  | En desarrollo                    |

---

## 📌 Leyenda de Estados

- ✅ **Implementado:** El juego cuenta con soporte dinámico desacoplado y responde a la prop `skin`.
- ⚠️ **Hardcoded / Parcial:** El juego renderiza colores fijos en canvas que asemejan este estilo pero no es conmutable dinámicamente.
- ❌ **Pendiente:** El juego no cuenta aún con los assets o la paleta para este skin.
- 🚧 **Cartucho:** Ficha técnica en catálogo sin motor jugable implementado todavía.

---

## 🛠️ Comandos de Interacción con `@skin-designer`

El agente `@skin-designer` utiliza este archivo para sincronizar el progreso:

- `/skin-designer audit`: Escanea los juegos del código fuente y actualiza esta matriz.
- `/skin-designer status`: Muestra un resumen del porcentaje de cobertura de skins en la plataforma.
- `/skin-designer design <slug>`: Genera la propuesta y archivo `skins.ts` para un juego pendiente.
- `/skin-designer apply <slug>`: Refactoriza el motor Canvas del juego e integra el soporte de skins.
