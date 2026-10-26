"use client";

import { FC, useEffect, useRef } from "react";
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

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

interface Coord {
  x: number;
  y: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  decay: number;
}

interface ActiveFood {
  position: Coord;
  fruit: FruitDefinition;
  spawnTime: number;
}

export const SnakeGame: FC<CabinetGameProps> = ({
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

  // Bucle principal del juego
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    // Estado del juego
    const snake: Coord[] = [
      { x: 10, y: 12 },
      { x: 9, y: 12 },
      { x: 8, y: 12 },
    ];
    let currentDir: Direction = "RIGHT";
    const dirQueue: Direction[] = [];

    let score = 0;
    let level = 1;
    let fruitsEaten = 0;
    let gameOver = false;
    let tickAccumulator = 0;
    let lastTime: number | null = null;
    let totalTime = 0;

    const particles: Particle[] = [];

    // Notificaciones iniciales de cabina
    onLivesChangeRef.current?.(1);
    onLevelChangeRef.current?.(1);
    onScoreChangeRef.current?.(0);

    // Función para calcular intervalo entre ticks según nivel
    const getTickInterval = (lvl: number): number => {
      return Math.max(0.045, 0.13 - (lvl - 1) * 0.012);
    };

    // Función para generar comida en una casilla libre
    const spawnFood = (): ActiveFood => {
      const occupied = new Set<string>();
      snake.forEach((seg) => occupied.add(`${seg.x},${seg.y}`));

      const emptyCoords: Coord[] = [];
      for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
          if (!occupied.has(`${c},${r}`)) {
            emptyCoords.push({ x: c, y: r });
          }
        }
      }

      const pos =
        emptyCoords.length > 0
          ? emptyCoords[Math.floor(Math.random() * emptyCoords.length)]
          : { x: 0, y: 0 };

      return {
        position: pos,
        fruit: getRandomFruit(),
        spawnTime: totalTime,
      };
    };

    let food = spawnFood();

    // Emisión de partículas
    const spawnParticles = (
      x: number,
      y: number,
      color: string,
      count: number
    ) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 40 + Math.random() * 120;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          size: 2 + Math.random() * 3,
          alpha: 1,
          decay: 1.2 + Math.random() * 1.5,
        });
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

      let requestedDir: Direction | null = null;
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        requestedDir = "UP";
      } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        requestedDir = "DOWN";
      } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        requestedDir = "LEFT";
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        requestedDir = "RIGHT";
      }

      if (!requestedDir) return;

      // Comprobar contra la última dirección planificada para evitar giro 180°
      const lastPlannedDir =
        dirQueue.length > 0 ? dirQueue[dirQueue.length - 1] : currentDir;

      const isOpposite =
        (requestedDir === "UP" && lastPlannedDir === "DOWN") ||
        (requestedDir === "DOWN" && lastPlannedDir === "UP") ||
        (requestedDir === "LEFT" && lastPlannedDir === "RIGHT") ||
        (requestedDir === "RIGHT" && lastPlannedDir === "LEFT");

      if (
        !isOpposite &&
        requestedDir !== lastPlannedDir &&
        dirQueue.length < 2
      ) {
        dirQueue.push(requestedDir);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Actualización de física / ticks
    const update = (dt: number) => {
      totalTime += dt;

      // Actualizar partículas
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.alpha -= p.decay * dt;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      if (gameOver) return;

      const tickInterval = getTickInterval(level);
      tickAccumulator += dt;

      while (tickAccumulator >= tickInterval && !gameOver) {
        tickAccumulator -= tickInterval;

        // Procesar siguiente dirección de la cola
        if (dirQueue.length > 0) {
          currentDir = dirQueue.shift()!;
        }

        // Calcular nueva posición de la cabeza
        const head = snake[0];
        let nextX = head.x;
        let nextY = head.y;

        if (currentDir === "UP") nextY -= 1;
        else if (currentDir === "DOWN") nextY += 1;
        else if (currentDir === "LEFT") nextX -= 1;
        else if (currentDir === "RIGHT") nextX += 1;

        // 1. Detección de colisión con muros sólidos
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
            30
          );
          onGameOverRef.current?.(score);
          break;
        }

        // 2. Detección de colisión con el propio cuerpo
        const hitSelf = snake.some((seg) => seg.x === nextX && seg.y === nextY);

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

          onScoreIncrementRef.current?.(pts);
          onScoreChangeRef.current?.(score);

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
      ctx.save();
      ctx.clearRect(0, 0, W, H);

      // Fondo base arcade oscuro
      ctx.fillStyle = "#050811";
      ctx.fillRect(0, 0, W, H);

      // Cuadrícula sutil neón
      ctx.strokeStyle = "rgba(0, 240, 255, 0.035)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= W; x += CELL_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y <= H; y += CELL_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Marco perimetral neón de advertencia (muros sólidos mortales)
      ctx.strokeStyle = "rgba(0, 240, 255, 0.25)";
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, W - 2, H - 2);

      // Renderizado de Fruta
      const fx = food.position.x * CELL_SIZE;
      const fy = food.position.y * CELL_SIZE;
      const pulse = Math.sin(totalTime * 6) * 3;

      // Resplandor de base de la fruta
      ctx.save();
      ctx.shadowColor = food.fruit.colorFallback;
      ctx.shadowBlur = 12 + pulse;

      if (imgLoadedRef.current && fruitsImgRef.current) {
        // Renderizado del sprite recortado
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
        // Fallback gráfico procedimental
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

      // Renderizado de la Serpiente
      snake.forEach((seg, index) => {
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

          // Núcleo brillante interior
          ctx.fillStyle = `rgba(180, 255, 220, ${0.3 * factor})`;
          ctx.fillRect(sx + 7, sy + 7, CELL_SIZE - 14, CELL_SIZE - 14);
        }
        ctx.restore();
      });

      // Renderizado de Partículas
      particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      ctx.restore();
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
    >
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="w-full h-full object-contain [image-rendering:pixelated]"
      />
    </div>
  );
};
