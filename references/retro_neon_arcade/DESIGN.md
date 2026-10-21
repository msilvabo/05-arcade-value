---
name: Retro Neon Arcade
colors:
  surface: '#131318'
  surface-dim: '#131318'
  surface-bright: '#39383e'
  surface-container-lowest: '#0e0e13'
  surface-container-low: '#1b1b20'
  surface-container: '#1f1f25'
  surface-container-high: '#2a292f'
  surface-container-highest: '#35343a'
  on-surface: '#e4e1e9'
  on-surface-variant: '#b9caca'
  inverse-surface: '#e4e1e9'
  inverse-on-surface: '#303036'
  outline: '#849495'
  outline-variant: '#3a494a'
  surface-tint: '#00dce5'
  primary: '#e9feff'
  on-primary: '#003739'
  primary-container: '#00f5ff'
  on-primary-container: '#006c71'
  inverse-primary: '#00696e'
  secondary: '#ffb2bf'
  on-secondary: '#660028'
  secondary-container: '#ff4d80'
  on-secondary-container: '#5a0022'
  tertiary: '#fdffb5'
  on-tertiary: '#303300'
  tertiary-container: '#dee700'
  on-tertiary-container: '#616600'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#63f7ff'
  primary-fixed-dim: '#00dce5'
  on-primary-fixed: '#002021'
  on-primary-fixed-variant: '#004f53'
  secondary-fixed: '#ffd9de'
  secondary-fixed-dim: '#ffb2bf'
  on-secondary-fixed: '#3f0016'
  on-secondary-fixed-variant: '#90003b'
  tertiary-fixed: '#e3ec00'
  tertiary-fixed-dim: '#c7cf00'
  on-tertiary-fixed: '#1c1d00'
  on-tertiary-fixed-variant: '#474a00'
  background: '#131318'
  on-background: '#e4e1e9'
  surface-variant: '#35343a'
typography:
  display-lg:
    fontFamily: Space Mono
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: 0.08em
  display-lg-mobile:
    fontFamily: Space Mono
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: 0.06em
  headline-lg:
    fontFamily: Space Mono
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: 0.04em
  headline-lg-mobile:
    fontFamily: Space Mono
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: 0.04em
  headline-md:
    fontFamily: Space Mono
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: 0.03em
  title-sm:
    fontFamily: Space Mono
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 24px
    letterSpacing: 0.02em
  body-lg:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Space Mono
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 18px
    letterSpacing: 0.08em
  label-md:
    fontFamily: Space Mono
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.1em
  label-sm:
    fontFamily: Space Mono
    fontSize: 9px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.12em
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system delivers an authentic 1980s coin-op cabinet and synthwave gaming portal aesthetic. Built around deep CRT shadow, chromatic aberration, scanlines, and glowing neon vector wireframes, the interface channels tactile arcade hardware, coin slots, high-score scoreboards, and vector-raster displays.

### Visual Pillars
- **Neo-Arcade Noir**: Deep vector darkness accented by high-intensity luminescent phosphor strokes.
- **Hardware Simulation**: Curvature bezels, screen glare, chromatic fringe, and persistent horizontal scanline structures.
- **Cyber-Tactile Feedback**: Distinct step-click states, illuminated mechanical microswitches, coin-drop flashes, and high-frequency scan sweeps on interaction.
- **Localized Voice**: Spanish-language arcade terminology ("INSERTAR MONEDA", "RÉCORD", "PARTIDA", "PUNTUACIÓN MÁXIMA", "CRÉDITOS") integrated directly into HUD-level microcopy.

## Colors

The palette is tuned specifically for an emission-based, high-contrast dark room environment. The ground color `#0a0a0f` serves as pure phosphor black, preventing eye fatigue while allowing multi-stop neon blooms to project forward with intense luminescence.

### Palette Architecture
- **Phosphor Void (Neutral / `#0a0a0f`)**: Base screen matrix, chassis framing, and recessed bays. Layer tiers shift upward into `#12121d` for surface layers and `#1c1a2e` for elevated HUD panels.
- **Vector Cyan (Primary / `#00f5ff`)**: Primary active states, player 1 signals, active cabinet borders, key CTAs, and standard link interactions.
- **Laser Magenta (Secondary / `#ff006e`)**: Player 2 indicators, critical alerts, bonus unlocks, destructive acts, and secondary high-energy accents.
- **Acid Yellow (Tertiary / `#f5ff00`)**: Credit counts, coin inserts, top-tier rankings ("RÉCORD"), badges, and multiplier notifications.
- **Phosphor Text Tiers**: High-contrast white (`#f4f6ff`) for readable HUD bodies, muted CRT grey (`#727594`) for metadata and secondary labels.

## Typography

The typographic hierarchy combines structural monospaced geometry with display arcade styling. Pixel font styling (such as Press Start 2P) is reserved strictly for high-impact accents, numbers, scores, and short Spanish badges (e.g., `INSERT COIN`, `1P`, `NIVEL`), while `Space Mono` drives system headlines and HUD readouts. `JetBrains Mono` handles all paragraph copy, descriptions, and data tables to preserve legibility under CRT scanline filters.

### Implementation Rules
- **Casing**: Headings, labels, and system status indicators render in full uppercase (`text-transform: uppercase`).
- **Score Readouts**: Tabular figures with zero-padding (e.g., `0042890`) must always be enforced using monospaced features.
- **Glow Bleed**: Pixel headings apply a subtle text glow: `text-shadow: 0 0 6px currentColor, 0 0 14px currentColor`. Body text remains shadow-free to ensure legibility across lower pixel densities.

## Layout & Spacing

The viewport is constructed as a multi-tier arcade machine enclosure. The outer wrapper hosts a perspective wireframe grid vanishing toward the horizon at the lower third of the canvas, overlaid with a non-blocking pseudo-element scanline filter (`repeating-linear-gradient` with 2px rhythm) and radial CRT curvature.

