"use client";

import React, { FC, useEffect, useRef, useCallback } from "react";
import { CabinetGameProps } from "../../_lib/types";
import { getCyberFroggerSkinPalette } from "./skins";
import { ParticlePool } from "@/lib/performance/particle-pool";

// Dimensiones de cuadrícula según Spec GJ-01
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const GRID_COLS = 20;
const GRID_ROWS = 15;
const CELL_SIZE = 40;

const ROUND_TIME_INITIAL = 45; // 45 segundos por vida
const DASH_COOLDOWN_TIME = 4.0; // 4 segundos de recarga
const JUMP_DURATION_SEC = 0.12; // 120 ms por salto
const INVULNERABLE_DURATION_SEC = 0.2; // 200 ms de invulnerabilidad de dash

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export type HazardType =
  | "PACKET_FAST"
  | "TROJAN_TRUCK"
  | "DDOS_CLUSTER"
  | "FIREWALL_LASER"
  | "GLITCH_RUNNER";

export interface HighwayHazardEntity {
  id: string;
  row: number; // 8 a 12
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  type: HazardType;
  laserActiveTimer?: number;
  laserIsOn?: boolean;
}

export type PlatformType = "RAM_BLOCK" | "DATA_BUS" | "HEAT_SINK";

export interface FloatingPlatformEntity {
  id: string;
  row: number; // 2 a 6
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  type: PlatformType;
  submerged?: boolean;
  submergeCycleTimer?: number;
}

