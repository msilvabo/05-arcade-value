"use client";

import { FC, useState, useEffect, useRef } from "react";
import { CabinetGameProps } from "../../_lib/types";

export const ArkanoidGame: FC<CabinetGameProps> = ({
  isPaused,
  onScoreIncrement,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [paddleX, setPaddleX] = useState<number>(50); // porcentaje 0 a 100
  const [ballPos, setBallPos] = useState<{ x: number; y: number }>({
    x: 50,
    y: 70,
  });
  const ballPosRef = useRef<{ x: number; y: number }>({ x: 50, y: 70 });
  const ballVelRef = useRef<{ dx: number; dy: number }>({ dx: 0.45, dy: -0.6 });
  const paddleXRef = useRef<number>(50);
  const [hitEffect, setHitEffect] = useState<{ x: number; y: number } | null>(
    null
  );

  useEffect(() => {
    paddleXRef.current = paddleX;
  }, [paddleX]);

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
      let newX = ballPosRef.current.x + ballVelRef.current.dx;
      let newY = ballPosRef.current.y + ballVelRef.current.dy;
      let newDx = ballVelRef.current.dx;
      let newDy = ballVelRef.current.dy;
      const currentPaddleX = paddleXRef.current;

      // Rebote en paredes laterales (5% a 95%)
      if (newX <= 5) {
        newX = 5;
        newDx = Math.abs(newDx);
      } else if (newX >= 95) {
        newX = 95;
        newDx = -Math.abs(newDx);
      }

      // Rebote en el techo (8%)
      if (newY <= 8) {
        newY = 8;
        newDy = Math.abs(newDy);
      }

      // Rebote simulado en la nave Vaus inferior (zona 86%-90%)
      if (newY >= 86 && newY <= 90) {
        const distFromPaddle = newX - currentPaddleX;
        if (Math.abs(distFromPaddle) <= 16) {
          newDy = -Math.abs(newDy);
          newDx = distFromPaddle * 0.05; // Influencia del ángulo del rebote
          setHitEffect({ x: newX, y: 88 });
          setTimeout(() => setHitEffect(null), 180);
          onScoreIncrement?.(50);
        }
      }

      // Simulación de rebote inferior si se pierde
      if (newY > 96) {
        newY = 70;
        newX = 50;
        newDy = -0.6;
        newDx = (Math.random() - 0.5) * 0.8;
      }

      ballPosRef.current = { x: newX, y: newY };
      ballVelRef.current = { dx: newDx, dy: newDy };
      setBallPos({ x: newX, y: newY });
    }, 16);

    return () => clearInterval(interval);
  }, [isPaused, onScoreIncrement]);

  // Matriz visual simulada de ladrillos de energía cuántica
  const brickRows = [
    { color: "bg-[#ff4d80] shadow-[0_0_8px_#ff4d80]", pts: 120 },
    { color: "bg-[#00f5ff] shadow-[0_0_8px_#00f5ff]", pts: 100 },
    { color: "bg-[#dee700] shadow-[0_0_8px_#dee700]", pts: 80 },
    { color: "bg-[#39ff14] shadow-[0_0_8px_#39ff14]", pts: 60 },
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-[520px] bg-surface-container-lowest overflow-hidden flex flex-col items-center justify-between cursor-crosshair select-none"
    >
      {/* Fondo de rejilla de vectores neón */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f5ff0d_1px,transparent_1px),linear-gradient(to_bottom,#00f5ff0d_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

      {/* Matriz superior de ladrillos */}
      <div className="relative w-full max-w-[640px] pt-8 px-6 grid grid-cols-8 gap-2 z-10 pointer-events-none">
        {brickRows.map((row, rIdx) =>
          Array.from({ length: 8 }).map((_, cIdx) => (
            <div
              key={`${rIdx}-${cIdx}`}
              className={`h-5 rounded-sm border border-black/30 transition-all ${row.color} ${
                (rIdx + cIdx) % 7 === 3
                  ? "opacity-20 animate-pulse"
                  : "opacity-90"
              }`}
            ></div>
          ))
        )}
      </div>

      {/* Esfera de Plasma Reflectora */}
      <div
        className="absolute w-5 h-5 bg-tertiary-fixed rounded-full shadow-[0_0_16px_rgba(222,231,0,1)] pointer-events-none transition-transform z-20"
        style={{
          left: `${ballPos.x}%`,
          top: `${ballPos.y}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <span className="absolute inset-0 rounded-full animate-ping bg-tertiary-fixed/40"></span>
      </div>

      {/* Destello de Impacto de la Esfera */}
      {hitEffect && (
        <div
          className="absolute w-12 h-12 bg-primary-container rounded-full blur-sm pointer-events-none z-30 animate-ping"
          style={{
            left: `${hitEffect.x}%`,
            top: `${hitEffect.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        ></div>
      )}

      {/* Nave Espacial VAUS en la parte inferior */}
      <div
        className="absolute bottom-8 w-32 h-4 bg-primary-container rounded-full shadow-[0_0_20px_rgba(0,245,255,0.9)] border border-primary-fixed flex items-center justify-between px-2 pointer-events-none z-20"
        style={{
          left: `${paddleX}%`,
          transform: "translateX(-50%)",
        }}
      >
        <span className="w-2 h-2 rounded-full bg-secondary-container shadow-[0_0_6px_#ff4d80]"></span>
        <span className="text-[9px] font-label-sm font-bold text-on-primary tracking-widest uppercase">
          VAUS
        </span>
        <span className="w-2 h-2 rounded-full bg-secondary-container shadow-[0_0_6px_#ff4d80]"></span>
      </div>

      {/* Micro-guía de control en la base */}
      <div className="absolute bottom-2 text-outline-variant font-label-sm text-[10px] tracking-wider pointer-events-none uppercase">
        MUEVE EL RATÓN O PULSA [A] [D] / FLECHAS PARA CONTROLAR LA NAVE VAUS
      </div>
    </div>
  );
};