### Grid & Breakpoints
- **Desktop (1024px+)**: 12-column rigid HUD grid. Canvas margins default to `margin` (2rem). Elements snap to a strict 4px/8px modular rhythm resembling segmented mechanical displays.
- **Tablet (768px – 1023px)**: 8-column fluid grid. Side margins scale to 1.5rem, gutters hold at 1rem.
- **Mobile (< 768px)**: 4-column compact stack. Margins collapse to `margin-mobile` (1rem), with critical HUD metrics (credits, volume, player) docked into a sticky bottom status bar.
- **Bezel Inset**: Primary content blocks sit inside an inner frame mimicking a recessed CRT glass enclosure with corner brackets and hardware rivets.

## Elevation & Depth

Depth is established through luminous neon radiation and hardware layer offsets rather than diffuse real-world dropshadows.

### Layering Model
1. **Background Horizon (Level 0)**: `#0a0a0f` void containing neon synthwave grid lines drawn with 1px semi-transparent cyan strokes (`rgba(0, 245, 255, 0.15)`).
2. **Scanline Matrix (Overlay)**: Fixed position CRT scanline shader with subtle vignette darkening toward viewport edges.
3. **Chassis Panels (Level 1)**: Flat surface `#12121d` surrounded by 1px solid borders in `#1c1a2e` or muted cyan (`rgba(0, 245, 255, 0.3)`).
4. **Active HUD Cards (Level 2)**: Elevated `#161626` surfaces with 1.5px glowing borders: `box-shadow: inset 0 0 12px rgba(0, 245, 255, 0.1), 0 0 15px rgba(0, 245, 255, 0.35)`.
5. **Interactive / Modal Overlays (Level 3)**: Deep `#0d0d16` with full neon perimeter glows (Magenta `#ff006e` or Acid Yellow `#f5ff00` depending on urgency) accompanied by phosphor flicker animations.

## Shapes

The design system enforces a strict zero-radius geometric architecture (`roundedness: 0`). Curved edges run counter to classic coin-op cabinet architecture and low-resolution raster monitors.

### Architectural Geometry
- **Corners**: Pure 90-degree angular junctions or 45-degree chamfered cuts (beveled corners created using `clip-path: polygon(...)`).
- **Chamfers**: Interactive containers and cabinet badges feature an 8px diagonal chamfer at top-right and bottom-left vertices.
- **Borders**: Sharp 1px to 2px solid lines. Dotted or dashed lines are reserved exclusively for divider telemetry rails and "INSERTAR MONEDA" target boundaries.

## Components

### Buttons & Arcade Push-Triggers
- **Primary ("JUGAR AHORA" / "INSERT COIN")**: Full-width or inline block with 2px solid `#00f5ff`, background in `rgba(0, 245, 255, 0.08)`, text in `#00f5ff`. Outer glow: `0 0 12px rgba(0, 245, 255, 0.5)`. Hover fills background with solid `#00f5ff`, switching text to `#0a0a0f` with an intense halo. Active state triggers a 1px downward translation mimicking physical microswitch engagement.
- **Secondary / Action ("CONFIGURAR", "TABLA DE RÉCORDS")**: Border in `#ff006e`, text in `#ff006e`. Hover transitions to solid magenta fill with white text.
- **Tertiary ("CRÉDITOS: 02")**: Outlined in `#f5ff00` with subtle breathing neon pulse animation (`opacity: 0.85` to `1`).

### HUD Cards (Cabinet Game Card)
- **Container**: Sharp rectangular container with 1px border `rgba(0, 245, 255, 0.25)`.
- **Thumbnail Display**: Game preview wrapped in a recessed frame with scanline simulation overlay and a chromatic split effect on hover.
- **Header Badge**: Top-anchored pill/chamfered tag rendering genre and player format (e.g., `ARCADE // 2P`) set in `Space Mono` 10px uppercase.
- **Footer**: Integrated telemetry row with release year, current high score ("RÉCORD"), and coin cost.

### Chips & Retro Badges
- High-contrast segmented tags with 1px solid borders.
- States:
  - *New / Nuevo*: Solid `#ff006e` fill, text `#ffffff`.
  - *Jackpot / Récord*: Outlined in `#f5ff00`, text `#f5ff00`, flanked by bracket glyphs `[ RÉCORD ]`.
  - *Status Online*: Pulsing 6px cyan phosphor dot beside uppercase label.

### Input Fields & Search Bars
- Background in deep `#0a0a0f`, bottom-only or full 1px border in `rgba(244, 246, 255, 0.2)`.
- Focus shifts border to `#00f5ff` with a glowing bottom line accent and a blinking green/cyan terminal block cursor (`█`).
- Placeholder styled in muted monospace uppercase (`BUSCAR TÍTULO O CATEGORÍA...`).

### Lists & Leaderboards ("TABLA DE CLASIFICACIÓN")
- Alternating zebra rows using `#0a0a0f` and `#12121d`.
- Position column formatted as `01`, `02`, `03` in `#f5ff00`.
- Player name in `#ffffff` monospaced characters.
- High-score digits zero-padded (`00985200`) in `#00f5ff` right-aligned.
- Dividers styled as 1px dashed horizontal rails (`rgba(255, 255, 255, 0.1)`).

### Toggle & Checkboxes
- **Checkbox**: Square 16x16px frame with sharp corners. Unchecked: 1px border `#727594`. Checked: 2px border `#00f5ff`, filled with an inner solid cyan square or pixelated `X` mark with glow.
- **Toggle**: Segmented binary HUD selector (`[ NO ] / [ SÍ ]`) where the active state lights up with neon background fill and inverted text.