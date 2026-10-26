"use client";

import { FC, useEffect, useRef } from "react";
import { CabinetGameProps } from "../../_lib/types";
import {
  SPRITES,
  EXPLOSION_FRAMES,
  EXPLOSION_DURATION,
  SPRITESHEET_URL,
  SFX_BALL_BOUNCE,
  SFX_BREAK_SOUND,
  BlockColor,
} from "./spritesheet";
import { LEVELS } from "./levels";

const W = 800;
const H = 600;

const PADDLE_SPEED = 400;
const BLOCK_COLS = 10;
const BLOCK_W = 64;
const BLOCK_H = 24;
const BLOCKS_ORIGIN_X = (W - BLOCK_COLS * BLOCK_W) / 2; // 80 px
const BLOCKS_ORIGIN_Y = 80;
const BASE_BALL_VX = 200;
const BASE_BALL_VY = -300;

interface BlockEntity {
  x: number;
  y: number;
  w: number;
  h: number;
  color: BlockColor;
  alive: boolean;
}

interface ExplosionEntity {
  x: number;
  y: number;
  w: number;
  h: number;
  color: BlockColor;
  elapsed: number;
}

const COLOR_MAP: Record<BlockColor, string> = {
  red: "#ff3344",
  yellow: "#ffea00",
  cyan: "#00f0ff",
  magenta: "#ff00ea",
  hotpink: "#ff1493",
  green: "#00ff66",
  gray: "#8899a6",
};

