"use client";

import { FC, useState, useEffect, useRef } from "react";

interface ArkanoidPresentationProps {
  isPaused: boolean;
  onScoreIncrement: (pts: number) => void;
}

export const ArkanoidPresentation: FC<ArkanoidPresentationProps> = ({
  isPaused,
  onScoreIncrement,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [paddleX, setPaddleX] = useState<number>(50); // porcentaje 0 a 100
  const [ballPos, setBallPos] = useState<{ x: number; y: number }>({ x: 50, y: 70 });
  const [ballVel, setBallVel] = useState<{ dx: number; dy: number }>({ dx: 0.45, dy: -0.6 });
  const [hitEffect, setHitEffect] = useState<{ x: number; y: number } | null>(null);

  // Manejo de movimiento del mouse sobre el área de juego
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isPaused) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = ((e.clientX - rect.left) / rect.width) * 100;
    setPaddleX(Math.max(15, Math.min(85, relativeX)));
  };

  // Manejo de teclas A / D / Flechas
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused) return;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        setPaddleX((prev) => Math.max(15, prev - 5));
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        setPaddleX((prev) => Math.min(85, prev + 5));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPaused]);

  // Bucle de animación visual de la esfera de energía
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setBallPos((prev) => {
        let newX = prev.x + ballVel.dx;
        let newY = prev.y + ballVel.dy;
        let newDx = ballVel.dx;
        let newDy = ballVel.dy;

        // Rebote en paredes laterales (5% a 95%)
        if (newX <= 5 || newX >= 95) {
          newDx = -newDx;
          newX = Math.max(5, Math.min(95, newX));
        }

        // Rebote en techo (5%)
        if (newY <= 8) {
          newDy = Math.abs(newDy);
          newY = 8;
          setHitEffect({ x: newX, y: 8 });
          setTimeout(() => setHitEffect(null), 300);
          onScoreIncrement(100);
        }

        // Rebote en bloques superiores (y entre 20% y 40%)
        if (newY >= 20 && newY <= 38 && Math.random() < 0.1) {
          newDy = -newDy;
          setHitEffect({ x: newX, y: newY });
          setTimeout(() => setHitEffect(null), 300);
          onScoreIncrement(250);
        }

        // Rebote en la paleta Vaus (cerca del 88%)
        if (newY >= 88 && newY <= 92) {
          const diff = Math.abs(newX - paddleX);
          if (diff < 16) {
            newDy = -Math.abs(newDy);
            newY = 87;
            newDx = (newX - paddleX) * 0.08 || (newDx > 0 ? 0.45 : -0.45);
            setHitEffect({ x: newX, y: 88 });
            setTimeout(() => setHitEffect(null), 250);
          }
        }

        // Si cae por debajo, reiniciar suavemente
        if (newY >= 98) {
          newY = 65;
          newX = paddleX;
          newDy = -0.6;
        }

        if (newDx !== ballVel.dx || newDy !== ballVel.dy) {
          setBallVel({ dx: newDx, dy: newDy });
        }

        return { x: newX, y: newY };
      });
    }, 24);

    return () => clearInterval(interval);
  }, [isPaused, ballVel, paddleX, onScoreIncrement]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-full p-4 md:p-8 flex flex-col justify-between select-none overflow-hidden cursor-crosshair"
    >
      {/* Límite Superior: Rejilla Reflectante Superior */}
      <div className="w-full flex justify-between items-center px-4 py-1.5 bg-surface-container-high/60 backdrop-blur rounded shadow-[0_0_10px_rgba(0,245,255,0.3)] border border-primary-container/20">
        <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider">
          DEFLECTOR SUPERIOR ACTIVO
        </span>
        <div className="flex gap-2 items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-ping"></span>
          <span className="font-label-sm text-label-sm text-tertiary-fixed font-bold tracking-widest">
            MULTI-IMPACTO DISPONIBLE
          </span>
        </div>
      </div>

      {/* Matriz de Bloques Rompeladrillos Neón */}
      <div className="w-full max-w-2xl mx-auto grid grid-cols-8 md:grid-cols-10 gap-1 md:gap-2 my-auto py-2">
        {/* Fila 1: Bloques Magenta Reforzados */}
        {[...Array(10)].map((_, i) => (
          <div
            key={`r1-${i}`}
            className="h-4 md:h-6 bg-secondary-container rounded shadow-[0_0_12px_rgba(255,77,128,0.9)] flex items-center justify-center border border-secondary-fixed/50"
          >
            <div className="w-full h-0.5 bg-secondary-fixed/70"></div>
          </div>
        ))}

        {/* Fila 2: Bloques Cian Quantum */}
        {[...Array(10)].map((_, i) => (
          <div
            key={`r2-${i}`}
            className={`h-4 md:h-6 rounded border border-primary-fixed/40 ${
              i === 4
                ? "bg-white/90 shadow-[0_0_20px_rgba(255,255,255,1)] animate-pulse"
                : i === 6
                ? "bg-primary-container/30"
                : "bg-primary-container shadow-[0_0_12px_rgba(0,245,255,0.9)]"
            }`}
          />
        ))}

        {/* Fila 3: Bloques Ácidos Amarillos Multiplicadores */}
        {[...Array(10)].map((_, i) => (
          <div
            key={`r3-${i}`}
            className={`h-4 md:h-6 bg-tertiary-fixed rounded shadow-[0_0_14px_rgba(227,236,0,0.9)] flex items-center justify-center text-[10px] text-on-tertiary font-bold border border-yellow-200 ${
              i === 2 || i === 8 ? "opacity-40" : ""
            }`}
          >
            {i === 0 || i === 5 ? "x2" : ""}
          </div>
        ))}

        {/* Fila 4: Bloques Plata Titanio */}
        {[...Array(10)].map((_, i) => (
          <div
            key={`r4-${i}`}
            className={`h-4 md:h-6 rounded shadow-[0_0_6px_rgba(255,255,255,0.3)] flex items-center justify-center ${
              i % 2 === 0
                ? "bg-surface-container-highest border border-outline"
                : "bg-primary-fixed-dim shadow-[0_0_10px_rgba(0,220,229,0.8)]"
            }`}
          >
            {i % 2 === 0 && <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>}
          </div>
        ))}
      </div>

      {/* Cápsulas de Bonificación Cayendo Dinámicamente */}
      <div className="absolute top-36 left-1/4 animate-bounce bg-secondary-container px-2 py-0.5 rounded shadow-[0_0_15px_rgba(255,77,128,1)] flex items-center gap-1 pointer-events-none">
        <span className="font-label-sm text-label-sm text-white font-bold tracking-tighter">
          [L] LÁSER
        </span>
        <span className="material-symbols-outlined text-[12px] text-white animate-spin">
          bolt
        </span>
      </div>

      <div className="absolute top-44 right-1/3 bg-tertiary-fixed px-2 py-0.5 rounded shadow-[0_0_15px_rgba(227,236,0,1)] flex items-center gap-1 pointer-events-none animate-pulse">
        <span className="font-label-sm text-label-sm text-on-tertiary font-bold tracking-tighter">
          [E] AMPLIAR
        </span>
        <span className="material-symbols-outlined text-[12px] text-on-tertiary">
          open_in_full
        </span>
      </div>

      {/* Esfera de Energía Resplandeciente y Estela Luminosa */}
      <div
        className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-all duration-[24ms]"
        style={{ left: `${ballPos.x}%`, top: `${ballPos.y}%` }}
      >
        {/* Estela luminosa */}
        <div className="w-5 h-5 rounded-full bg-primary-container/40 blur-[4px] absolute -inset-1 pointer-events-none"></div>
        {/* Orbe Principal */}
        <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_20px_rgba(0,245,255,1),0_0_8px_rgba(255,255,255,1)] relative flex items-center justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
        </div>
      </div>

      {/* Chispa de Impacto */}
      {hitEffect && (
        <div
          className="absolute w-4 h-4 flex items-center justify-center pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${hitEffect.x}%`, top: `${hitEffect.y}%` }}
        >
          <span className="absolute w-7 h-0.5 bg-primary-container rotate-45 shadow-[0_0_8px_#00f5ff]"></span>
          <span className="absolute w-7 h-0.5 bg-secondary-container -rotate-45 shadow-[0_0_8px_#ff4d80]"></span>
        </div>
      )}

      {/* Base: Paleta Vaus Espacial Interactiva */}
      <div className="w-full relative flex flex-col items-center pb-2 pointer-events-none">
        <div
          className="w-44 md:w-56 h-5 md:h-6 bg-gradient-to-r from-secondary-container via-primary-container to-secondary-container rounded-full shadow-[0_0_25px_rgba(0,245,255,0.8),inset_0_1px_3px_rgba(255,255,255,0.8)] relative flex items-center justify-between px-3 transition-transform duration-75"
          style={{ transform: `translateX(${(paddleX - 50) * 5}px)` }}
        >
          {/* Núcleo de energía de la nave */}
          <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1)] animate-ping"></div>
          <div className="h-1.5 w-16 bg-surface-container-lowest/80 rounded-full flex items-center justify-center">
            <span className="font-label-sm text-label-sm text-primary tracking-widest text-[8px]">
              VAUS-84
            </span>
          </div>
          <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1)]"></div>
          {/* Cañones láser laterales */}
          <span className="absolute -top-1.5 left-2 w-1.5 h-3 bg-secondary-fixed rounded-t shadow-[0_0_6px_#ffd9de]"></span>
          <span className="absolute -top-1.5 right-2 w-1.5 h-3 bg-secondary-fixed rounded-t shadow-[0_0_6px_#ffd9de]"></span>
        </div>
        {/* Estela del propulsor */}
        <div
          className="w-28 h-2 bg-gradient-to-b from-primary-container to-transparent blur-[3px] transition-transform duration-75"
          style={{ transform: `translateX(${(paddleX - 50) * 5}px)` }}
        ></div>
      </div>

      {/* Overlay Inferior Informativo */}
      <div className="w-full flex items-center justify-between pt-2 bg-surface-container-lowest/90 px-3 py-1 rounded border border-outline-variant/20">
        <span className="font-label-sm text-label-sm text-tertiary-fixed tracking-widest uppercase font-bold">
          MONEDAS INSERTADAS: 02
        </span>
        <div className="flex items-center gap-3">
          <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider">
            VELOCIDAD BOLA: 1.25X
          </span>
          <span className="font-label-sm text-label-sm text-secondary-fixed tracking-widest uppercase">
            COMBO ACTUAL: X5
          </span>
        </div>
      </div>
    </div>
  );
};
