export interface PooledParticle {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  decay: number;
}

/**
 * Object Pool de alto rendimiento para partículas 2D.
 * Elimina el 100% de las asignaciones de objetos en caliente y las llamadas
 * a Array.filter() dentro del requestAnimationFrame, erradicando las pausas
 * de Garbage Collection (GC jank).
 */
export class ParticlePool {
  private pool: PooledParticle[];
  private maxSize: number;
  private nextIndex: number = 0;

  constructor(maxSize = 250) {
    this.maxSize = maxSize;
    this.pool = new Array(maxSize).fill(null).map(() => ({
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      size: 0,
      alpha: 0,
      color: "#000",
      decay: 0,
    }));
  }

  /**
   * Activa y reutiliza una partícula pre-alocada del pool.
   * Utiliza búsqueda rápida y fallback circular FIFO para garantizar
   * que nunca se cree un objeto nuevo en el heap.
   */
  public spawn(
    x: number,
    y: number,
    vx: number,
    vy: number,
    size: number,
    color: string,
    decay: number,
    alpha = 1.0
  ): void {
    // 1. Intentar encontrar una partícula inactiva
    let target = this.pool.find((p) => !p.active);

    // 2. Si todas están activas (ráfaga masiva), reciclamos la más antigua circularmente
    if (!target) {
      target = this.pool[this.nextIndex];
      this.nextIndex = (this.nextIndex + 1) % this.maxSize;
    }

    target.active = true;
    target.x = x;
    target.y = y;
    target.vx = vx;
    target.vy = vy;
    target.size = size;
    target.color = color;
    target.decay = decay;
    target.alpha = alpha;
  }

  /**
   * Actualiza cinemática y alpha de todas las partículas activas sin crear arrays intermedios.
   */
  public update(dt: number): void {
    for (let i = 0; i < this.maxSize; i++) {
      const p = this.pool[i];
      if (!p.active) continue;

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.alpha -= p.decay * dt;

      if (p.alpha <= 0) {
        p.active = false;
      }
    }
  }

  /**
   * Dibuja todas las partículas activas en el canvas en un solo pase optimizado.
   */
  public draw(ctx: CanvasRenderingContext2D): void {
    for (let i = 0; i < this.maxSize; i++) {
      const p = this.pool[i];
      if (!p.active || p.alpha <= 0) continue;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  /**
   * Actualiza y dibuja en un único paso para máxima localidad de caché.
   */
  public updateAndDraw(dt: number, ctx: CanvasRenderingContext2D): void {
    this.update(dt);
    this.draw(ctx);
  }

  /**
   * Desactiva todas las partículas instantáneamente (al reiniciar nivel o juego).
   */
  public clear(): void {
    for (let i = 0; i < this.maxSize; i++) {
      this.pool[i].active = false;
    }
    this.nextIndex = 0;
  }

  /**
   * Retorna el número de partículas actualmente activas en pantalla.
   */
  public getActiveCount(): number {
    let count = 0;
    for (let i = 0; i < this.maxSize; i++) {
      if (this.pool[i].active) count++;
    }
    return count;
  }
}
