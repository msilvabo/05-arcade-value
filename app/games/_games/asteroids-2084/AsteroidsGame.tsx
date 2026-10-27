"use client";

import { FC, useEffect, useRef } from "react";
import { CabinetGameProps } from "../../_lib/types";
import { AsteroidsSkinPalette, getAsteroidsSkinPalette } from "./skins";

export type AsteroidsGameProps = CabinetGameProps;

const W = 800;
const H = 600;

// Utilidades matemáticas y espaciales
const wrap = (v: number, max: number) => ((v % max) + max) % max;
const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);
const rand = (min: number, max: number) => min + Math.random() * (max - min);
const randInt = (min: number, max: number) => Math.floor(rand(min, max + 1));

// Constantes de juego
const POWERUP_DROP_CHANCE = 0.15;
const POWERUP_DURATION = 5;
const POWERUP_TTL = 12;
const TRIPLE_SPREAD = 0.18;

const RADII = [0, 16, 30, 50]; // tamaño 1, 2, 3
const SPEEDS = [0, 85, 55, 32];
const POINTS = [0, 100, 50, 20];

class Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ttl: number;
  radius: number;
  dead: boolean;

  constructor(x: number, y: number, angle: number) {
    this.x = x;
    this.y = y;
    const SPEED = 520;
    this.vx = Math.cos(angle) * SPEED;
    this.vy = Math.sin(angle) * SPEED;
    this.ttl = 1.1;
    this.radius = 2;
    this.dead = false;
  }

  update(dt: number) {
    this.x = wrap(this.x + this.vx * dt, W);
    this.y = wrap(this.y + this.vy * dt, H);
    this.ttl -= dt;
    if (this.ttl <= 0) this.dead = true;
  }

  draw(ctx: CanvasRenderingContext2D, p: AsteroidsSkinPalette) {
    ctx.fillStyle = p.bullet.fill;
    ctx.shadowColor = p.bullet.glowColor;
    ctx.shadowBlur = p.bullet.glowBlur;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

class Asteroid {
  x: number;
  y: number;
  size: number;
  radius: number;
  dead: boolean;
  vx: number;
  vy: number;
  rotSpeed: number;
  rot: number;
  verts: [number, number][];

  constructor(x: number, y: number, size = 3) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.radius = RADII[size];
    this.dead = false;

    const angle = rand(0, Math.PI * 2);
    const speed = SPEEDS[size] + rand(-15, 15);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.rotSpeed = rand(-1.2, 1.2);
    this.rot = rand(0, Math.PI * 2);

    const n = randInt(8, 13);
    this.verts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const r = this.radius * rand(0.6, 1.0);
      this.verts.push([Math.cos(a) * r, Math.sin(a) * r]);
    }
  }

  update(dt: number) {
    this.x = wrap(this.x + this.vx * dt, W);
    this.y = wrap(this.y + this.vy * dt, H);
    this.rot += this.rotSpeed * dt;
  }

  split(): Asteroid[] {
    if (this.size <= 1) return [];
    return [
      new Asteroid(this.x, this.y, this.size - 1),
      new Asteroid(this.x, this.y, this.size - 1),
    ];
  }

  draw(ctx: CanvasRenderingContext2D, p: AsteroidsSkinPalette) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.strokeStyle = p.asteroid.stroke;
    ctx.lineWidth = 1.6;
    ctx.lineJoin = "round";
    ctx.shadowColor = p.asteroid.glowColor;
    ctx.shadowBlur = p.asteroid.glowBlur;
    ctx.beginPath();
    ctx.moveTo(this.verts[0][0], this.verts[0][1]);
    for (let i = 1; i < this.verts.length; i++) {
      ctx.lineTo(this.verts[i][0], this.verts[i][1]);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
}

class PowerUp {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  ttl: number;
  dead: boolean;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    const angle = rand(0, Math.PI * 2);
    const speed = rand(20, 40);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.radius = 12;
    this.ttl = POWERUP_TTL;
    this.dead = false;
  }

  update(dt: number) {
    this.x = wrap(this.x + this.vx * dt, W);
    this.y = wrap(this.y + this.vy * dt, H);
    this.ttl -= dt;
    if (this.ttl <= 0) this.dead = true;
  }

  draw(ctx: CanvasRenderingContext2D, p: AsteroidsSkinPalette) {
    if (this.ttl < 2 && Math.floor(this.ttl * 8) % 2 === 0) return;
    const pulse = 0.85 + Math.sin(performance.now() / 150) * 0.15;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.PI / 4);
    ctx.strokeStyle = p.powerUp.stroke;
    ctx.lineWidth = 2;
    ctx.shadowColor = p.powerUp.glowColor;
    ctx.shadowBlur = p.powerUp.glowBlur;
    const r = this.radius * pulse;
    ctx.strokeRect(-r, -r, r * 2, r * 2);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = p.powerUp.fill;
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = p.powerUp.glowColor;
    ctx.shadowBlur = Math.min(p.powerUp.glowBlur, 6);
    ctx.fillText("3x", this.x, this.y);
    ctx.restore();
  }
}

