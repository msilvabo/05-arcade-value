"use client";

import React, { FC, useEffect, useRef } from "react";
import { ParticlePool } from "@/lib/performance/particle-pool";
import { CabinetGameProps } from "../../_lib/types";
import {
  FRUITS_IMAGE_SRC,
  FruitDefinition,
  getRandomFruit,
} from "./spritesheet";

const W = 800;
const H = 600;
const CELL_SIZE = 25;
const GRID_COLS = W / CELL_SIZE; // 32
const GRID_ROWS = H / CELL_SIZE; // 24
const TOTAL_CELLS = GRID_COLS * GRID_ROWS;

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

interface Coord {
  x: number;
  y: number;
}

interface ActiveFood {
  position: Coord;
  fruit: FruitDefinition;
  spawnTime: number;
}

const SnakeGameComponent: FC<CabinetGameProps> = ({
  isPaused,
  onScoreIncrement,
  onScoreChange,
  onLivesChange,
  onLevelChange,
  onGameOver,
  restartSignal,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Referencias para callbacks y estado sin recrear el bucle
  const isPausedRef = useRef(isPaused);
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const onScoreIncrementRef = useRef(onScoreIncrement);
  const onScoreChangeRef = useRef(onScoreChange);
  const onLivesChangeRef = useRef(onLivesChange);
  const onLevelChangeRef = useRef(onLevelChange);
  const onGameOverRef = useRef(onGameOver);

  useEffect(() => {
    onScoreIncrementRef.current = onScoreIncrement;
    onScoreChangeRef.current = onScoreChange;
    onLivesChangeRef.current = onLivesChange;
    onLevelChangeRef.current = onLevelChange;
    onGameOverRef.current = onGameOver;
  }, [
    onScoreIncrement,
    onScoreChange,
    onLivesChange,
    onLevelChange,
    onGameOver,
  ]);

  // Precarga del atlas de sprites
  const fruitsImgRef = useRef<HTMLImageElement | null>(null);
  const imgLoadedRef = useRef(false);

  useEffect(() => {
    const img = new Image();
    img.src = FRUITS_IMAGE_SRC;
    img.onload = () => {
      fruitsImgRef.current = img;
      imgLoadedRef.current = true;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Estado del juego
    const snake: Coord[] = [
      { x: 10, y: 12 },
      { x: 9, y: 12 },
      { x: 8, y: 12 },
    ];
    let currentDir: Direction = "RIGHT";
    let nextDir: Direction = "RIGHT";
    let score = 0;
    let fruitsEaten = 0;
    let level = 1;
    let gameOver = false;

    // Variables de tiempo acumulado y RAF
    let tickTimer = 0;
    let lastTime: number | null = null;
    let totalTime = 0;

    const particlePool = new ParticlePool(150);

    // Pre-renderizado en Offscreen Canvas del fondo y rejilla O(1)
    const bgCanvas = document.createElement("canvas");
    bgCanvas.width = W;
    bgCanvas.height = H;
    const bgCtx = bgCanvas.getContext("2d");
    if (bgCtx) {
      bgCtx.fillStyle = "#050811";
      bgCtx.fillRect(0, 0, W, H);

      bgCtx.strokeStyle = "rgba(0, 240, 255, 0.035)";
      bgCtx.lineWidth = 1;
      bgCtx.beginPath();
      for (let x = 0; x <= W; x += CELL_SIZE) {
        bgCtx.moveTo(x, 0);
        bgCtx.lineTo(x, H);
      }
      for (let y = 0; y <= H; y += CELL_SIZE) {
        bgCtx.moveTo(0, y);
        bgCtx.lineTo(W, y);
      }
      bgCtx.stroke();

      bgCtx.strokeStyle = "rgba(0, 240, 255, 0.25)";
      bgCtx.lineWidth = 2;
      bgCtx.strokeRect(1, 1, W - 2, H - 2);
    }

    // Notificaciones iniciales de cabina
    onLivesChangeRef.current?.(1);
    onLevelChangeRef.current?.(1);
    onScoreChangeRef.current?.(0);

    // Función para calcular intervalo entre ticks según nivel
    const getTickInterval = (lvl: number): number => {
      return Math.max(0.045, 0.13 - (lvl - 1) * 0.012);
    };

    // Buffer plano reutilizable para cálculo de celdas libres sin instanciar strings ni Sets (Zero-Alloc)
    const gridOccupied = new Uint8Array(TOTAL_CELLS);

    const spawnFood = (): ActiveFood => {
      gridOccupied.fill(0);
      for (let i = 0; i < snake.length; i++) {
        const seg = snake[i];
        if (
          seg.x >= 0 &&
          seg.x < GRID_COLS &&
          seg.y >= 0 &&
          seg.y < GRID_ROWS
        ) {
          gridOccupied[seg.y * GRID_COLS + seg.x] = 1;
        }
      }

      let freeCount = 0;
      for (let i = 0; i < TOTAL_CELLS; i++) {
        if (gridOccupied[i] === 0) freeCount++;
      }

      let chosenIndex = 0;
      if (freeCount > 0) {
        let target = Math.floor(Math.random() * freeCount);
        for (let i = 0; i < TOTAL_CELLS; i++) {
          if (gridOccupied[i] === 0) {
            if (target === 0) {
              chosenIndex = i;
              break;
            }
            target--;
          }
        }
      }

      return {
        position: {
          x: chosenIndex % GRID_COLS,
          y: Math.floor(chosenIndex / GRID_COLS),
        },
        fruit: getRandomFruit(),
        spawnTime: totalTime,
      };
    };

    let food = spawnFood();

    // Emisión de partículas mediante Object Pool sin allocs
    const spawnParticles = (
      x: number,
      y: number,
      color: string,
      count: number
    ) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 40 + Math.random() * 120;
        particlePool.spawn(
          x,
          y,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          2 + Math.random() * 3,
          color,
          1.2 + Math.random() * 1.5,
          1.0
        );
      }
    };

    // Controles de teclado
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
      ) {
        e.preventDefault();
      }

      if (gameOver) return;

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (currentDir !== "DOWN") nextDir = "UP";
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (currentDir !== "UP") nextDir = "DOWN";
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (currentDir !== "RIGHT") nextDir = "LEFT";
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (currentDir !== "LEFT") nextDir = "RIGHT";
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Bucle de lógica (Tick de movimiento y colisiones)
    const update = (dt: number) => {
      if (gameOver) return;

      totalTime += dt;
      tickTimer += dt;
      particlePool.update(dt);

      const interval = getTickInterval(level);

      while (tickTimer >= interval) {
        tickTimer -= interval;

        // Actualizar dirección
        currentDir = nextDir;

        // 1. Calcular nueva cabeza
        const head = snake[0];
        let nextX = head.x;
        let nextY = head.y;

        switch (currentDir) {
          case "UP":
            nextY -= 1;
            break;
          case "DOWN":
            nextY += 1;
            break;
          case "LEFT":
            nextX -= 1;
            break;
          case "RIGHT":
            nextX += 1;
            break;
        }

        // 2. Comprobar colisiones con bordes del tablero
        if (
          nextX < 0 ||
          nextX >= GRID_COLS ||
          nextY < 0 ||
          nextY >= GRID_ROWS
        ) {
          gameOver = true;
          onLivesChangeRef.current?.(0);
          spawnParticles(
            head.x * CELL_SIZE + CELL_SIZE / 2,
            head.y * CELL_SIZE + CELL_SIZE / 2,
            "#ff0055",
            35
          );
          onGameOverRef.current?.(score);
          break;
        }

        // Comprobar colisión consigo misma (bucle for sin closure ni allocs)
        let hitSelf = false;
        for (let i = 0; i < snake.length; i++) {
          if (snake[i].x === nextX && snake[i].y === nextY) {
            hitSelf = true;
            break;
          }
        }

        if (hitSelf) {
          gameOver = true;
          onLivesChangeRef.current?.(0);
          spawnParticles(
            head.x * CELL_SIZE + CELL_SIZE / 2,
            head.y * CELL_SIZE + CELL_SIZE / 2,
            "#ff3366",
            30
          );
          onGameOverRef.current?.(score);
          break;
        }

        const newHead: Coord = { x: nextX, y: nextY };
        snake.unshift(newHead);

        // 3. Detección de recolección de fruta
        if (nextX === food.position.x && nextY === food.position.y) {
          const pts = food.fruit.points;
          score += pts;
          fruitsEaten += 1;

          // Despacho limpio y unificado de puntuación (evita dual render)
          onScoreIncrementRef.current?.(pts);

          // Partículas de impacto neón con el color temático de la fruta
          spawnParticles(
            food.position.x * CELL_SIZE + CELL_SIZE / 2,
            food.position.y * CELL_SIZE + CELL_SIZE / 2,
            food.fruit.colorFallback,
            20
          );

          // Progresión de nivel cada 5 frutas
          const newLevel = Math.floor(fruitsEaten / 5) + 1;
          if (newLevel !== level) {
            level = newLevel;
            onLevelChangeRef.current?.(level);
          }

          // Nueva fruta
          food = spawnFood();
        } else {
          // Si no comió fruta, avanzar la cola de la serpiente
          snake.pop();
        }
      }
    };

    // Renderizado en Canvas
    const draw = () => {
      // 1. Blit O(1) de fondo y rejilla pre-renderizada
      ctx.drawImage(bgCanvas, 0, 0);

      // 2. Renderizado de Fruta con resplandor pulsante
      const fx = food.position.x * CELL_SIZE;
      const fy = food.position.y * CELL_SIZE;
      const pulse = Math.sin(totalTime * 6) * 3;

      ctx.save();
      ctx.shadowColor = food.fruit.colorFallback;
      ctx.shadowBlur = 12 + pulse;

      if (imgLoadedRef.current && fruitsImgRef.current) {
        ctx.drawImage(
          fruitsImgRef.current,
          food.fruit.x,
          food.fruit.y,
          food.fruit.w,
          food.fruit.h,
          fx + 1,
          fy + 1,
          CELL_SIZE - 2,
          CELL_SIZE - 2
        );
      } else {
        ctx.fillStyle = food.fruit.colorFallback;
        ctx.beginPath();
        ctx.arc(
          fx + CELL_SIZE / 2,
          fy + CELL_SIZE / 2,
          CELL_SIZE / 2 - 3,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      ctx.restore();

      // Reseteo estricto de sombras
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";

      // 3. Renderizado de la Serpiente
      for (let index = 0; index < snake.length; index++) {
        const seg = snake[index];
        const sx = seg.x * CELL_SIZE;
        const sy = seg.y * CELL_SIZE;
        const isHead = index === 0;

        ctx.save();
        if (isHead) {
          // Cabeza neón cian
          ctx.shadowColor = "#00f0ff";
          ctx.shadowBlur = 10;
          ctx.fillStyle = "#00f0ff";
          ctx.beginPath();
          ctx.roundRect(sx + 1, sy + 1, CELL_SIZE - 2, CELL_SIZE - 2, 6);
          ctx.fill();

          // Reseteo de sombra antes de los ojos para evitar doble filtrado gaussiano
          ctx.shadowBlur = 0;
          ctx.shadowColor = "transparent";

          // Ojos neón direccionales
          ctx.fillStyle = "#ffffff";
          let eye1X = sx + 7;
          let eye1Y = sy + 7;
          let eye2X = sx + 18;
          let eye2Y = sy + 7;

          if (currentDir === "UP") {
            eye1X = sx + 6;
            eye1Y = sy + 6;
            eye2X = sx + 19;
            eye2Y = sy + 6;
          } else if (currentDir === "DOWN") {
            eye1X = sx + 6;
            eye1Y = sy + 19;
            eye2X = sx + 19;
            eye2Y = sy + 19;
          } else if (currentDir === "LEFT") {
            eye1X = sx + 6;
            eye1Y = sy + 6;
            eye2X = sx + 6;
            eye2Y = sy + 19;
          } else if (currentDir === "RIGHT") {
            eye1X = sx + 19;
            eye1Y = sy + 6;
            eye2X = sx + 19;
            eye2Y = sy + 19;
          }

          ctx.beginPath();
          ctx.arc(eye1X, eye1Y, 2.5, 0, Math.PI * 2);
          ctx.arc(eye2X, eye2Y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Cuerpo gradiente esmeralda neón
          const factor = Math.max(0.4, 1 - index / snake.length);
          ctx.shadowColor = "#00ff88";
          ctx.shadowBlur = 6 * factor;
          ctx.fillStyle = `rgba(0, 255, 136, ${0.45 + 0.55 * factor})`;
          ctx.beginPath();
          ctx.roundRect(sx + 2, sy + 2, CELL_SIZE - 4, CELL_SIZE - 4, 4);
          ctx.fill();

          // Reseteo de sombra antes del núcleo brillante
          ctx.shadowBlur = 0;
          ctx.shadowColor = "transparent";

          // Núcleo brillante interior
          ctx.fillStyle = `rgba(180, 255, 220, ${0.3 * factor})`;
          ctx.fillRect(sx + 7, sy + 7, CELL_SIZE - 14, CELL_SIZE - 14);
        }
        ctx.restore();
      }

      // Reseteo estricto de sombra antes de partículas
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";

      // 4. Renderizado de Partículas mediante Object Pool
      particlePool.draw(ctx);
    };

    // Bucle requestAnimationFrame
    let animId: number;
    const loop = (timestamp: number) => {
      const dt =
        lastTime === null ? 0 : Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;

      if (!isPausedRef.current) {
        update(dt);
      }
      draw();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [restartSignal]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden select-none"
      style={{
        contain: "layout paint",
        willChange: "transform",
      }}
    >
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="w-full h-full object-contain [image-rendering:pixelated]"
        style={{
          transform: "translateZ(0)",
          willChange: "transform",
        }}
      />
    </div>
  );
};

export const SnakeGame = React.memo(SnakeGameComponent);
SnakeGame.displayName = "SnakeGame";
