"use client";

import { FC, useEffect, useRef, useCallback } from "react";
import { CabinetGameProps } from "@/app/games/_lib/types";
import {
  TETRIS_COLS,
  TETRIS_ROWS,
  TETRIS_COLORS,
  TETRIS_PIECES,
  TETRIS_LINE_SCORES,
  createTetrisBoard,
  rotateMatrix,
} from "./engine";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const BLOCK_SIZE = 26;
const BOARD_WIDTH = TETRIS_COLS * BLOCK_SIZE; // 260px
const BOARD_HEIGHT = TETRIS_ROWS * BLOCK_SIZE; // 520px
const BOARD_X = Math.floor((CANVAS_WIDTH - BOARD_WIDTH) / 2); // 270px
const BOARD_Y = Math.floor((CANVAS_HEIGHT - BOARD_HEIGHT) / 2); // 40px

interface Piece {
  type: number;
  shape: number[][];
  x: number;
  y: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

interface FlashLine {
  row: number;
  alpha: number;
}

export const TetrisGame: FC<CabinetGameProps> = ({
  isPaused,
  onScoreChange,
  onLivesChange,
  onLevelChange,
  onGameOver,
  restartSignal = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Referencias para evitar re-renders y capturar el estado a 60 FPS
  const animFrameIdRef = useRef<number | null>(null);
  const isPausedRef = useRef<boolean>(isPaused);
  const isGameOverRef = useRef<boolean>(false);

  // Callbacks en referencias
  const onScoreChangeRef = useRef(onScoreChange);
  const onLivesChangeRef = useRef(onLivesChange);
  const onLevelChangeRef = useRef(onLevelChange);
  const onGameOverRef = useRef(onGameOver);

  useEffect(() => {
    onScoreChangeRef.current = onScoreChange;
    onLivesChangeRef.current = onLivesChange;
    onLevelChangeRef.current = onLevelChange;
    onGameOverRef.current = onGameOver;
  }, [onScoreChange, onLivesChange, onLevelChange, onGameOver]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Estado del juego
  const boardRef = useRef<number[][]>(createTetrisBoard());
  const currentRef = useRef<Piece | null>(null);
  const nextRef = useRef<Piece | null>(null);
  const scoreRef = useRef<number>(0);
  const linesRef = useRef<number>(0);
  const levelRef = useRef<number>(1);
  const dropIntervalRef = useRef<number>(1000);
  const dropAccumRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const flashLinesRef = useRef<FlashLine[]>([]);

  const randomPiece = useCallback((): Piece => {
    const type = Math.floor(Math.random() * (TETRIS_PIECES.length - 1)) + 1;
    const baseShape = TETRIS_PIECES[type]!;
    const shape = baseShape.map((row) => [...row]);
    const x = Math.floor(TETRIS_COLS / 2) - Math.floor(shape[0].length / 2);
    return { type, shape, x, y: 0 };
  }, []);

  const collide = useCallback(
    (shape: number[][], ox: number, oy: number, board: number[][]): boolean => {
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (!shape[r][c]) continue;
          const nx = ox + c;
          const ny = oy + r;
          if (nx < 0 || nx >= TETRIS_COLS || ny >= TETRIS_ROWS) return true;
          if (ny >= 0 && board[ny][nx]) return true;
        }
      }
      return false;
    },
    []
  );

  const ghostY = useCallback((): number => {
    const current = currentRef.current;
    const board = boardRef.current;
    if (!current) return 0;
    let gy = current.y;
    while (!collide(current.shape, current.x, gy + 1, board)) {
      gy++;
    }
    return gy;
  }, [collide]);

  const addLineParticles = useCallback((row: number) => {
    const yCenter = BOARD_Y + row * BLOCK_SIZE + BLOCK_SIZE / 2;
    for (let c = 0; c < TETRIS_COLS; c++) {
      const xCenter = BOARD_X + c * BLOCK_SIZE + BLOCK_SIZE / 2;
      for (let i = 0; i < 4; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 40 + Math.random() * 90;
        particlesRef.current.push({
          x: xCenter,
          y: yCenter,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2 + Math.random() * 3,
          color: Math.random() > 0.5 ? "#00f5ff" : "#ff007f",
          alpha: 1,
          decay: 1.5 + Math.random(),
        });
      }
    }
  }, []);

  const clearLines = useCallback(() => {
    const board = boardRef.current;
    let cleared = 0;
    const clearedRows: number[] = [];

    for (let r = TETRIS_ROWS - 1; r >= 0; r--) {
      if (board[r].every((v) => v !== 0)) {
        clearedRows.push(r);
        board.splice(r, 1);
        board.unshift(new Array(TETRIS_COLS).fill(0));
        cleared++;
        r++;
      }
    }

    if (cleared > 0) {
      clearedRows.forEach((row) => {
        flashLinesRef.current.push({ row, alpha: 1 });
        addLineParticles(row);
      });

      linesRef.current += cleared;
      const pts =
        (TETRIS_LINE_SCORES[cleared] || 800 + (cleared - 4) * 300) *
        levelRef.current;
      scoreRef.current += pts;

      const newLevel = Math.floor(linesRef.current / 10) + 1;
      if (newLevel !== levelRef.current) {
        levelRef.current = newLevel;
        onLevelChangeRef.current?.(newLevel);
      }

      dropIntervalRef.current = Math.max(
        100,
        1000 - (levelRef.current - 1) * 90
      );
      onScoreChangeRef.current?.(scoreRef.current);
    }
  }, [addLineParticles]);

  const spawnPiece = useCallback((): boolean => {
    currentRef.current = nextRef.current || randomPiece();
    nextRef.current = randomPiece();

    if (
      collide(
        currentRef.current.shape,
        currentRef.current.x,
        currentRef.current.y,
        boardRef.current
      )
    ) {
      isGameOverRef.current = true;
      onGameOverRef.current?.(scoreRef.current);
      return false;
    }
    return true;
  }, [collide, randomPiece]);

  const lockPiece = useCallback(() => {
    const current = currentRef.current;
    const board = boardRef.current;
    if (!current) return;

    for (let r = 0; r < current.shape.length; r++) {
      for (let c = 0; c < current.shape[r].length; c++) {
        if (current.shape[r][c]) {
          const by = current.y + r;
          const bx = current.x + c;
          if (by >= 0 && by < TETRIS_ROWS && bx >= 0 && bx < TETRIS_COLS) {
            board[by][bx] = current.shape[r][c];
          }
        }
      }
    }

    clearLines();
    spawnPiece();
  }, [clearLines, spawnPiece]);

  const hardDrop = useCallback(() => {
    const current = currentRef.current;
    if (!current || isPausedRef.current || isGameOverRef.current) return;
    const gy = ghostY();
    const dropDistance = gy - current.y;
    scoreRef.current += dropDistance * 2;
    onScoreChangeRef.current?.(scoreRef.current);
    current.y = gy;

    // Partículas de impacto de caída instantánea
    for (let c = 0; c < current.shape[0].length; c++) {
      particlesRef.current.push({
        x: BOARD_X + (current.x + c) * BLOCK_SIZE + BLOCK_SIZE / 2,
        y: BOARD_Y + (gy + current.shape.length) * BLOCK_SIZE,
        vx: (Math.random() - 0.5) * 60,
        vy: -20 - Math.random() * 40,
        size: 2 + Math.random() * 2,
        color: "#00f5ff",
        alpha: 0.9,
        decay: 2.2,
      });
    }

    lockPiece();
  }, [ghostY, lockPiece]);

  const softDrop = useCallback(() => {
    const current = currentRef.current;
    const board = boardRef.current;
    if (!current || isPausedRef.current || isGameOverRef.current) return;

    if (!collide(current.shape, current.x, current.y + 1, board)) {
      current.y++;
      scoreRef.current += 1;
      onScoreChangeRef.current?.(scoreRef.current);
    } else {
      lockPiece();
    }
  }, [collide, lockPiece]);

  const tryRotate = useCallback(() => {
    const current = currentRef.current;
    const board = boardRef.current;
    if (!current || isPausedRef.current || isGameOverRef.current) return;

    const rotated = rotateMatrix(current.shape);
    const kicks = [0, -1, 1, -2, 2];
    for (const kick of kicks) {
      if (!collide(rotated, current.x + kick, current.y, board)) {
        current.shape = rotated;
        current.x += kick;
        return;
      }
    }
  }, [collide]);

  const moveHorizontal = useCallback(
    (dir: number) => {
      const current = currentRef.current;
      const board = boardRef.current;
      if (!current || isPausedRef.current || isGameOverRef.current) return;

      if (!collide(current.shape, current.x + dir, current.y, board)) {
        current.x += dir;
      }
    },
    [collide]
  );

  const resetGame = useCallback(() => {
    boardRef.current = createTetrisBoard();
    scoreRef.current = 0;
    linesRef.current = 0;
    levelRef.current = 1;
    dropIntervalRef.current = 1000;
    dropAccumRef.current = 0;
    isGameOverRef.current = false;
    particlesRef.current = [];
    flashLinesRef.current = [];

    nextRef.current = randomPiece();
    spawnPiece();

    onScoreChangeRef.current?.(0);
    onLivesChangeRef.current?.(1); // Tetris maneja 1 vida según Spec 06 / Spec 07
    onLevelChangeRef.current?.(1);
  }, [randomPiece, spawnPiece]);

  // Disparo de reinicio cuando cambia restartSignal
  useEffect(() => {
    resetGame();
  }, [restartSignal, resetGame]);

  // Teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space"].includes(
          e.code
        )
      ) {
        e.preventDefault();
      }

      if (isPausedRef.current || isGameOverRef.current) return;

      switch (e.code) {
        case "ArrowLeft":
        case "KeyA":
          moveHorizontal(-1);
          break;
        case "ArrowRight":
        case "KeyD":
          moveHorizontal(1);
          break;
        case "ArrowDown":
        case "KeyS":
          softDrop();
          break;
        case "ArrowUp":
        case "KeyW":
        case "KeyX":
          tryRotate();
          break;
        case "Space":
          hardDrop();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [moveHorizontal, softDrop, tryRotate, hardDrop]);

  // Bucle principal de Render y Físicas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastTime = performance.now();

    const drawBlock = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      colorIndex: number,
      size: number,
      alpha = 1
    ) => {
      const color = TETRIS_COLORS[colorIndex];
      if (!color) return;

      context.save();
      context.globalAlpha = alpha;

      // Fondo del bloque con brillo neón
      context.shadowColor = color;
      context.shadowBlur = 6;
      context.fillStyle = color;
      context.fillRect(x + 1, y + 1, size - 2, size - 2);

      // Bisel superior iluminado
      context.fillStyle = "rgba(255, 255, 255, 0.35)";
      context.fillRect(x + 1, y + 1, size - 2, 3);
      context.fillRect(x + 1, y + 1, 3, size - 2);

      // Bisel inferior sombreado
      context.fillStyle = "rgba(0, 0, 0, 0.4)";
      context.fillRect(x + 1, y + size - 4, size - 2, 3);
      context.fillRect(x + size - 4, y + 1, 3, size - 2);

      // Centro sutil
      context.fillStyle = "rgba(255, 255, 255, 0.12)";
      context.fillRect(x + 4, y + 4, size - 8, size - 8);

      context.restore();
    };

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // 1. UPDATE FÍSICA
      if (!isPausedRef.current && !isGameOverRef.current) {
        dropAccumRef.current += dt * 1000;
        if (dropAccumRef.current >= dropIntervalRef.current) {
          dropAccumRef.current = 0;
          const current = currentRef.current;
          const board = boardRef.current;
          if (current) {
            if (!collide(current.shape, current.x, current.y + 1, board)) {
              current.y++;
            } else {
              lockPiece();
            }
          }
        }

        // Actualizar partículas
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.alpha -= p.decay * dt;
          if (p.alpha <= 0) {
            particlesRef.current.splice(i, 1);
          }
        }

        // Actualizar líneas flash
        for (let i = flashLinesRef.current.length - 1; i >= 0; i--) {
          const fl = flashLinesRef.current[i];
          fl.alpha -= dt * 4;
          if (fl.alpha <= 0) {
            flashLinesRef.current.splice(i, 1);
          }
        }
      }

      // 2. RENDER GRÁFICO (Canvas 800x600)
      ctx.fillStyle = "#03060c";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Grilla de fondo del gabinete
      ctx.strokeStyle = "rgba(0, 245, 255, 0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x < CANVAS_WIDTH; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y < CANVAS_HEIGHT; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
      }

      // --- PANEL IZQUIERDO: TELEMETRÍA Y CONTROLES ---
      const lx = 45;
      const ly = BOARD_Y;
      const lw = 185;
      const lh = BOARD_HEIGHT;

      ctx.save();
      ctx.fillStyle = "rgba(4, 9, 20, 0.75)";
      ctx.strokeStyle = "rgba(0, 245, 255, 0.25)";
      ctx.lineWidth = 1;
      ctx.fillRect(lx, ly, lw, lh);
      ctx.strokeRect(lx, ly, lw, lh);

      // Esquinas neón panel izquierdo
      ctx.fillStyle = "#00f5ff";
      ctx.fillRect(lx - 2, ly - 2, 8, 2);
      ctx.fillRect(lx - 2, ly - 2, 2, 8);
      ctx.fillRect(lx + lw - 6, ly - 2, 8, 2);
      ctx.fillRect(lx + lw, ly - 2, 2, 8);

      // Título
      ctx.fillStyle = "#00f5ff";
      ctx.font = "bold 13px monospace";
      ctx.fillText("CYBER TETRIS 99", lx + 16, ly + 32);
      ctx.fillStyle = "rgba(0, 245, 255, 0.55)";
      ctx.font = "10px monospace";
      ctx.fillText("PROTOCOL REV-1984", lx + 16, ly + 48);

      // Separador
      ctx.strokeStyle = "rgba(0, 245, 255, 0.15)";
      ctx.beginPath();
      ctx.moveTo(lx + 16, ly + 62);
      ctx.lineTo(lx + lw - 16, ly + 62);
      ctx.stroke();

      // Métricas
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.font = "11px monospace";
      ctx.fillText("LÍNEAS TOTALES", lx + 16, ly + 90);
      ctx.fillStyle = "#ffd54f";
      ctx.font = "bold 20px monospace";
      ctx.fillText(
        String(linesRef.current).padStart(4, "0"),
        lx + 16,
        ly + 116
      );

      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.font = "11px monospace";
      ctx.fillText("NIVEL CADENCIA", lx + 16, ly + 150);
      ctx.fillStyle = "#00f5ff";
      ctx.font = "bold 20px monospace";
      ctx.fillText(
        `LV.${String(levelRef.current).padStart(2, "0")}`,
        lx + 16,
        ly + 176
      );

      // Separador
      ctx.beginPath();
      ctx.moveTo(lx + 16, ly + 205);
      ctx.lineTo(lx + lw - 16, ly + 205);
      ctx.stroke();

      // Comandos
      ctx.fillStyle = "#00f5ff";
      ctx.font = "bold 11px monospace";
      ctx.fillText("COMANDOS CRT", lx + 16, ly + 230);

      const controls = [
        ["[←] [→]", "Mover lateral"],
        ["[↑] / [X]", "Rotar pieza"],
        ["[↓]", "Caída suave"],
        ["[ESPACIO]", "Hard drop"],
      ];

      controls.forEach(([btn, action], idx) => {
        const rowY = ly + 260 + idx * 32;
        ctx.fillStyle = "#ff007f";
        ctx.font = "bold 10px monospace";
        ctx.fillText(btn, lx + 16, rowY);
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.font = "10px monospace";
        ctx.fillText(action, lx + 16, rowY + 14);
      });
      ctx.restore();

      // --- TABLERO PRINCIPAL ---
      // Fondo del tablero
      ctx.save();
      ctx.fillStyle = "#020408";
      ctx.fillRect(BOARD_X, BOARD_Y, BOARD_WIDTH, BOARD_HEIGHT);

      // Cuadrícula interior del tablero
      ctx.strokeStyle = "rgba(0, 245, 255, 0.08)";
      ctx.lineWidth = 0.5;
      for (let c = 1; c < TETRIS_COLS; c++) {
        ctx.beginPath();
        ctx.moveTo(BOARD_X + c * BLOCK_SIZE, BOARD_Y);
        ctx.lineTo(BOARD_X + c * BLOCK_SIZE, BOARD_Y + BOARD_HEIGHT);
        ctx.stroke();
      }
      for (let r = 1; r < TETRIS_ROWS; r++) {
        ctx.beginPath();
        ctx.moveTo(BOARD_X, BOARD_Y + r * BLOCK_SIZE);
        ctx.lineTo(BOARD_X + BOARD_WIDTH, BOARD_Y + r * BLOCK_SIZE);
        ctx.stroke();
      }

      // Bloques fijos en el tablero
      const board = boardRef.current;
      for (let r = 0; r < TETRIS_ROWS; r++) {
        for (let c = 0; c < TETRIS_COLS; c++) {
          if (board[r][c]) {
            drawBlock(
              ctx,
              BOARD_X + c * BLOCK_SIZE,
              BOARD_Y + r * BLOCK_SIZE,
              board[r][c],
              BLOCK_SIZE
            );
          }
        }
      }

      // Proyección Ghost
      const current = currentRef.current;
      if (current && !isGameOverRef.current) {
        const gy = ghostY();
        for (let r = 0; r < current.shape.length; r++) {
          for (let c = 0; c < current.shape[r].length; c++) {
            if (current.shape[r][c]) {
              drawBlock(
                ctx,
                BOARD_X + (current.x + c) * BLOCK_SIZE,
                BOARD_Y + (gy + r) * BLOCK_SIZE,
                current.shape[r][c],
                BLOCK_SIZE,
                0.22
              );
            }
          }
        }

        // Pieza activa
        for (let r = 0; r < current.shape.length; r++) {
          for (let c = 0; c < current.shape[r].length; c++) {
            if (current.shape[r][c]) {
              drawBlock(
                ctx,
                BOARD_X + (current.x + c) * BLOCK_SIZE,
                BOARD_Y + (current.y + r) * BLOCK_SIZE,
                current.shape[r][c],
                BLOCK_SIZE,
                1
              );
            }
          }
        }
      }

      // Destellos de líneas completadas
      flashLinesRef.current.forEach((fl) => {
        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 255, ${fl.alpha * 0.9})`;
        ctx.shadowColor = "#00f5ff";
        ctx.shadowBlur = 15;
        ctx.fillRect(
          BOARD_X,
          BOARD_Y + fl.row * BLOCK_SIZE,
          BOARD_WIDTH,
          BLOCK_SIZE
        );
        ctx.restore();
      });

      // Borde exterior del tablero neón
      ctx.strokeStyle = "#00f5ff";
      ctx.lineWidth = 2;
      ctx.strokeRect(BOARD_X, BOARD_Y, BOARD_WIDTH, BOARD_HEIGHT);

      // Bisel de acento en el marco
      ctx.fillStyle = "#ff007f";
      ctx.fillRect(BOARD_X - 4, BOARD_Y - 4, 8, 8);
      ctx.fillRect(BOARD_X + BOARD_WIDTH - 4, BOARD_Y - 4, 8, 8);
      ctx.fillRect(BOARD_X - 4, BOARD_Y + BOARD_HEIGHT - 4, 8, 8);
      ctx.fillRect(BOARD_X + BOARD_WIDTH - 4, BOARD_Y + BOARD_HEIGHT - 4, 8, 8);

      ctx.restore();

      // --- PANEL DERECHO: SIGUIENTE TETROMINÓ ---
      const rx = BOARD_X + BOARD_WIDTH + 40;
      const ry = BOARD_Y;
      const rw = 185;
      const rh = 180;

      ctx.save();
      ctx.fillStyle = "rgba(4, 9, 20, 0.75)";
      ctx.strokeStyle = "rgba(0, 245, 255, 0.25)";
      ctx.lineWidth = 1;
      ctx.fillRect(rx, ry, rw, rh);
      ctx.strokeRect(rx, ry, rw, rh);

      // Esquinas panel derecho
      ctx.fillStyle = "#00f5ff";
      ctx.fillRect(rx - 2, ry - 2, 8, 2);
      ctx.fillRect(rx - 2, ry - 2, 2, 8);
      ctx.fillRect(rx + rw - 6, ry - 2, 8, 2);
      ctx.fillRect(rx + rw, ry - 2, 2, 8);

      ctx.fillStyle = "#00f5ff";
      ctx.font = "bold 12px monospace";
      ctx.fillText("SIGUIENTE PIEZA", rx + 16, ry + 28);

      const next = nextRef.current;
      if (next) {
        const previewBlockSize = 22;
        const pw = next.shape[0].length * previewBlockSize;
        const ph = next.shape.length * previewBlockSize;
        const px = rx + Math.floor((rw - pw) / 2);
        const py = ry + 45 + Math.floor((rh - 45 - ph) / 2);

        for (let r = 0; r < next.shape.length; r++) {
          for (let c = 0; c < next.shape[r].length; c++) {
            if (next.shape[r][c]) {
              drawBlock(
                ctx,
                px + c * previewBlockSize,
                py + r * previewBlockSize,
                next.shape[r][c],
                previewBlockSize,
                1
              );
            }
          }
        }
      }
      ctx.restore();

      // Banner inferior derecho: Estado de matriz
      const bx = rx;
      const by = ry + rh + 20;
      const bw = rw;
      const bh = BOARD_HEIGHT - rh - 20;

      ctx.save();
      ctx.fillStyle = "rgba(4, 9, 20, 0.75)";
      ctx.strokeStyle = "rgba(0, 245, 255, 0.25)";
      ctx.lineWidth = 1;
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeRect(bx, by, bw, bh);

      ctx.fillStyle = "#ff007f";
      ctx.font = "bold 11px monospace";
      ctx.fillText("MATRIZ CUÁNTICA", bx + 16, by + 28);

      ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
      ctx.font = "10px monospace";
      ctx.fillText("STATUS: ACTIVO", bx + 16, by + 50);
      ctx.fillText("BUFFER: ESTABLE", bx + 16, by + 68);
      ctx.fillText("CANVAS: CRT 60 FPS", bx + 16, by + 86);

      // Barras decorativas
      for (let i = 0; i < 5; i++) {
        const barY = by + 110 + i * 14;
        const fillW = Math.max(20, (bw - 32) * (1 - i * 0.18));
        ctx.fillStyle = i === 0 ? "#00f5ff" : "rgba(0, 245, 255, 0.35)";
        ctx.fillRect(bx + 16, barY, fillW, 6);
      }
      ctx.restore();

      // Renderizar partículas
      particlesRef.current.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [collide, ghostY, lockPiece]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="w-full h-full object-contain [image-rendering:pixelated]"
      />
    </div>
  );
};