class Ship {
  x: number;
  y: number;
  angle: number;
  vx: number;
  vy: number;
  radius: number;
  thrusting: boolean;
  invincible: number;
  shootCooldown: number;
  tripleShot: number;
  dead: boolean;

  constructor() {
    this.x = W / 2;
    this.y = H / 2;
    this.angle = -Math.PI / 2;
    this.vx = 0;
    this.vy = 0;
    this.radius = 12;
    this.thrusting = false;
    this.invincible = 3;
    this.shootCooldown = 0;
    this.tripleShot = 0;
    this.dead = false;
  }

  reset() {
    this.x = W / 2;
    this.y = H / 2;
    this.angle = -Math.PI / 2;
    this.vx = 0;
    this.vy = 0;
    this.radius = 12;
    this.thrusting = false;
    this.invincible = 3;
    this.shootCooldown = 0;
    this.dead = false;
  }

  update(dt: number, keys: Record<string, boolean>) {
    if (this.dead) return;
    if (this.invincible > 0) this.invincible -= dt;
    if (this.shootCooldown > 0) this.shootCooldown -= dt;
    if (this.tripleShot > 0) this.tripleShot -= dt;

    const ROT = 3.6; // rad/s
    const THRUST = 270; // px/s²
    const DRAG = 0.987;

    const rotateLeft = keys["ArrowLeft"] || keys["KeyA"];
    const rotateRight = keys["ArrowRight"] || keys["KeyD"];
    const thrust = keys["ArrowUp"] || keys["KeyW"];

    if (rotateLeft) this.angle -= ROT * dt;
    if (rotateRight) this.angle += ROT * dt;

    this.thrusting = !!thrust;
    if (this.thrusting) {
      this.vx += Math.cos(this.angle) * THRUST * dt;
      this.vy += Math.sin(this.angle) * THRUST * dt;
    }

    this.vx *= DRAG;
    this.vy *= DRAG;
    this.x = wrap(this.x + this.vx * dt, W);
    this.y = wrap(this.y + this.vy * dt, H);
  }

  tryShoot(): Bullet[] {
    if (this.shootCooldown > 0 || this.dead) return [];
    this.shootCooldown = 0.2;
    const NOSE = 21;
    const ox = this.x + Math.cos(this.angle) * NOSE;
    const oy = this.y + Math.sin(this.angle) * NOSE;

    if (this.tripleShot > 0) {
      return [
        new Bullet(ox, oy, this.angle - TRIPLE_SPREAD),
        new Bullet(ox, oy, this.angle),
        new Bullet(ox, oy, this.angle + TRIPLE_SPREAD),
      ];
    }
    return [new Bullet(ox, oy, this.angle)];
  }

  draw(ctx: CanvasRenderingContext2D, p: AsteroidsSkinPalette) {
    if (this.dead) return;
    if (this.invincible > 0 && Math.floor(this.invincible * 8) % 2 === 0)
      return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.strokeStyle = p.ship.stroke;
    ctx.lineWidth = 1.6;
    ctx.lineJoin = "round";
    ctx.shadowColor = p.ship.glowColor;
    ctx.shadowBlur = p.ship.glowBlur;

    // Silueta clásica arcade
    ctx.beginPath();
    ctx.moveTo(20, 0); // nariz
    ctx.lineTo(-12, -9); // ala izquierda
    ctx.lineTo(-7, 0); // muesca trasera
    ctx.lineTo(-12, 9); // ala derecha
    ctx.closePath();
    ctx.stroke();

    // Llama del propulsor
    if (this.thrusting && Math.random() > 0.3) {
      ctx.beginPath();
      ctx.moveTo(-8, -4);
      ctx.lineTo(-8 - rand(7, 16), 0);
      ctx.lineTo(-8, 4);
      ctx.strokeStyle = p.ship.thrustStroke;
      ctx.shadowColor = p.ship.thrustGlowColor;
      ctx.shadowBlur = p.ship.glowBlur > 0 ? Math.max(p.ship.glowBlur, 8) : 0;
      ctx.stroke();
    }

    ctx.restore();
  }
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  ttl: number;
  dead: boolean;
  color: string;

