"use client";

import React, { FC, useEffect, useRef } from "react";
import { CabinetGameProps } from "../../_lib/types";
import { ParticlePool } from "@/lib/performance/particle-pool";
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
import { ArkanoidSkinPalette, getArkanoidSkinPalette } from "./skins";

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

const MAX_EXPLOSION_SLOTS = 24;
const TRAIL_MAX = 6;
const AUDIO_POOL_SIZE = 4;

interface BlockEntity {
  x: number;
  y: number;
  w: number;
  h: number;
  color: BlockColor;
  alive: boolean;
}

interface ExplosionSlot {
  active: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  color: BlockColor;
  elapsed: number;
}

const ArkanoidGameComponent: FC<CabinetGameProps> = ({
  isPaused,
  onScoreIncrement,
  onScoreChange,
  onLivesChange,
  onLevelChange,
  onGameOver,
  restartSignal,
  audioOn = true,
  volume = 0.7,
  skin = "clasico",
  retroVariant = "amber",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Paleta activa O(1) con sincronización reactiva mediante Ref
  const currentPalette = getArkanoidSkinPalette(skin, retroVariant);
  const paletteRef = useRef<ArkanoidSkinPalette>(currentPalette);

  useEffect(() => {
    paletteRef.current = currentPalette;
  }, [currentPalette]);

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

  // Pool de instancias de audio HTML5 pre-cargadas (Zero-Alloc en colisiones)
  const bouncePoolRef = useRef<HTMLAudioElement[]>([]);
  const breakPoolRef = useRef<HTMLAudioElement[]>([]);
  const bouncePoolIdx = useRef(0);
  const breakPoolIdx = useRef(0);

  useEffect(() => {
    bouncePoolRef.current = Array.from({ length: AUDIO_POOL_SIZE }, () => {
      const a = new Audio(SFX_BALL_BOUNCE);
      a.preload = "auto";
      return a;
    });
    breakPoolRef.current = Array.from({ length: AUDIO_POOL_SIZE }, () => {
      const a = new Audio(SFX_BREAK_SOUND);
      a.preload = "auto";
      return a;
    });
  }, []);

  const playBounceSound = () => {
    if (!audioOnRef.current || bouncePoolRef.current.length === 0) return;
    try {
      const pool = bouncePoolRef.current;
      const sound = pool[bouncePoolIdx.current % pool.length];
      bouncePoolIdx.current++;
      sound.volume = Math.max(0, Math.min(1, volumeRef.current));
      sound.currentTime = 0;
      sound.play().catch(() => {});
    } catch {
      // Audio autoplay bloqueado
    }
  };

  const playBreakSound = () => {
    if (!audioOnRef.current || breakPoolRef.current.length === 0) return;
    try {
      const pool = breakPoolRef.current;
      const sound = pool[breakPoolIdx.current % pool.length];
      breakPoolIdx.current++;
      sound.volume = Math.max(0, Math.min(1, volumeRef.current));
      sound.currentTime = 0;
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

    // Búfer pre-alocado para estela de la bola (Zero-Alloc)
    const trailX = new Float32Array(TRAIL_MAX);
    const trailY = new Float32Array(TRAIL_MAX);
    let trailCount = 0;

    let blocks: BlockEntity[] = [];

    // Banco pre-alocado de explosiones (Zero-Alloc, sin .filter())
    let explosionNextIndex = 0;
    const explosions: ExplosionSlot[] = Array.from(
      { length: MAX_EXPLOSION_SLOTS },
      () => ({
        active: false,
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        color: "cyan",
        elapsed: 0,
      })
    );

    // Object Pool para partículas de destrucción
    const particlePool = new ParticlePool(200);

    const keys = { ArrowLeft: false, ArrowRight: false, a: false, d: false };

    // Offscreen Canvas Cache para rejilla y fondo estáticos O(1)
    const bgCanvas = document.createElement("canvas");
    bgCanvas.width = W;
    bgCanvas.height = H;
    const bgCtx = bgCanvas.getContext("2d");
    let lastRenderedSkinKey = "";

    const renderBackgroundCache = () => {
      if (!bgCtx) return;
      const p = paletteRef.current;
      bgCtx.fillStyle = p.background;
      bgCtx.fillRect(0, 0, W, H);

      bgCtx.strokeStyle = p.gridLine;
      bgCtx.lineWidth = 1;
      const step = 40;
      bgCtx.beginPath();
      for (let x = step; x < W; x += step) {
        bgCtx.moveTo(x, 0);
        bgCtx.lineTo(x, H);
      }
      for (let y = step; y < H; y += step) {
        bgCtx.moveTo(0, y);
        bgCtx.lineTo(W, y);
      }
      bgCtx.stroke();
      lastRenderedSkinKey = `${p.id}_${p.variant ?? ""}`;
    };

    renderBackgroundCache();

    // Carga de spritesheet
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
      trailCount = 0;
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

      // Desactivar slots de explosión y limpiar pool
      for (let i = 0; i < MAX_EXPLOSION_SLOTS; i++) {
        explosions[i].active = false;
      }
      particlePool.clear();
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

    // Soporte táctil directo sobre el canvas (arrastre con dedo)
    const updatePaddleFromTouch = (touch: Touch) => {
      if (isPausedRef.current || gameState !== "playing") return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0) return;
      const scaleX = canvas.width / rect.width;
      const touchX = (touch.clientX - rect.left) * scaleX;
      paddle.x = Math.max(0, Math.min(W - paddle.w, touchX - paddle.w / 2));
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      e.preventDefault();
      updatePaddleFromTouch(e.touches[0]);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      e.preventDefault();
      updatePaddleFromTouch(e.touches[0]);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });
    canvas.addEventListener("touchcancel", handleTouchEnd, { passive: false });

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

      // Registro de estela de la bola in-place (Zero-Alloc)
      const limit = Math.min(trailCount, TRAIL_MAX - 1);
      for (let i = limit; i > 0; i--) {
        trailX[i] = trailX[i - 1];
        trailY[i] = trailY[i - 1];
      }
      trailX[0] = ball.x + ball.w / 2;
      trailY[0] = ball.y + ball.h / 2;
      if (trailCount < TRAIL_MAX) {
        trailCount++;
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

      // Rebote en la paleta Vaus con modulación angular
      if (
        ball.vy > 0 &&
        ball.x + ball.w > paddle.x &&
        ball.x < paddle.x + paddle.w &&
        ball.y + ball.h >= paddle.y &&
        ball.y + ball.h <= paddle.y + paddle.h + 8
      ) {
        ball.y = paddle.y - ball.h;
        ball.vy = -Math.abs(ball.vy);

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

          // Activar slot de explosión pre-alocado
          let slot = explosions.find((e) => !e.active);
          if (!slot) {
            slot = explosions[explosionNextIndex];
            explosionNextIndex = (explosionNextIndex + 1) % MAX_EXPLOSION_SLOTS;
          }
          slot.active = true;
          slot.x = b.x;
          slot.y = b.y;
          slot.w = b.w;
          slot.h = b.h;
          slot.color = b.color;
          slot.elapsed = 0;

          // Emisión de partículas mediante ParticlePool (Zero-Alloc)
          const p = paletteRef.current;
          const blockColorHex = p.blockColors[b.color] || p.paddle.fill;
          const paletteColors =
            p.particles.length > 0 ? p.particles : [blockColorHex];
          const particleCount = 10;
          for (let k = 0; k < particleCount; k++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 40 + Math.random() * 120;
            const pColor = paletteColors[k % paletteColors.length];
            particlePool.spawn(
              b.x + b.w / 2,
              b.y + b.h / 2,
              Math.cos(angle) * speed,
              Math.sin(angle) * speed,
              2 + Math.random() * 3,
              pColor,
              2.5 + Math.random() * 1.5,
              1.0
            );
          }

          score += 10;
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
          break;
        }
      }

      // Actualizar partículas cinemáticas en ParticlePool
      particlePool.update(dt);

      // Actualizar slots de explosión in-place (Zero-Alloc, sin .filter())
      for (let i = 0; i < MAX_EXPLOSION_SLOTS; i++) {
        const exp = explosions[i];
        if (!exp.active) continue;
        exp.elapsed += dt * 1000;
        if (exp.elapsed >= EXPLOSION_DURATION) {
          exp.active = false;
        }
      }

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
      const p = paletteRef.current;

      // 1. Blit O(1) de fondo y rejilla pre-renderizada
      const currentSkinKey = `${p.id}_${p.variant ?? ""}`;
      if (currentSkinKey !== lastRenderedSkinKey) {
        renderBackgroundCache();
      }
      ctx.drawImage(bgCanvas, 0, 0);

      // 2. Estela fosforescente de la bola (sólo activa con resplandor neón/retro)
      if (p.ball.glowBlur > 0 && trailCount > 1) {
        ctx.save();
        for (let i = 1; i < trailCount; i++) {
          const alpha = (1 - i / trailCount) * 0.35;
          const r = (ball.w / 2) * (1 - (i / trailCount) * 0.45);
          ctx.fillStyle = p.ball.fill;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(trailX[i], trailY[i], Math.max(1, r), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 3. Renderizado de bloques con reset estricto de sombras
      for (const b of blocks) {
        if (!b.alive) continue;
        if (p.useSpritesheet && ssLoaded && ssImg) {
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
          // Renderizado procedural vectorial adaptado al skin
          const hex = p.blockColors[b.color] || p.paddle.fill;
          ctx.save();
          ctx.fillStyle = hex;
          ctx.shadowColor =
            p.blockGlowColor !== "transparent" ? hex : "transparent";
          ctx.shadowBlur = p.blockGlowBlur;
          ctx.beginPath();
          ctx.roundRect(b.x + 1, b.y + 1, b.w - 2, b.h - 2, 3);
          ctx.fill();

          // Bisel de luz superior-izquierdo y reseteo estricto de sombra
          ctx.shadowBlur = 0;
          ctx.shadowColor = "transparent";
          ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(b.x + 2, b.y + b.h - 3);
          ctx.lineTo(b.x + 2, b.y + 2);
          ctx.lineTo(b.x + b.w - 3, b.y + 2);
          ctx.stroke();

          // Sombra inferior-derecha
          ctx.strokeStyle = "rgba(0, 0, 0, 0.45)";
          ctx.beginPath();
          ctx.moveTo(b.x + b.w - 2, b.y + 2);
          ctx.lineTo(b.x + b.w - 2, b.y + b.h - 2);
          ctx.lineTo(b.x + 2, b.y + b.h - 2);
          ctx.stroke();
          ctx.restore();
        }
      }

      // 4. Renderizado de explosiones (spritesheet o procedural shockwaves)
      for (let i = 0; i < MAX_EXPLOSION_SLOTS; i++) {
        const exp = explosions[i];
        if (!exp.active) continue;

        const frameIndex = Math.min(
          Math.floor((exp.elapsed / EXPLOSION_DURATION) * 4),
          3
        );
        const frames = EXPLOSION_FRAMES[exp.color];
        if (
          p.useSpritesheet &&
          ssLoaded &&
          ssImg &&
          frames &&
          frames[frameIndex]
        ) {
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
          // Onda de choque sutil procedural con reset de sombra
          const pProgress = exp.elapsed / EXPLOSION_DURATION;
          const alpha = Math.max(0, 1 - pProgress);
          const hex = p.blockColors[exp.color] || p.paddle.fill;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = hex;
          ctx.lineWidth = 1.2;
          ctx.strokeRect(
            exp.x - pProgress * 4,
            exp.y - pProgress * 3,
            exp.w + pProgress * 8,
            exp.h + pProgress * 6
          );
          ctx.restore();
        }
      }

      // 5. Renderizado de partículas de alta velocidad en ParticlePool
      particlePool.draw(ctx);

      // 6. Renderizado de la paleta Vaus
      if (p.useSpritesheet && ssLoaded && ssImg) {
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
        ctx.fillStyle = p.paddle.fill;
        ctx.strokeStyle = p.paddle.stroke;
        ctx.lineWidth = 2;
        ctx.shadowColor = p.paddle.glowColor;
        ctx.shadowBlur = p.paddle.glowBlur;

        // Cápsula Vaus estilizada con bordes biselados
        ctx.beginPath();
        ctx.roundRect(paddle.x, paddle.y, paddle.w, paddle.h, 6);
        ctx.fill();
        ctx.stroke();

        // Reseteo estricto de sombra
        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";

        // Núcleo de energía de la cápsula
        ctx.fillStyle = p.paddle.accent;
        ctx.fillRect(paddle.x + 8, paddle.y + 4, paddle.w - 16, 2);

        // Disipadores laterales de fotones
        ctx.fillStyle = p.paddle.stroke;
        ctx.fillRect(paddle.x + 2, paddle.y + 3, 4, paddle.h - 6);
        ctx.fillRect(paddle.x + paddle.w - 6, paddle.y + 3, 4, paddle.h - 6);
        ctx.restore();
      }

      // 7. Renderizado de la bola de plasma
      if (p.useSpritesheet && ssLoaded && ssImg) {
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
        ctx.fillStyle = p.ball.fill;
        ctx.shadowColor = p.ball.glowColor;
        ctx.shadowBlur = p.ball.glowBlur;
        ctx.beginPath();
        ctx.arc(
          ball.x + ball.w / 2,
          ball.y + ball.h / 2,
          ball.w / 2,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Reseteo estricto de sombra
        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";

        // Núcleo blanco de alta energía
        if (p.ball.glowBlur > 0) {
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(
            ball.x + ball.w / 2 - 2,
            ball.y + ball.h / 2 - 2,
            ball.w / 5,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
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
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [restartSignal]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden select-none cursor-crosshair touch-none"
      style={{
        touchAction: "none",
        contain: "layout paint",
        willChange: "transform",
      }}
    >
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="w-full h-full object-contain [image-rendering:pixelated] touch-none select-none"
        style={{
          touchAction: "none",
          contain: "layout paint",
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      />
    </div>
  );
};

export const ArkanoidGame = React.memo(ArkanoidGameComponent);
ArkanoidGame.displayName = "ArkanoidGame";
