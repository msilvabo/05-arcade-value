# Arcade Vault — Backlog de Sugerencias de Juegos Arcade

> **Fuente de Verdad del Catálogo y Planificación de Juegos**  
> Gestionado y actualizado automáticamente por el agente curador [`/game-planner`](file:///C:/learning/Fermando%20Herrera/ia/claudeCode/05-arcade-value/.agents/skills/game-planner/SKILL.md).

---

## 🕹️ Leyenda de Estados

- `[x]` **Implementado:** Completamente desarrollado, con canvas funcional dentro de la cabina CRT y récords en Leaderboard.
- `[/]` **En Desarrollo / En Catálogo:** Cartucho visible en la biblioteca y launcher, con canvas o especificación técnica en progreso.
- `[ ]` **Sugerido / Aprobado:** Evaluado y aceptado por `/game-planner`, listo para iniciar especificación técnica (`/arcade-game`).
- `[~]` **Descartado / Pospuesto:** No viable en el momento actual o aplazado (ver notas de justificación).

---

## 🎮 1. Catálogo Existente de la Plataforma

| Estado | Título                     | Slug Canónico           | Categoría / Género             | Especificación / Referencia                                                                                                                |
| :----: | :------------------------- | :---------------------- | :----------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
|  [x]   | **Arkanoid: Neon Revenge** | `arkanoid-neon-revenge` | _Ladrillos / Breakout_         | [Spec 08](file:///C:/learning/Fermando%20Herrera/ia/claudeCode/05-arcade-value/specs/08-adaptacion-arkanoid.md)                            |
|  [x]   | **Asteroids 2084**         | `asteroids-2084`        | _Vector Shooter 2D_            | [Spec 06](file:///C:/learning/Fermando%20Herrera/ia/claudeCode/05-arcade-value/specs/06-adaptacion-juego-asteroids.md)                     |
|  [x]   | **Cyber Tetris 99**        | `cyber-tetris-99`       | _Puzzle / Bloques en caída_    | [app/games/_games/cyber-tetris-99](file:///C:/learning/Fermando%20Herrera/ia/claudeCode/05-arcade-value/app/games/_games/cyber-tetris-99/) |
|  [x]   | **Chrono Snake**           | `chrono-snake`          | _Snake / Time Attack_          | [Spec 09](file:///C:/learning/Fermando%20Herrera/ia/claudeCode/05-arcade-value/specs/09-creacion-chrono-snake.md)                          |
|  [/]   | **Pacman Neon Maze**       | `pacman-neon-maze`      | _Laberinto / Dots & Fantasmas_ | Cartucho en catálogo (Canvas en desarrollo)                                                                                                |
|  [/]   | **Space Invaders Galaxy**  | `space-invaders-galaxy` | _Fixed Space Shooter_          | Cartucho en catálogo (Canvas en desarrollo)                                                                                                |

---

## 💡 2. Backlog de Nuevas Sugerencias de `/game-planner`

- [ ] **Cyber Frogger: Protocol Override** (`cyber-frogger`)
  - **Categoría:** _Crossing / Grid Hop / Reflejos Arcade_
  - **Inspiración:** _Frogger (1981)_ con giro temático Cyberpunk / Synthwave.
  - **Premisa:** Un dron de datos (`Cyber-Frog`) debe atravesar autopistas de tráfico de paquetes corruptos y firewalls láser, para luego saltar sobre bloques flotantes de memoria RAM y corrientes de sobrecarga térmica hasta penetrar los 5 nodos maestros del servidor.
  - **Afinidad CRT / Cabina:** Canvas 800x600 (4:3), cuadrícula 40x40 px, 3 vidas, progresión de niveles por ciclo de 5 nodos, integración nativa con `CabinetGameProps`.
  - **Puntuación de Curaduría:** 9.6/10 (Cubre el vacío de juego de timing y salto por celdas).
  - **Comando Hand-off:** `/arcade-game create cyber-frogger`

- [ ] **Bubble Core: Cyber Overload** (`bubble-core-overload`)
  - **Categoría:** _Puzzle de Reflejos / Proyección y Match-3_
  - **Inspiración:** _Puzzle Bobble / Bust-a-Move (1994)_.
  - **Premisa:** Proyector de fotones basculante que dispara esferas de sub-red neón hacia una masa colgante descendente. Agrupar 3 o más colores idénticos colapsa el racimo y desprende las esferas satélite en una cascada de bonus.
  - **Afinidad CRT / Cabina:** Canvas 800x600 (4:3), 3 núcleos de repuesto, multiplicadores de caída en cadena, controles angulares precisos con teclado.
  - **Puntuación de Curaduría:** 9.5/10 (Aporta el género puzzle-shooter ausente en el catálogo).
  - **Comando Hand-off:** `/arcade-game create bubble-core-overload`

- [ ] **Grid Rampart: Firewall Defense** (`grid-rampart`)
  - **Categoría:** _Defensa de Bases / Construcción Táctica y Bombardeo_
  - **Inspiración:** _Rampart (1990)_.
  - **Premisa:** Tensión por turnos dividida en bombardeo de cañones EMP contra naves invasoras, fase de reconstrucción rápida con bloques tipo tetramino para sellar el perímetro del mainframe y despliegue de armamento en territorio asegurado.
  - **Afinidad CRT / Cabina:** Canvas 800x600, 3 vidas de mainframe, controles de retícula y rotación de módulos defensivos con barra espaciadora.
  - **Puntuación de Curaduría:** 9.4/10 (Fusión única de puzzle de colocación y reflejos de artillería).
  - **Comando Hand-off:** `/arcade-game create grid-rampart`

- [ ] **Neon Cycles: Grid Wars** (`neon-cycles`)
  - **Categoría:** _Combate de Ciclos / Reflejos y Bloqueo Territorial_
  - **Inspiración:** _Tron Light Cycles (1982)_.
  - **Premisa:** Duelo de motos de luz cibernéticas a hipervelocidad en una arena holográfica. Dejan estelas de plasma impenetrable para acorralar a IAs hostiles, con mecánicas de Overclock Nitro de alto riesgo.
  - **Afinidad CRT / Cabina:** Canvas 800x600, 3 vidas/rondas, aceleración continua con giros en 90° e impacto visual óptimo con resplandor CRT y scanlines.
  - **Puntuación de Curaduría:** 9.7/10 (Estética cyberpunk nativa y partidas intensas de 60-90 segundos).
  - **Comando Hand-off:** `/arcade-game create neon-cycles`

- [ ] **Cyber Saboteur: Bomb Jack** (`cyber-saboteur`)
  - **Categoría:** _Plataformas de Pantalla Fija / Acrobacia y Sabotaje_
  - **Inspiración:** _Bomb Jack (1984)_.
  - **Premisa:** Un saboteador cibernético debe desactivar 24 núcleos de datos inestables en pantallas fijas de arquitectura retro-futurista, encadenando bombas activas con mecha de plasma mientras planea con micro-propulsores esquivando drones centinela.
  - **Afinidad CRT / Cabina:** Canvas 800x600, 3 vidas, saltos con sustentación gravitatoria y multiplicadores masivos de puntos por secuencia ordenada.
  - **Puntuación de Curaduría:** 9.3/10 (Acción plataformera de alta velocidad sin scroll horizontal).
  - **Comando Hand-off:** `/arcade-game create cyber-saboteur`

- [ ] **Vector Marble: Quantum Drift** (`vector-marble`)
  - **Categoría:** _Carrera de Precisión Isométrica / Física e Inercia_
  - **Inspiración:** _Marble Madness (1984)_.
  - **Premisa:** Descenso a tumba abierta de una esfera de energía cuántica por pistas isométricas vectoriales en wireframe neón. Sortear desniveles, trampas de vacío y rampas contra un cronómetro implacable acumulativo.
  - **Afinidad CRT / Cabina:** Canvas 800x600, 3 núcleos cuánticos, simulación 2.5D de inercia y fricción, controles de impulso direccional y freno magnético.
  - **Puntuación de Curaduría:** 9.1/10 (Gran contraste cinético y estético con vectores de fósforo).
  - **Comando Hand-off:** `/arcade-game create vector-marble`

- [ ] **Neon Kong: MegaCorp Ascent** (`neon-kong`)
  - **Categoría:** _Single-Screen Platformer / Vertical Climb_
  - **Inspiración:** _Donkey Kong (1981)_ con giro Cyberpunk / Megacorporación rebelde.
  - **Premisa:** Un netrunner escala los andamios exteriores de una supertorre corporativa repleta de vigas láser, escaleras de servicio y barriles de desecho de plasma arrojados desde la azotea por un robot industrial defectuoso (Cyber-Ape MK-IV) para rescatar una IA cautiva.
  - **Afinidad CRT / Cabina:** Canvas 800x600 (4:3), 3 vidas, vigas en pendiente con física de gravedad y salto de timing, desensamblador EMP temporal (martillo), niveles de vigas/elevadores/remaches.
  - **Puntuación de Curaduría:** 9.4/10.
  - **Comando Hand-off:** `/arcade-game create neon-kong`

- [ ] **Lunar Lander 2099: Neon Descent** (`cyber-lander`)
  - **Categoría:** _Vector Lunar Gravity / Precision Flight_
  - **Inspiración:** _Lunar Lander (1979)_ y _Thrust (1986)_.
  - **Premisa:** Un módulo de descenso táctico en cañones escarpados de Titán debe maniobrar con empuje vectorial inercial y reserva limitada de combustible, lidiando con gravedad y túneles térmicos para posarse suavemente en plataformas de recarga con multiplicadores de riesgo.
  - **Afinidad CRT / Cabina:** Canvas 800x600 (4:3), física vectorial 2D pura (inercia, gravedad, aceleración de tobera), HUD desacoplado para combustible y velocidad vertical/horizontal, 3 vidas, multiplicadores 2x a 10x.
  - **Puntuación de Curaduría:** 9.7/10.
  - **Comando Hand-off:** `/arcade-game create cyber-lander`

- [ ] **Dig Dug Neon: Sub-Grid Protocol** (`cyber-digger`)
  - **Categoría:** _Excavation / Tunneling & Traps_
  - **Inspiración:** _Dig Dug (1982)_ y _Boulder Dash (1984)_.
  - **Premisa:** Un dron perforador subterráneo crea túneles libres en una matriz de silicio contaminada para purgar virus glitch mediante un cable inyector de sobrecarga de datos, mientras desaloja bloques de memoria pesados para aplastar enemigos en caída libre.
  - **Afinidad CRT / Cabina:** Canvas 800x600 (grid de 20x15 celdas de 40x40), 3 vidas, excavación continua del terreno, física de gravedad para rocas suspendidas, 3 vidas, combos de eliminación.
  - **Puntuación de Curaduría:** 9.5/10.
  - **Comando Hand-off:** `/arcade-game create cyber-digger`

- [ ] **Cyber Joust: Neon Riders** (`cyber-joust`)
  - **Categoría:** _Aerial Physics / Platform Combat_
  - **Inspiración:** _Joust (1982)_.
  - **Premisa:** Jinetes cibernéticos sobre bio-monturas mecánicas propulsadas por turbinas iónicas combaten en una arena aérea cerrada sobre un foso de refrigerante ardiente. La altitud relativa en el choque define la victoria y los enemigos caídos se transforman en orbes de datos que eclosionan si no son recolectados.
  - **Afinidad CRT / Cabina:** Canvas 800x600 (pantalla fija con wrap-around en extremos laterales), flapping de alas con barra espaciadora, inercia aérea y colisiones con plataformas, 3 vidas, oleadas crecientes con IA hostil.
  - **Puntuación de Curaduría:** 9.3/10.
  - **Comando Hand-off:** `/arcade-game create cyber-joust`

- [ ] **Q-Byte: Neon Pyramid** (`q-byte`)
  - **Categoría:** _Isometric Platform / Tile Coloring Puzzle_
  - **Inspiración:** _Q\*bert (1982)_.
  - **Premisa:** Un subproceso cuántico debe saltar diagonalmente a lo largo de una estructura piramidal isométrica de 28 cubos cuánticos para reconfigurar sus frecuencias lumínicas, mientras esquiva malware en espiral (Coily.exe) y utiliza discos de transporte óptico para escapar de callejones sin salida.
  - **Afinidad CRT / Cabina:** Canvas 800x600 (proyección isométrica matemática sin librerías 3D pesadas), movimiento diagonal por teclado, 3 vidas (caer al vacío cuesta vida), puntuación por cubo alterado y discos restantes.
  - **Puntuación de Curaduría:** 9.1/10.
  - **Comando Hand-off:** `/arcade-game create q-byte`

- [ ] **Galactic Rogue: Neon Swarm** (`galactic-neon-swarm`)
  - **Categoría:** _Fixed Swarm Shooter / Shmup de Formación_
  - **Inspiración:** _Galaga (1981)_ / _Gaplus_
  - **Premisa:** Drones centinelas alienígenas entran en formación coreografiada de neón y realizan picados kamikaze con estelas luminosas y rayos tractores de captura de datos. Rescatar la nave capturada desbloquea el modo _Twin Rig_ con doble disparo láser. Incluye oleadas de desafío (_Challenging Stages_).
  - **Afinidad CRT / Cabina:** Canvas 800x600, 3 vidas, movimiento horizontal suave en base con disparo vertical continuo, compatible con `CabinetGameProps`.
  - **Puntuación de Curaduría:** 9.7/10.
  - **Comando Hand-off:** `/arcade-game create galactic-neon-swarm`

- [ ] **Grid Defense: Cyber Command** (`grid-cyber-command`)
  - **Categoría:** _Tactical Point-Defense / Balística Antiaérea_
  - **Inspiración:** _Missile Command (1980)_
  - **Premisa:** Defiende 6 reactores de energía de Neo-Sector 7 ante lluvias balísticas de pulsos EMP y satélites kamikaze. El jugador dirige 3 baterías defensivas disparando ondas expansivas de plasma que interceptan y destruyen amenazas en cadena.
  - **Afinidad CRT / Cabina:** Canvas 800x600, 6 sectores urbanos como salud general, retícula de teclado ágil con 3 disparadores independientes (o disparo contextual asistido), cálculo de bonificación por reactores intactos y munición.
  - **Puntuación de Curaduría:** 9.2/10.
  - **Comando Hand-off:** `/arcade-game create grid-cyber-command`

- [ ] **Cyberpede: Worm Protocol** (`cyberpede-protocol`)
  - **Categoría:** _Segmented Grid Blaster / Defensor de Cuadrícula_
  - **Inspiración:** _Centipede (1981)_ / _Millipede_
  - **Premisa:** Un gusano de código malicioso desciende serpenteando a través de un bosque de nodos firewall de neón. Cada impacto fragmenta el gusano en sub-unidades autónomas más rápidas. Drones antivirus erráticos y bugs de caída vertical añaden caos en el sector bajo.
  - **Afinidad CRT / Cabina:** Canvas 800x600, 3 vidas, movimiento libre en cuadrícula limitada al tercio inferior, cadencia de fuego rápida, audio de clics sintéticos y explosiones de píxeles neón.
  - **Puntuación de Curaduría:** 9.5/10.
  - **Comando Hand-off:** `/arcade-game create cyberpede-protocol`

- [ ] **Neon Defender: Data Patrol** (`neon-data-patrol`)
  - **Categoría:** _Bi-directional Horizontal Shmup / Radar & Rescue_
  - **Inspiración:** _Defender (1981)_
  - **Premisa:** Patrulla un cilindro planetario en scroll horizontal continuo infinito con radar superior. Protege cápsulas de datos en la superficie de abductores alienígenas; salva cápsulas en caída libre para obtener bonos masivos y usa bombas inteligentes cuánticas para despejar la pantalla.
  - **Afinidad CRT / Cabina:** Canvas 800x600, 3 vidas, radar HUD integrado en cabina, inercia de propulsión y viraje instantáneo, 1 Smart Bomb por nivel.
  - **Puntuación de Curaduría:** 9.4/10.
  - **Comando Hand-off:** `/arcade-game create neon-data-patrol`

- [ ] **Tempest Vortex: Vector Storm** (`tempest-vector-storm`)
  - **Categoría:** _Rotary Tube Shooter / Geometric Vector Blaster_
  - **Inspiración:** _Tempest (1981)_
  - **Premisa:** Combate en el borde perimetral de túneles geométricos vectoriales brillantes. Desplázate por los carriles exteriores disparando hacia el núcleo del vórtice contra parásitos y flippers que escalan hacia tu posición. Incluye habilidad de pánico _Superzapper_ de pulso perimetral.
  - **Afinidad CRT / Cabina:** Canvas 800x600, proyección vectorial alámbrica 2D fluida a 60 FPS, 3 vidas, túneles con geometrías rotativas por nivel, efectos glow intensos.
  - **Puntuación de Curaduría:** 9.6/10.
  - **Comando Hand-off:** `/arcade-game create tempest-vector-storm`

- [ ] **Neon Drift: Sunset Overdrive** (`neon-drift-outrun`)
  - **Categoría:** _Pseudo-3D Highway Racer / Time Attack_
  - **Inspiración:** _OutRun (1986)_ y _Rad Racer_.
  - **Premisa:** Conducción pseudo-3D por bandas de carretera rasterizadas hacia un sol gigante synthwave en el horizonte. Bifurcación clásica de caminos, esquiva de tráfico a altas velocidades y selector de pistas de música FM Synth.
  - **Afinidad CRT / Cabina:** Canvas 800x600 (4:3), temporizador de checkpoints (+45s por arco), derrapes y cambio de marchas (`Low / High Gear`).
  - **Puntuación de Curaduría:** 9.8/10.
  - **Comando Hand-off:** `/arcade-game create neon-drift-outrun`

- [ ] **Cyber Hunter '88: Highway Override** (`cyber-hunter-88`)
  - **Categoría:** _Top-Down Combat Racer / Persecución Vertical_
  - **Inspiración:** _Spy Hunter (1983)_ y _Road Blasters_.
  - **Premisa:** Interceptor blindado en scroll vertical continuo sobre autopistas corporativas. Disparo frontal de plasma, cortinas de pulso EMP traseras y acople en marcha a furgones aliados para recarga de munición pesada y blindaje.
  - **Afinidad CRT / Cabina:** Canvas 800x600, 3 vidas / blindaje, derrapes por manchas de combustible y puntuación por distancia y destrucción.
  - **Puntuación de Curaduría:** 9.7/10.
  - **Comando Hand-off:** `/arcade-game create cyber-hunter-88`

- [ ] **Plasma Arena: Cyber Disc 2099** (`plasma-pong-arena`)
  - **Categoría:** _Arcade Retro Sports / Cyber Hockey_
  - **Inspiración:** _Pong (1972)_, _Windjammers (1994)_ y _Discs of Tron_.
  - **Premisa:** Arena octogonal cerrada con parachoques de neón donde un androide defensivo lanza un disco de plasma comprimido, curvando trayectorias con tiros cortados y acumulando multiplicadores de rebote contra rivales de IA creciente.
  - **Afinidad CRT / Cabina:** Canvas 800x600, formato al mejor de 3 sets (5 puntos por set), 3 vidas en torneo y efectos de estela de partículas.
  - **Puntuación de Curaduría:** 9.5/10.
  - **Comando Hand-off:** `/arcade-game create plasma-pong-arena`

- [ ] **Micro Circuit: Silicon Overdrive** (`micro-circuit-overdrive`)
  - **Categoría:** _Top-Down Track Racer / Drift & Maneuver_
  - **Inspiración:** _Micro Machines (1991)_ y _Super Off Road_.
  - **Premisa:** Carreras de micro-aerodeslizadores sobre placas madre (PCB), tarjetas gráficas y chips de silicio. Curvas entre condensadores, charcos de pasta térmica y turbulencias de ventiladores con impulso nitro recargable.
  - **Afinidad CRT / Cabina:** Canvas 800x600, 3 intentos de carrera, física de derrape vectorial y avance de nivel finalizando en el Top 3.
  - **Puntuación de Curaduría:** 9.4/10.
  - **Comando Hand-off:** `/arcade-game create micro-circuit-overdrive`

- [ ] **Cyber Courier: Night City Express** (`cyber-courier-run`)
  - **Categoría:** _Isometric/Oblique Urban Pursuit & Delivery_
  - **Inspiración:** _Paperboy (1984)_ y _City Connection_.
  - **Premisa:** Mensajero rebelde en hover-bike en scroll diagonal continuo que arroja datadiscos encriptados a buzones de clientes suscriptores esquivando drones corporativos, cables caídos y baches electromagnéticos.
  - **Afinidad CRT / Cabina:** Canvas 800x600, 3 contratos/vidas, progresión semanal (Lunes a Viernes), bonos por clientes mantenidos.
  - **Puntuación de Curaduría:** 9.3/10.
  - **Comando Hand-off:** `/arcade-game create cyber-courier-run`

---

## 📊 3. Resumen de Diversidad de Géneros

- **Cubiertos (Jugables):** 4 (Ladrillos, Vectorial Espacial, Puzzle Bloques, Snake Temporal)
- **En Progreso:** 2 (Laberinto Come-Cocos, Shooter Galáctico Fijo)
- **En Backlog Aprobado `/game-planner`:** 21 propuestas completas categorizadas en 4 cuadrantes (Crossing, Shooters, Plataformas/Físicas, Carreras/Deportes y Puzzles/Reflejos).