  constructor(x: number, y: number, color = "#00f5ff") {
    this.x = x;
    this.y = y;
    const angle = rand(0, Math.PI * 2);
    const speed = rand(30, 140);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.life = rand(0.4, 1.1);
    this.ttl = this.life;
    this.dead = false;
    this.color = color;
  }

  update(dt: number) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.ttl -= dt;
    if (this.ttl <= 0) this.dead = true;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const alpha = Math.max(0, this.ttl / this.life);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.vx * 0.05, this.y - this.vy * 0.05);
    ctx.stroke();
    ctx.restore();
  }
}

export const AsteroidsGame: FC<AsteroidsGameProps> = ({
  isPaused,
  onScoreChange,
  onLivesChange,
  onLevelChange,
  onGameOver,
  restartSignal = 0,
  skin = "clasico",
  retroVariant = "amber",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Paleta activa O(1) con sincronización mediante ref
  const currentPalette = getAsteroidsSkinPalette(skin, retroVariant);
  const paletteRef = useRef(currentPalette);

  useEffect(() => {
    paletteRef.current = currentPalette;
  }, [currentPalette]);

  // Referencias a callbacks para no reiniciar efectos
  const onScoreChangeRef = useRef(onScoreChange);
  const onLivesChangeRef = useRef(onLivesChange);
  const onLevelChangeRef = useRef(onLevelChange);
  const onGameOverRef = useRef(onGameOver);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    onScoreChangeRef.current = onScoreChange;
    onLivesChangeRef.current = onLivesChange;
    onLevelChangeRef.current = onLevelChange;
    onGameOverRef.current = onGameOver;
    isPausedRef.current = isPaused;
  }, [onScoreChange, onLivesChange, onLevelChange, onGameOver, isPaused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let lastTime: number | null = null;

    // Estado del juego
    let ship = new Ship();
    let bullets: Bullet[] = [];
    let asteroids: Asteroid[] = [];
    let particles: Particle[] = [];
    let powerUps: PowerUp[] = [];

    let score = 0;
    let lives = 3;
    let level = 1;
    let state: "playing" | "dead" | "gameover" = "playing";
    let deadTimer = 0;
    let powerUpSpawned = false;
    let killsSinceSpawn = 0;

    const keys: Record<string, boolean> = {};
    const justPressed: Record<string, boolean> = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevenir desplazamiento con flechas o barra espaciadora
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(
          e.code
        )
      ) {
        e.preventDefault();
      }
      if (!keys[e.code]) justPressed[e.code] = true;
      keys[e.code] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.code] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const pressed = (code: string) => {
      const val = justPressed[code];
      justPressed[code] = false;
      return val;
    };

    const spawnAsteroids = (count: number) => {
      const SAFE_DIST = 140;
      for (let i = 0; i < count; i++) {
        let x: number, y: number;
        do {
          x = rand(0, W);
          y = rand(0, H);
        } while (Math.hypot(x - W / 2, y - H / 2) < SAFE_DIST);
        asteroids.push(new Asteroid(x, y, 3));
      }
    };

    const explode = (x: number, y: number, count = 10) => {
      const pColors = paletteRef.current.particles;
      for (let i = 0; i < count; i++) {
        const color = pColors[Math.floor(Math.random() * pColors.length)];
        particles.push(new Particle(x, y, color));
      }
    };

    const killShip = () => {
      explode(ship.x, ship.y, 18);
      ship.dead = true;
      lives--;
      onLivesChangeRef.current?.(lives);

      if (lives <= 0) {
        state = "gameover";
        onGameOverRef.current?.(score);
      } else {
        state = "dead";
        deadTimer = 2;
      }
    };

    const nextLevel = () => {
      level++;
      onLevelChangeRef.current?.(level);
      bullets = [];
      particles = [];
      powerUps = [];
      powerUpSpawned = false;
      killsSinceSpawn = 0;
      ship.reset();
      spawnAsteroids(3 + level);
    };

    const initGame = () => {
      ship = new Ship();
      bullets = [];
      asteroids = [];
      particles = [];
      powerUps = [];
      powerUpSpawned = false;
      killsSinceSpawn = 0;
      score = 0;
      lives = 3;
      level = 1;
      state = "playing";

      onScoreChangeRef.current?.(score);
      onLivesChangeRef.current?.(lives);
      onLevelChangeRef.current?.(level);

      spawnAsteroids(4);
    };

    initGame();

    const update = (dt: number) => {
      if (isPausedRef.current) return;

      if (state === "gameover") {
        particles.forEach((p) => p.update(dt));
        particles = particles.filter((p) => !p.dead);
        return;
      }

      if (state === "dead") {
        deadTimer -= dt;
        particles.forEach((p) => p.update(dt));
        particles = particles.filter((p) => !p.dead);
        asteroids.forEach((a) => a.update(dt));
        if (deadTimer <= 0) {
          state = "playing";
          ship.reset();
        }
        return;
      }

      // Disparar
      if (pressed("Space")) {
        bullets.push(...ship.tryShoot());
      }

      ship.update(dt, keys);
      bullets.forEach((b) => b.update(dt));
      asteroids.forEach((a) => a.update(dt));
      particles.forEach((p) => p.update(dt));
      powerUps.forEach((p) => p.update(dt));

      bullets = bullets.filter((b) => !b.dead);
      particles = particles.filter((p) => !p.dead);
      powerUps = powerUps.filter((p) => !p.dead);

      // Colisión nave vs power-up
      for (const p of powerUps) {
        if (!p.dead && dist(ship, p) < ship.radius + p.radius) {
          p.dead = true;
          ship.tripleShot = POWERUP_DURATION;
          explode(p.x, p.y, 8);
        }
      }

      // Colisión bala vs asteroide
      const newAsteroids: Asteroid[] = [];
      for (const b of bullets) {
        for (const a of asteroids) {
          if (!a.dead && !b.dead && dist(b, a) < a.radius) {
            b.dead = true;
            a.dead = true;
            score += POINTS[a.size];
            onScoreChangeRef.current?.(score);

            explode(a.x, a.y, a.size * 6);
            newAsteroids.push(...a.split());

            if (!powerUpSpawned) {
              killsSinceSpawn++;
              const guaranteed = killsSinceSpawn >= 5;
              if (guaranteed || Math.random() < POWERUP_DROP_CHANCE) {
                powerUps.push(new PowerUp(a.x, a.y));
                powerUpSpawned = true;
              }
            }
          }
        }
      }
      asteroids = asteroids.filter((a) => !a.dead).concat(newAsteroids);
      bullets = bullets.filter((b) => !b.dead);

      // Colisión nave vs asteroide
      if (ship.invincible <= 0) {
        for (const a of asteroids) {
          if (dist(ship, a) < ship.radius + a.radius * 0.82) {
            killShip();
            break;
          }
        }
      }

      // Nivel completado
      if (asteroids.length === 0) {
        nextLevel();
      }
    };

    const draw = () => {
      const p = paletteRef.current;

      // Fondo del lienzo oscuro según skin
      ctx.fillStyle = p.background;
      ctx.fillRect(0, 0, W, H);

      // Grilla estelar vectorial tenue según skin
      ctx.strokeStyle = p.gridLine;
      ctx.lineWidth = 1;
      const step = 50;
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

      particles.forEach((pt) => pt.draw(ctx));
      asteroids.forEach((a) => a.draw(ctx, p));
      powerUps.forEach((pu) => pu.draw(ctx, p));
      bullets.forEach((b) => b.draw(ctx, p));
      ship.draw(ctx, p);

      // Indicador sutil de Power-up activo (3x triple disparo)
      if (ship.tripleShot > 0) {
        ctx.save();
        ctx.fillStyle = p.hudText.fill;
        ctx.font = "bold 13px monospace";
        ctx.textAlign = "left";
        ctx.shadowColor = p.hudText.glowColor;
        ctx.shadowBlur = p.hudText.glowBlur;
        ctx.fillText(
          `⚡ TRIPLE DISPARO: ${ship.tripleShot.toFixed(1)}s`,
          18,
          28
        );
        ctx.restore();
      }
    };

    const loop = (ts: number) => {
      const dt = lastTime === null ? 0 : Math.min((ts - lastTime) / 1000, 0.05);
      lastTime = ts;

      update(dt);
      draw();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [restartSignal]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="w-full h-full object-contain [image-rendering:pixelated]"
      />
    </div>
  );
};