export interface MasterNodeEntity {
  id: number; // 0 a 4
  col: number; // 2, 6, 10, 14, 18
  x: number;
  y: number;
  width: number;
  height: number;
  penetrated: boolean;
  hasBonusBug: boolean;
  bonusTimer: number;
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

export interface CyberFrogEntity {
  col: number;
  row: number;
  visualX: number;
  visualY: number;
  startJumpX: number;
  startJumpY: number;
  targetJumpX: number;
  targetJumpY: number;
  isJumping: boolean;
  jumpProgress: number;
  direction: Direction;
  isInvulnerable: boolean;
  invulnerableTimer: number;
  dashCooldown: number;
  maxRowReached: number;
  attachedToPlatformId: string | null;
  dead: boolean;
  respawnTimer: number;
}

const CyberFroggerActionGameComponent: FC<CabinetGameProps> = ({
  isPaused,
  onScoreIncrement,
  onScoreChange,
  onLivesChange,
  onLevelChange,
  onGameOver,
  restartSignal,
  skin = "clasico",
  retroVariant = "amber",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Paleta dinámica resuelta O(1)
  const paletteRef = useRef(getCyberFroggerSkinPalette(skin, retroVariant));

  const renderStaticBackground = useCallback(() => {
    let bg = bgCanvasRef.current;
    if (!bg) {
      bg = document.createElement("canvas");
      bg.width = CANVAS_WIDTH;
      bg.height = CANVAS_HEIGHT;
      bgCanvasRef.current = bg;
    }
    const bgCtx = bg.getContext("2d");
    if (!bgCtx) return;

    const pal = paletteRef.current;
    bgCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Fondo base oscuro
    bgCtx.fillStyle = pal.background;
    bgCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // --- ZONA 1: Socket de Inicio (Filas 13 a 14) ---
    bgCtx.fillStyle = pal.zones.startSocket.fill;
    bgCtx.fillRect(0, 13 * CELL_SIZE, CANVAS_WIDTH, 2 * CELL_SIZE);
    bgCtx.strokeStyle = pal.zones.startSocket.gridStroke;
    bgCtx.lineWidth = 1;
    for (let c = 0; c < GRID_COLS; c++) {
      bgCtx.strokeRect(c * CELL_SIZE, 13 * CELL_SIZE, CELL_SIZE, 2 * CELL_SIZE);
    }

    // --- ZONA 2: Autopista de Datos (Filas 8 a 12) ---
    bgCtx.fillStyle = pal.zones.highway.fill;
    bgCtx.fillRect(0, 8 * CELL_SIZE, CANVAS_WIDTH, 5 * CELL_SIZE);

    bgCtx.strokeStyle = pal.zones.highway.laneLine;
    bgCtx.lineWidth = 1;
    bgCtx.setLineDash([8, 8]);
    for (let r = 9; r <= 12; r++) {
      bgCtx.beginPath();
      bgCtx.moveTo(0, r * CELL_SIZE);
      bgCtx.lineTo(CANVAS_WIDTH, r * CELL_SIZE);
      bgCtx.stroke();
    }
    bgCtx.setLineDash([]);

    // --- ZONA 3: Buffer Cache Safe Zone (Fila 7) ---
    bgCtx.fillStyle = pal.zones.bufferZone.fill;
    bgCtx.fillRect(0, 7 * CELL_SIZE, CANVAS_WIDTH, CELL_SIZE);
    bgCtx.strokeStyle = pal.zones.bufferZone.border;
    bgCtx.lineWidth = 2;
    bgCtx.strokeRect(0, 7 * CELL_SIZE, CANVAS_WIDTH, CELL_SIZE);

    // --- ZONA 5: Core Bus Link (Fila 1) ---
    bgCtx.fillStyle = pal.zones.coreBus.fill;
    bgCtx.fillRect(0, CELL_SIZE, CANVAS_WIDTH, CELL_SIZE);
    bgCtx.strokeStyle = pal.zones.coreBus.border;
    bgCtx.lineWidth = 1.5;
    bgCtx.strokeRect(0, CELL_SIZE, CANVAS_WIDTH, CELL_SIZE);
  }, []);

  useEffect(() => {
    paletteRef.current = getCyberFroggerSkinPalette(skin, retroVariant);
    renderStaticBackground();
  }, [skin, retroVariant, renderStaticBackground]);

  // Referencias a callbacks para invocar dentro del loop sin recrear listeners
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const levelRef = useRef(1);
  const gameOverRef = useRef(false);

  const callbacksRef = useRef({
    onScoreIncrement,
    onScoreChange,
    onLivesChange,
    onLevelChange,
    onGameOver,
  });

  useEffect(() => {
    callbacksRef.current = {
      onScoreIncrement,
      onScoreChange,
      onLivesChange,
      onLevelChange,
      onGameOver,
    };
  });

  // Estado del motor
  const frogRef = useRef<CyberFrogEntity>({
    col: 10,
    row: 14,
    visualX: 10 * CELL_SIZE + CELL_SIZE / 2,
    visualY: 14 * CELL_SIZE + CELL_SIZE / 2,
    startJumpX: 10 * CELL_SIZE + CELL_SIZE / 2,
    startJumpY: 14 * CELL_SIZE + CELL_SIZE / 2,
    targetJumpX: 10 * CELL_SIZE + CELL_SIZE / 2,
    targetJumpY: 14 * CELL_SIZE + CELL_SIZE / 2,
    isJumping: false,
    jumpProgress: 0,
    direction: "UP",
    isInvulnerable: false,
    invulnerableTimer: 0,
    dashCooldown: 0,
    maxRowReached: 14,
    attachedToPlatformId: null,
    dead: false,
    respawnTimer: 0,
  });

  const hazardsRef = useRef<HighwayHazardEntity[]>([]);
  const platformsRef = useRef<FloatingPlatformEntity[]>([]);
  const nodesRef = useRef<MasterNodeEntity[]>([]);
  const particlePoolRef = useRef(new ParticlePool(250));
  const roundTimerRef = useRef(ROUND_TIME_INITIAL);
  const nodesPenetratedRef = useRef(0);
  const keysPressedRef = useRef<{ [k: string]: boolean }>({});

  // Generador de Nodos Maestros (Bahías en cols 2, 6, 10, 14, 18)
  const initNodes = () => {
    const cols = [2, 6, 10, 14, 18];
    const nodes: MasterNodeEntity[] = cols.map((col, index) => ({
      id: index,
      col,
      x: col * CELL_SIZE,
      y: 0,
      width: CELL_SIZE,
      height: CELL_SIZE,
      penetrated: false,
      hasBonusBug: false,
      bonusTimer: 0,
    }));
    nodesRef.current = nodes;
    nodesPenetratedRef.current = 0;
  };

  // Generador de tráfico y plataformas según nivel
  const initEntities = (lvl: number) => {
    const speedMult = 1 + (lvl - 1) * 0.12;

    // Obstáculos de Autopista (Filas 8 a 12)
    const hazards: HighwayHazardEntity[] = [];

    // Fila 12: Paquetes rápidos vx = -180
    for (let i = 0; i < 4; i++) {
      hazards.push({
        id: `h-12-${i}`,
        row: 12,
        x: i * 220,
        y: 12 * CELL_SIZE + 4,
        width: 48,
        height: 32,
        vx: -180 * speedMult,
        type: "PACKET_FAST",
      });
    }

    // Fila 11: Camiones Troyanos vx = +90 (120 px de longitud)
    for (let i = 0; i < 3; i++) {
      hazards.push({
        id: `h-11-${i}`,
        row: 11,
        x: i * 320,
        y: 11 * CELL_SIZE + 4,
        width: 120,
        height: 32,
        vx: 90 * speedMult,
        type: "TROJAN_TRUCK",
      });
    }

    // Fila 10: Láseres y glitch vx = -120 (pulsante)
    for (let i = 0; i < 3; i++) {
      hazards.push({
        id: `h-10-${i}`,
        row: 10,
        x: i * 280,
        y: 10 * CELL_SIZE + 4,
        width: 60,
        height: 32,
        vx: -120 * speedMult,
        type: "FIREWALL_LASER",
        laserActiveTimer: i * 0.8,
        laserIsOn: true,
      });
    }

    // Fila 9: Ráfagas DDoS vx = +140
    for (let i = 0; i < 4; i++) {
      hazards.push({
        id: `h-9-${i}`,
        row: 9,
        x: i * 230,
        y: 9 * CELL_SIZE + 4,
        width: 50,
        height: 32,
        vx: 140 * speedMult,
        type: "DDOS_CLUSTER",
      });
    }

    // Fila 8: Glitch runners vx = -160
    for (let i = 0; i < 3; i++) {
      hazards.push({
        id: `h-8-${i}`,
        row: 8,
        x: i * 300,
        y: 8 * CELL_SIZE + 4,
        width: 64,
        height: 32,
        vx: -160 * speedMult,
        type: "GLITCH_RUNNER",
      });
    }

    hazardsRef.current = hazards;

    // Plataformas flotantes sobre refrigerante (Filas 2 a 6)
    const platforms: FloatingPlatformEntity[] = [];

    // Fila 6: RAM Blocks vx = +100 (120 px)
    for (let i = 0; i < 3; i++) {
      platforms.push({
        id: `p-6-${i}`,
        row: 6,
        x: i * 300,
        y: 6 * CELL_SIZE + 2,
        width: 120,
        height: 36,
        vx: 100 * speedMult,
        type: "RAM_BLOCK",
      });
    }

    // Fila 5: Data Buses vx = -130 (160 px)
    for (let i = 0; i < 3; i++) {
      platforms.push({
        id: `p-5-${i}`,
        row: 5,
        x: i * 330,
        y: 5 * CELL_SIZE + 2,
        width: 160,
        height: 36,
        vx: -130 * speedMult,
        type: "DATA_BUS",
      });
    }

    // Fila 4: Heat Sinks sumergibles vx = +80 (110 px)
    for (let i = 0; i < 3; i++) {
      platforms.push({
        id: `p-4-${i}`,
        row: 4,
        x: i * 290,
        y: 4 * CELL_SIZE + 2,
        width: 110,
        height: 36,
        vx: 80 * speedMult,
        type: "HEAT_SINK",
        submerged: false,
        submergeCycleTimer: i * 1.2,
      });
    }

    // Fila 3: RAM Blocks pequeños vx = -110 (90 px)
    for (let i = 0; i < 4; i++) {
      platforms.push({
        id: `p-3-${i}`,
        row: 3,
        x: i * 240,
        y: 3 * CELL_SIZE + 2,
        width: 90,
        height: 36,
        vx: -110 * speedMult,
        type: "RAM_BLOCK",
      });
    }

    // Fila 2: Data Buses rápidos vx = +150 (110 px)
    for (let i = 0; i < 3; i++) {
      platforms.push({
        id: `p-2-${i}`,
        row: 2,
        x: i * 320,
        y: 2 * CELL_SIZE + 2,
        width: 110,
        height: 36,
        vx: 150 * speedMult,
        type: "DATA_BUS",
      });
    }

    platformsRef.current = platforms;
  };

  // Reaparición del dron en socket inicial
  const spawnFrog = (fullReset: boolean) => {
    frogRef.current = {
      col: 10,
      row: 14,
      visualX: 10 * CELL_SIZE + CELL_SIZE / 2,
      visualY: 14 * CELL_SIZE + CELL_SIZE / 2,
      startJumpX: 10 * CELL_SIZE + CELL_SIZE / 2,
      startJumpY: 14 * CELL_SIZE + CELL_SIZE / 2,
      targetJumpX: 10 * CELL_SIZE + CELL_SIZE / 2,
      targetJumpY: 14 * CELL_SIZE + CELL_SIZE / 2,
      isJumping: false,
      jumpProgress: 0,
      direction: "UP",
      isInvulnerable: false,
      invulnerableTimer: 0,
      dashCooldown: fullReset ? 0 : frogRef.current.dashCooldown,
      maxRowReached: 14,
      attachedToPlatformId: null,
      dead: false,
      respawnTimer: 0,
    };
    roundTimerRef.current = Math.max(
      25,
      ROUND_TIME_INITIAL - (levelRef.current - 1) * 2
    );
  };

  const spawnDeathParticles = (x: number, y: number) => {
    const pal = paletteRef.current;
    const colors = pal.particles.death;
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 160;
      particlePoolRef.current.spawn(
        x,
        y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        2 + Math.random() * 3,
        colors[Math.floor(Math.random() * colors.length)],
        1.2 + Math.random() * 0.8,
        1.0
      );
    }
  };

  const killFrog = () => {
    if (frogRef.current.dead) return;
    frogRef.current.dead = true;
    frogRef.current.respawnTimer = 0.8;
    spawnDeathParticles(frogRef.current.visualX, frogRef.current.visualY);

    const nextLives = livesRef.current - 1;
    livesRef.current = nextLives;
    callbacksRef.current.onLivesChange?.(nextLives);

    if (nextLives <= 0) {
      gameOverRef.current = true;
      callbacksRef.current.onGameOver?.(scoreRef.current);
    }
  };

  const killFrogRef = useRef(killFrog);
  useEffect(() => {
    killFrogRef.current = killFrog;
  });

  // Movimiento ortogonal
  const triggerMove = (
    dir: Direction,
    steps: number = 1,
    isDash: boolean = false
  ) => {
    const f = frogRef.current;
    if (f.dead || gameOverRef.current) return;
    if (f.isJumping) return;

    let targetCol = f.col;
    let targetRow = f.row;

    if (dir === "UP") targetRow -= steps;
    if (dir === "DOWN") targetRow += steps;
    if (dir === "LEFT") targetCol -= steps;
    if (dir === "RIGHT") targetCol += steps;

    // Límites de cuadrícula
    targetCol = Math.max(0, Math.min(GRID_COLS - 1, targetCol));
    targetRow = Math.max(0, Math.min(GRID_ROWS - 1, targetRow));

    f.direction = dir;
    f.startJumpX = f.visualX;
    f.startJumpY = f.visualY;
    f.targetJumpX = targetCol * CELL_SIZE + CELL_SIZE / 2;
    f.targetJumpY = targetRow * CELL_SIZE + CELL_SIZE / 2;
    f.col = targetCol;
    f.row = targetRow;
    f.isJumping = true;
    f.jumpProgress = 0;
    f.attachedToPlatformId = null;

    if (isDash) {
      f.isInvulnerable = true;
      f.invulnerableTimer = INVULNERABLE_DURATION_SEC;
      f.dashCooldown = DASH_COOLDOWN_TIME;

      // Partículas según paleta
      const pal = paletteRef.current;
      for (let p = 0; p < 12; p++) {
        particlePoolRef.current.spawn(
          f.visualX + (Math.random() - 0.5) * 20,
          f.visualY + (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 60,
          3,
          pal.particles.dash[
            Math.floor(Math.random() * pal.particles.dash.length)
          ],
          2.5,
          1.0
        );
      }
    }

    // Puntos por avanzar a una fila superior nunca antes alcanzada en esta vida
    if (targetRow < f.maxRowReached) {
      const rowsAdvanced = f.maxRowReached - targetRow;
      f.maxRowReached = targetRow;
      const pts = rowsAdvanced * 10;
      scoreRef.current += pts;
      callbacksRef.current.onScoreIncrement?.(pts);
    }
  };

  // Inicialización y reinicios (restartSignal)
  useEffect(() => {
    scoreRef.current = 0;
    livesRef.current = 3;
    levelRef.current = 1;
    gameOverRef.current = false;

    callbacksRef.current.onScoreChange?.(0);
    callbacksRef.current.onLivesChange?.(3);
    callbacksRef.current.onLevelChange?.(1);

    initNodes();
    initEntities(1);
    particlePoolRef.current.clear();
    spawnFrog(true);
  }, [restartSignal]);

  // Manejo de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressedRef.current[e.code] = true;

      if (isPaused || gameOverRef.current) return;

      if (e.code === "ArrowUp" || e.code === "KeyW") {
        e.preventDefault();
        triggerMove("UP", 1, false);
      } else if (e.code === "ArrowDown" || e.code === "KeyS") {
        e.preventDefault();
        triggerMove("DOWN", 1, false);
      } else if (e.code === "ArrowLeft" || e.code === "KeyA") {
        e.preventDefault();
        triggerMove("LEFT", 1, false);
      } else if (e.code === "ArrowRight" || e.code === "KeyD") {
        e.preventDefault();
        triggerMove("RIGHT", 1, false);
      } else if (e.code === "Space") {
        e.preventDefault();
        const f = frogRef.current;
        if (f.dashCooldown <= 0 && !f.dead && !f.isJumping) {
          triggerMove(f.direction, 2, true);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current[e.code] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isPaused]);

  // Bucle principal RAF
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const canvas = canvasRef.current;
      if (!canvas) {
        animId = requestAnimationFrame(loop);
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        animId = requestAnimationFrame(loop);
        return;
      }

      // Si no está en pausa, actualizar físicas
      if (!isPaused && !gameOverRef.current) {
        // 1. Temporizador de ciclo
        const f = frogRef.current;
        if (!f.dead) {
          roundTimerRef.current -= dt;
          if (roundTimerRef.current <= 0) {
            killFrogRef.current();
          }

          // Cooldown de Cyber-Dash
          if (f.dashCooldown > 0) {
            f.dashCooldown = Math.max(0, f.dashCooldown - dt);
          }

          // Invulnerabilidad de Dash
          if (f.invulnerableTimer > 0) {
            f.invulnerableTimer = Math.max(0, f.invulnerableTimer - dt);
            if (f.invulnerableTimer <= 0) {
              f.isInvulnerable = false;
            }
          }
        } else {
          // Temporizador de reaparición tras muerte
          f.respawnTimer -= dt;
          if (f.respawnTimer <= 0 && livesRef.current > 0) {
            spawnFrog(false);
          }
        }

        // 2. Actualizar obstáculos de autopista
        hazardsRef.current.forEach((h) => {
          h.x += h.vx * dt;
          if (h.vx > 0 && h.x > CANVAS_WIDTH + 80) {
            h.x = -h.width - 20;
          } else if (h.vx < 0 && h.x < -h.width - 80) {
            h.x = CANVAS_WIDTH + 20;
          }

          // Láser cíclico
          if (h.type === "FIREWALL_LASER" && h.laserActiveTimer !== undefined) {
            h.laserActiveTimer += dt;
            const cycle = h.laserActiveTimer % 2.8;
            h.laserIsOn = cycle >= 1.6; // 1.6s apagado, 1.2s encendido
          }
        });

        // 3. Actualizar plataformas
        platformsRef.current.forEach((p) => {
          p.x += p.vx * dt;
          if (p.vx > 0 && p.x > CANVAS_WIDTH + 100) {
            p.x = -p.width - 20;
          } else if (p.vx < 0 && p.x < -p.width - 100) {
            p.x = CANVAS_WIDTH + 20;
          }

          // Disipadores sumergibles
          if (p.type === "HEAT_SINK" && p.submergeCycleTimer !== undefined) {
            p.submergeCycleTimer += dt;
            const cycle = p.submergeCycleTimer % 4.5;
            p.submerged = cycle >= 3.0; // 3s flotando, 1.5s sumergido
          }
        });

        // 4. Actualizar interpolación de salto
        if (f.isJumping) {
          f.jumpProgress += dt / JUMP_DURATION_SEC;
          if (f.jumpProgress >= 1.0) {
            f.jumpProgress = 1.0;
            f.isJumping = false;
            f.visualX = f.targetJumpX;
            f.visualY = f.targetJumpY;
            f.col = Math.floor(f.visualX / CELL_SIZE);
            f.row = Math.floor(f.visualY / CELL_SIZE);
          } else {
            f.visualX =
              f.startJumpX + (f.targetJumpX - f.startJumpX) * f.jumpProgress;
            f.visualY =
              f.startJumpY + (f.targetJumpY - f.startJumpY) * f.jumpProgress;
          }
        }

        // 5. Arrastre horizontal en refrigerante (Filas 2 a 6) cuando NO está saltando
        if (!f.dead && !f.isJumping && f.row >= 2 && f.row <= 6) {
          let onPlatform = false;
          for (const p of platformsRef.current) {
            if (p.row === f.row) {
              const pLeft = p.x;
              const pRight = p.x + p.width;
              if (f.visualX >= pLeft && f.visualX <= pRight) {
                if (p.type === "HEAT_SINK" && p.submerged) {
                  // Muerte por disipador sobrecalentado sumergido
                  killFrogRef.current();
                } else {
                  // Arrastre con la plataforma
                  onPlatform = true;
                  f.attachedToPlatformId = p.id;
                  f.visualX += p.vx * dt;
                  f.targetJumpX = f.visualX;
                  f.col = Math.floor(f.visualX / CELL_SIZE);

                  // Muerte por colisión con el chasis lateral
                  if (f.visualX < 10 || f.visualX > CANVAS_WIDTH - 10) {
                    killFrogRef.current();
                  }
                }
                break;
              }
            }
          }

          if (!onPlatform && !f.dead) {
            // Se hundió en el refrigerante de plasma a 600°C
            killFrogRef.current();
          }
        }

        // 6. Colisiones en Autopista (Filas 8 a 12)
        if (!f.dead && !f.isInvulnerable && f.row >= 8 && f.row <= 12) {
          const frogBox = {
            left: f.visualX - 16,
            right: f.visualX + 16,
            top: f.visualY - 16,
            bottom: f.visualY + 16,
          };

          for (const h of hazardsRef.current) {
            if (h.row === f.row) {
              if (h.type === "FIREWALL_LASER" && !h.laserIsOn) {
                continue; // Láser temporalmente apagado
              }

              const hLeft = h.x;
              const hRight = h.x + h.width;
              const hTop = h.y;
              const hBottom = h.y + h.height;

              const isOverlap =
                frogBox.left < hRight &&
                frogBox.right > hLeft &&
                frogBox.top < hBottom &&
                frogBox.bottom > hTop;

              if (isOverlap) {
                killFrogRef.current();
                break;
              }
            }
          }
        }

        // 7. Llegada a Nodos Maestros (Fila 0)
        if (!f.dead && !f.isJumping && f.row === 0) {
          let landedInNode = false;

          for (const node of nodesRef.current) {
            if (node.col === f.col && !node.penetrated) {
              landedInNode = true;
              node.penetrated = true;
              nodesPenetratedRef.current += 1;

              // Bono por infiltración (+1000) + Bono por tiempo (+20 por segundo)
              const timeBonus = Math.floor(roundTimerRef.current) * 20;
              const nodePoints = 1000 + timeBonus;
              scoreRef.current += nodePoints;

              callbacksRef.current.onScoreIncrement?.(nodePoints);

              // Chispas de éxito según paleta
              const pal = paletteRef.current;
              for (let c = 0; c < 24; c++) {
                particlePoolRef.current.spawn(
                  node.x + 20,
                  node.y + 20,
                  (Math.random() - 0.5) * 180,
                  (Math.random() - 0.5) * 180,
                  3,
                  pal.particles.penetration[
                    Math.floor(Math.random() * pal.particles.penetration.length)
                  ],
                  1.5,
                  1.0
                );
              }

              // Comprobar si se completaron los 5 Nodos
              if (nodesPenetratedRef.current >= 5) {
                const completeBonus = 3000;
                scoreRef.current += completeBonus;
                callbacksRef.current.onScoreIncrement?.(completeBonus);

                const nextLvl = levelRef.current + 1;
                levelRef.current = nextLvl;
                callbacksRef.current.onLevelChange?.(nextLvl);

                initNodes();
                initEntities(nextLvl);
              }

              // Respawn en socket inicial
              spawnFrog(false);
              break;
            }
          }

          if (!landedInNode && !f.dead) {
            // Cayó en los muros de contención entre bahías
            killFrogRef.current();
          }
        }

        // 8. Partículas (Object Pool libre de GC)
        particlePoolRef.current.update(dt);
      }

      // ==========================================
      // RENDERIZADO DEL CANVAS CON PALETA DINÁMICA
      // ==========================================
      const pal = paletteRef.current;

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Dibujar fondo estático pre-renderizado (O(1) blit desde offscreen canvas)
      if (bgCanvasRef.current) {
        ctx.drawImage(bgCanvasRef.current, 0, 0);
      } else {
        renderStaticBackground();
        if (bgCanvasRef.current) ctx.drawImage(bgCanvasRef.current, 0, 0);
      }

      // --- ZONA 4: Refrigerante Térmico de Plasma (Filas 2 a 6) ---
      ctx.fillStyle = pal.zones.plasmaRiver.fill;
      ctx.fillRect(0, 2 * CELL_SIZE, CANVAS_WIDTH, 5 * CELL_SIZE);

      ctx.fillStyle = pal.zones.plasmaRiver.wave;
      for (let i = 0; i < 8; i++) {
        const waveX = (time * 0.05 + i * 110) % CANVAS_WIDTH;
        ctx.fillRect(waveX, 2 * CELL_SIZE, 60, 5 * CELL_SIZE);
      }

      // --- ZONA 6: Nodos Maestros (Fila 0) ---
      ctx.fillStyle = pal.zones.masterNodesBar.fill;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CELL_SIZE);

      nodesRef.current.forEach((n) => {
        ctx.fillStyle = n.penetrated
          ? pal.zones.masterNodesBar.bayPenetrated
          : pal.zones.masterNodesBar.bayOpen;
        ctx.fillRect(n.x, n.y, n.width, n.height);

        ctx.strokeStyle = n.penetrated
          ? pal.zones.masterNodesBar.bayStrokePenetrated
          : pal.zones.masterNodesBar.bayStrokeOpen;
        ctx.lineWidth = 2;
        ctx.strokeRect(n.x + 2, n.y + 2, n.width - 4, n.height - 4);

        if (n.penetrated) {
          ctx.fillStyle = pal.zones.masterNodesBar.nodeIconPenetrated;
          ctx.beginPath();
          ctx.arc(n.x + 20, n.y + 20, 10, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.strokeStyle = pal.zones.masterNodesBar.nodeIconOpen;
          ctx.strokeRect(n.x + 12, n.y + 12, 16, 16);
        }
      });

      // --- RENDERIZAR PLATAFORMAS FLOTANTES ---
      platformsRef.current.forEach((p) => {
        if (p.type === "HEAT_SINK" && p.submerged) {
          ctx.fillStyle = pal.platforms.heatSink.submergedFill;
          ctx.fillRect(p.x, p.y, p.width, p.height);
          ctx.strokeStyle = pal.platforms.heatSink.submergedStroke;
          ctx.lineWidth = 1;
          ctx.strokeRect(p.x, p.y, p.width, p.height);
        } else if (p.type === "HEAT_SINK") {
          ctx.fillStyle = pal.platforms.heatSink.fill;
          ctx.fillRect(p.x, p.y, p.width, p.height);
          ctx.strokeStyle = pal.platforms.heatSink.stroke;
          ctx.lineWidth = 2;
          ctx.strokeRect(p.x, p.y, p.width, p.height);

          ctx.fillStyle = pal.platforms.heatSink.finFill;
          for (let f = 10; f < p.width; f += 20) {
            ctx.fillRect(p.x + f, p.y + 4, 6, p.height - 8);
          }
        } else if (p.type === "RAM_BLOCK") {
          ctx.fillStyle = pal.platforms.ram.fill;
          ctx.fillRect(p.x, p.y, p.width, p.height);
          ctx.strokeStyle = pal.platforms.ram.stroke;
          ctx.lineWidth = 2;
          ctx.strokeRect(p.x, p.y, p.width, p.height);

          ctx.fillStyle = pal.platforms.ram.chipFill;
          for (let c = 8; c < p.width - 12; c += 24) {
            ctx.fillRect(p.x + c, p.y + 6, 14, p.height - 12);
          }
        } else {
          ctx.fillStyle = pal.platforms.dataBus.fill;
          ctx.fillRect(p.x, p.y, p.width, p.height);
          ctx.strokeStyle = pal.platforms.dataBus.stroke;
          ctx.lineWidth = 2;
          ctx.strokeRect(p.x, p.y, p.width, p.height);

          ctx.fillStyle = pal.platforms.dataBus.pinFill;
          for (let c = 6; c < p.width - 8; c += 14) {
            ctx.fillRect(p.x + c, p.y + 2, 6, 6);
            ctx.fillRect(p.x + c, p.y + p.height - 8, 6, 6);
          }
        }
      });

      // --- RENDERIZAR VEHÍCULOS / OBSTÁCULOS DE AUTOPISTA ---
      hazardsRef.current.forEach((h) => {
        if (h.type === "TROJAN_TRUCK") {
          ctx.fillStyle = pal.hazards.trojanTruck.fill;
          ctx.fillRect(h.x, h.y, h.width, h.height);
          ctx.strokeStyle = pal.hazards.trojanTruck.stroke;
          ctx.lineWidth = 2;
          ctx.strokeRect(h.x, h.y, h.width, h.height);

          ctx.fillStyle = pal.hazards.trojanTruck.headlight;
          ctx.fillRect(h.vx > 0 ? h.x + h.width - 6 : h.x, h.y + 4, 6, 8);
          ctx.fillRect(
            h.vx > 0 ? h.x + h.width - 6 : h.x,
            h.y + h.height - 12,
            6,
            8
          );
        } else if (h.type === "FIREWALL_LASER") {
          ctx.fillStyle = pal.hazards.firewallLaser.fill;
          ctx.fillRect(h.x, h.y, h.width, h.height);
          ctx.strokeStyle = h.laserIsOn
            ? pal.hazards.firewallLaser.strokeActive
            : pal.hazards.firewallLaser.strokeInactive;
          ctx.lineWidth = 2;
          ctx.strokeRect(h.x, h.y, h.width, h.height);

          if (h.laserIsOn) {
            ctx.fillStyle = pal.hazards.firewallLaser.beamFill;
            ctx.fillRect(h.x + 8, h.y + 12, h.width - 16, 8);
          }
        } else if (h.type === "PACKET_FAST") {
          ctx.fillStyle = pal.hazards.packetFast.fill;
          ctx.fillRect(h.x, h.y, h.width, h.height);
          ctx.strokeStyle = pal.hazards.packetFast.stroke;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(h.x, h.y, h.width, h.height);

          ctx.fillStyle = pal.hazards.packetFast.coreFill;
          ctx.fillRect(h.x + 12, h.y + 8, h.width - 24, h.height - 16);
        } else {
          ctx.fillStyle = pal.hazards.glitchDdos.fill;
          ctx.fillRect(h.x, h.y, h.width, h.height);
          ctx.strokeStyle = pal.hazards.glitchDdos.stroke;
          ctx.lineWidth = 2;
          ctx.strokeRect(h.x, h.y, h.width, h.height);

          ctx.fillStyle = pal.hazards.glitchDdos.coreFill;
          ctx.fillRect(h.x + 8, h.y + 8, h.width - 16, h.height - 16);
        }
      });

      // --- RENDERIZAR PARTÍCULAS (Object Pool) ---
      particlePoolRef.current.draw(ctx);

      // --- RENDERIZAR DRON CYBER-FROG ---
      const f = frogRef.current;
      if (!f.dead) {
        ctx.save();
        ctx.translate(f.visualX, f.visualY);

        if (f.direction === "DOWN") ctx.rotate(Math.PI);
        if (f.direction === "LEFT") ctx.rotate(-Math.PI / 2);
        if (f.direction === "RIGHT") ctx.rotate(Math.PI / 2);

        // Halo de invulnerabilidad (Cyber-Dash)
        if (f.isInvulnerable) {
          ctx.strokeStyle = pal.frog.dashAuraStroke;
          ctx.lineWidth = 3;
          ctx.shadowColor = pal.frog.dashAuraGlowColor;
          ctx.shadowBlur = pal.frog.dashAuraGlowBlur;
          ctx.strokeRect(-18, -18, 36, 36);
        }

        // Chasis biomecánico
        ctx.fillStyle = pal.frog.bodyFill;
        ctx.shadowColor = pal.frog.glowColor;
        ctx.shadowBlur = f.isJumping
          ? pal.frog.jumpingGlowBlur
          : pal.frog.glowBlur;

        // Cuerpo central
        ctx.fillRect(-12, -10, 24, 20);

        // Patas delanteras
        ctx.fillRect(-16, -14, 6, 8);
        ctx.fillRect(10, -14, 6, 8);

        // Patas traseras
        ctx.fillRect(-18, 6, 8, 10);
        ctx.fillRect(10, 6, 8, 10);

        // Visor holográfico
        ctx.fillStyle = pal.frog.visorFill;
        ctx.shadowColor = pal.frog.visorGlowColor;
        ctx.shadowBlur = pal.glowBlur > 0 ? 8 : 0;
        ctx.fillRect(-8, -12, 16, 5);

        // Reset explícito de sombras para evitar retención en el pipeline de la GPU
        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";

        ctx.restore();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPaused, renderStaticBackground]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black select-none">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="w-full h-full object-contain [image-rendering:pixelated]"
        style={{
          imageRendering: "pixelated",
          aspectRatio: "4/3",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      />
    </div>
  );
};

export const CyberFroggerActionGame = React.memo(
  CyberFroggerActionGameComponent
);
CyberFroggerActionGame.displayName = "CyberFroggerActionGame";