export const ArkanoidGame: FC<CabinetGameProps> = ({
  isPaused,
  onScoreIncrement,
  onScoreChange,
  onLivesChange,
  onLevelChange,
  onGameOver,
  restartSignal,
  audioOn = true,
  volume = 0.7,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Referencias para callbacks y estado de pausa sin recrear el bucle de renderizado
  const isPausedRef = useRef(isPaused);
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const audioOnRef = useRef(audioOn);
  const volumeRef = useRef(volume);
  useEffect(() => {
    audioOnRef.current = audioOn;
    volumeRef.current = volume;
  }, [audioOn, volume]);

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

  // Instancias de audio HTML5 pre-cargadas
  const bounceAudioRef = useRef<HTMLAudioElement | null>(null);
  const breakAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const a1 = new Audio(SFX_BALL_BOUNCE);
    const a2 = new Audio(SFX_BREAK_SOUND);
    a1.preload = "auto";
    a2.preload = "auto";
    bounceAudioRef.current = a1;
    breakAudioRef.current = a2;
  }, []);

  const playBounceSound = () => {
    if (!audioOnRef.current || !bounceAudioRef.current) return;
    try {
      const sound = bounceAudioRef.current.cloneNode() as HTMLAudioElement;
      sound.volume = Math.max(0, Math.min(1, volumeRef.current));
      sound.play().catch(() => {});
    } catch {
      // Audio autoplay bloqueado
    }
  };

  const playBreakSound = () => {
    if (!audioOnRef.current || !breakAudioRef.current) return;
    try {
      const sound = breakAudioRef.current.cloneNode() as HTMLAudioElement;
      sound.volume = Math.max(0, Math.min(1, volumeRef.current));
      sound.play().catch(() => {});
    } catch {
      // Audio autoplay bloqueado
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Estado del juego
    let currentLevel = 1;
    let score = 0;
    let lives = 3;
    let gameState: "playing" | "gameover" | "win" = "playing";

    const paddle = { x: (W - 81) / 2, y: 560, w: 81, h: 14 };
    const ball = {
      x: (W - 16) / 2,
      y: 560 - 16,
      w: 16,
      h: 16,
      vx: BASE_BALL_VX,
      vy: BASE_BALL_VY,
    };

    let blocks: BlockEntity[] = [];
    let explosions: ExplosionEntity[] = [];
    const keys = { ArrowLeft: false, ArrowRight: false, a: false, d: false };

    // Carga de spritesheet con fallback procedimental
    let ssImg: HTMLImageElement | null = null;
    let ssLoaded = false;
    const img = new Image();
    img.src = SPRITESHEET_URL;
    img.onload = () => {
      ssImg = img;
      ssLoaded = true;
    };

    const initBall = () => {
      const speed = LEVELS[currentLevel - 1]?.speed ?? 1.0;
      ball.x = paddle.x + (paddle.w - ball.w) / 2;
      ball.y = paddle.y - ball.h - 1;
      ball.vx = BASE_BALL_VX * speed;
      ball.vy = BASE_BALL_VY * speed;
    };

    const loadLevel = (n: number) => {
      currentLevel = n;
      onLevelChangeRef.current?.(currentLevel);
      const level = LEVELS[currentLevel - 1];
      if (!level) return;

      blocks = level.blocks.map((b) => ({
        x: BLOCKS_ORIGIN_X + b.col * BLOCK_W,
        y: BLOCKS_ORIGIN_Y + b.row * BLOCK_H,
        w: BLOCK_W,
        h: BLOCK_H,
        color: b.color,
        alive: true,
      }));
      explosions = [];
      initBall();
    };

    // Inicializar HUD de React
    onScoreChangeRef.current?.(score);
    onLivesChangeRef.current?.(lives);
    onLevelChangeRef.current?.(currentLevel);
    loadLevel(1);

    // Eventos de teclado
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
      }
      if (e.key === "ArrowLeft") keys.ArrowLeft = true;
      if (e.key === "ArrowRight") keys.ArrowRight = true;
      if (e.key === "a" || e.key === "A") keys.a = true;
      if (e.key === "d" || e.key === "D") keys.d = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") keys.ArrowLeft = false;
      if (e.key === "ArrowRight") keys.ArrowRight = false;
      if (e.key === "a" || e.key === "A") keys.a = false;
      if (e.key === "d" || e.key === "D") keys.d = false;
    };

    // Movimiento con ratón / puntero sobre el área de juego
    const handleMouseMove = (e: MouseEvent) => {
      if (isPausedRef.current || gameState !== "playing") return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0) return;
      const scaleX = canvas.width / rect.width;
      const mouseX = (e.clientX - rect.left) * scaleX;
      paddle.x = Math.max(0, Math.min(W - paddle.w, mouseX - paddle.w / 2));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMove);

    const collideAABB = (b: BlockEntity) => {
      return (
        ball.x < b.x + b.w &&
        ball.x + ball.w > b.x &&
        ball.y < b.y + b.h &&
        ball.y + ball.h > b.y
      );
    };

    const update = (dt: number) => {
      if (gameState !== "playing") return;

      // Movimiento lateral por teclado
      if (keys.ArrowLeft || keys.a) {
        paddle.x = Math.max(0, paddle.x - PADDLE_SPEED * dt);
      }
      if (keys.ArrowRight || keys.d) {
        paddle.x = Math.min(W - paddle.w, paddle.x + PADDLE_SPEED * dt);
      }

      // Movimiento de la bola
      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;

      // Rebotes en bordes (izquierdo, derecho, superior)
      if (ball.x <= 0) {
        ball.x = 0;
        ball.vx = Math.abs(ball.vx);
        playBounceSound();
      } else if (ball.x + ball.w >= W) {
        ball.x = W - ball.w;
        ball.vx = -Math.abs(ball.vx);
        playBounceSound();
      }
      if (ball.y <= 0) {
        ball.y = 0;
        ball.vy = Math.abs(ball.vy);
        playBounceSound();
      }

      // Rebote en la paleta Vaus con cálculo de ángulo según punto de impacto
      if (
        ball.vy > 0 &&
        ball.x + ball.w > paddle.x &&
        ball.x < paddle.x + paddle.w &&
        ball.y + ball.h >= paddle.y &&
        ball.y + ball.h <= paddle.y + paddle.h + 8
      ) {
        ball.y = paddle.y - ball.h;
        ball.vy = -Math.abs(ball.vy);

        // Modulación angular según el impacto relativo (-1 a 1)
        const hitOffset =
          (ball.x + ball.w / 2 - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
        const currentSpeed = LEVELS[currentLevel - 1]?.speed ?? 1.0;
        ball.vx = hitOffset * Math.abs(BASE_BALL_VX) * 1.35 * currentSpeed;
        playBounceSound();
      }

      // Colisiones contra bloques
      for (const b of blocks) {
        if (!b.alive) continue;
        if (collideAABB(b)) {
          b.alive = false;
          playBreakSound();
          explosions.push({
            x: b.x,
            y: b.y,
            w: b.w,
            h: b.h,
            color: b.color,
            elapsed: 0,
          });

          score += 10;
          onScoreChangeRef.current?.(score);
          onScoreIncrementRef.current?.(10);
          ball.vy = -ball.vy;

          if (blocks.every((bk) => !bk.alive)) {
            if (currentLevel < 5) {
              loadLevel(currentLevel + 1);
            } else {
              gameState = "win";
              onGameOverRef.current?.(score);
            }
          }
          break; // Un bloque por fotograma
        }
      }

      // Actualizar partículas de explosión
      for (const exp of explosions) {
        exp.elapsed += dt * 1000;
      }
      explosions = explosions.filter((exp) => exp.elapsed < EXPLOSION_DURATION);

      // Pérdida de bola por el borde inferior
      if (ball.y > H) {
        lives--;
        onLivesChangeRef.current?.(lives);
        if (lives <= 0) {
          lives = 0;
          gameState = "gameover";
          onGameOverRef.current?.(score);
        } else {
          initBall();
        }
      }
    };

    const draw = () => {
      // Fondo negro de la cabina
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, W, H);

      // Rejilla sutil retro de fondo
      ctx.save();
      ctx.strokeStyle = "rgba(0, 240, 255, 0.035)";
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = step; x < W; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = step; y < H; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      ctx.restore();

      // Renderizado de bloques
      for (const b of blocks) {
        if (!b.alive) continue;
        if (ssLoaded && ssImg) {
          const sp = SPRITES.blocks[b.color];
          if (sp) {
            ctx.drawImage(
              ssImg,
              sp.sx,
              sp.sy,
              sp.sw,
              sp.sh,
              b.x,
              b.y,
              b.w,
              b.h
            );
          }
        } else {
          // Fallback vectorial con resplandor neón
          const hex = COLOR_MAP[b.color] || "#ffffff";
          ctx.save();
          ctx.fillStyle = hex;
          ctx.shadowColor = hex;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.roundRect(b.x + 1, b.y + 1, b.w - 2, b.h - 2, 3);
          ctx.fill();
          ctx.restore();
        }
      }

      // Renderizado de explosiones
      for (const exp of explosions) {
        const frameIndex = Math.min(
          Math.floor((exp.elapsed / EXPLOSION_DURATION) * 4),
          3
        );
        const frames = EXPLOSION_FRAMES[exp.color];
        if (ssLoaded && ssImg && frames && frames[frameIndex]) {
          const f = frames[frameIndex];
          ctx.drawImage(
            ssImg,
            f.sx,
            f.sy,
            f.sw,
            f.sh,
            exp.x,
            exp.y,
            exp.w,
            exp.h
          );
        } else {
          // Fallback de partículas
          const hex = COLOR_MAP[exp.color] || "#ffffff";
          ctx.save();
          ctx.fillStyle = hex;
          ctx.shadowColor = hex;
          ctx.shadowBlur = 10;
          const pProgress = exp.elapsed / EXPLOSION_DURATION;
          const pSize = Math.max(2, (exp.w / 4) * (1 - pProgress));
          ctx.fillRect(
            exp.x + exp.w / 2 - pSize / 2,
            exp.y + exp.h / 2 - pSize / 2,
            pSize,
            pSize
          );
          ctx.restore();
        }
      }

      // Renderizado de la paleta Vaus
      if (ssLoaded && ssImg) {
        const sp = SPRITES.paddle;
        ctx.drawImage(
          ssImg,
          sp.sx,
          sp.sy,
          sp.sw,
          sp.sh,
          paddle.x,
          paddle.y,
          paddle.w,
          paddle.h
        );
      } else {
        ctx.save();
        ctx.fillStyle = "#00f0ff";
        ctx.shadowColor = "#00f0ff";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(paddle.x, paddle.y, paddle.w, paddle.h, 6);
        ctx.fill();
        ctx.restore();
      }

      // Renderizado de la bola
      if (ssLoaded && ssImg) {
        const sp = SPRITES.ball;
        ctx.drawImage(
          ssImg,
          sp.sx,
          sp.sy,
          sp.sw,
          sp.sh,
          ball.x,
          ball.y,
          ball.w,
          ball.h
        );
      } else {
        ctx.save();
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#00f0ff";
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(
          ball.x + ball.w / 2,
          ball.y + ball.h / 2,
          ball.w / 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.restore();
      }
    };

    let animId: number;
    let lastTime: number | null = null;

    const loop = (ts: number) => {
      const dt = lastTime === null ? 0 : Math.min((ts - lastTime) / 1000, 0.05);
      lastTime = ts;

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
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [restartSignal]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden select-none cursor-crosshair"
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
