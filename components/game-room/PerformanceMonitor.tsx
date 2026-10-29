"use client";

import React, { FC, useEffect, useRef, useState } from "react";

export interface PerformanceMonitorProps {
  /** Forzar visibilidad desde fuera si se controla por estado de la cabina */
  visible?: boolean;
  /** Callback opcional al alternar visibilidad */
  onToggle?: (isVisible: boolean) => void;
  /** Cantidad opcional de entidades/partículas activas reportadas */
  activeEntitiesCount?: number;
}

export const PerformanceMonitor: FC<PerformanceMonitorProps> = ({
  visible: controlledVisible,
  onToggle,
  activeEntitiesCount,
}) => {
  const [internalVisible, setInternalVisible] = useState(false);
  const isVisible =
    controlledVisible !== undefined ? controlledVisible : internalVisible;

  // Referencias a los elementos del DOM para actualizar métricas sin provocar re-renders en React
  const fpsTextRef = useRef<HTMLSpanElement | null>(null);
  const msTextRef = useRef<HTMLSpanElement | null>(null);
  const dropsTextRef = useRef<HTMLSpanElement | null>(null);
  const entitiesTextRef = useRef<HTMLSpanElement | null>(null);
  const dotIndicatorRef = useRef<HTMLSpanElement | null>(null);

  // Escuchar F3 o Shift+D para alternar la visibilidad
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar si se escribe en un input o textarea
      if (
        document.activeElement &&
        (document.activeElement.tagName === "INPUT" ||
          document.activeElement.tagName === "TEXTAREA")
      ) {
        return;
      }

      if (e.key === "F3" || (e.shiftKey && (e.key === "D" || e.key === "d"))) {
        e.preventDefault();
        setInternalVisible((prev) => {
          const next = !prev;
          onToggle?.(next);
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onToggle]);

  // Medidor continuo de FPS mediante requestAnimationFrame con actualización de DOM en tiempo real
  useEffect(() => {
    if (!isVisible) return;

    let animId: number;
    let lastTime = performance.now();
    const frameTimes: number[] = [];
    let drops = 0;
    let lastDomUpdate = performance.now();

    const loop = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;

      // Calcular frame time y registrar muestra (ventana móvil de 60 cuadros)
      if (delta > 0 && delta < 1000) {
        frameTimes.push(delta);
        if (frameTimes.length > 60) {
          frameTimes.shift();
        }

        // Drop / Jank detectado si el frame time supera 22.2 ms (< 45 FPS)
        if (delta > 22.2) {
          drops++;
        }
      }

      // Actualizar el DOM a intervalos de 150 ms para no saturar el layout y mantener precisión
      if (now - lastDomUpdate >= 150 && frameTimes.length > 0) {
        lastDomUpdate = now;
        const avgDelta =
          frameTimes.reduce((acc, val) => acc + val, 0) / frameTimes.length;
        const calculatedFps = Math.min(60, Math.round(1000 / avgDelta));
        const frameMs = avgDelta.toFixed(1);

        if (fpsTextRef.current) {
          fpsTextRef.current.textContent = `${calculatedFps} FPS`;
          if (calculatedFps >= 58) {
            fpsTextRef.current.style.color = "#00ff66"; // Verde neón
          } else if (calculatedFps >= 50) {
            fpsTextRef.current.style.color = "#ffb700"; // Ámbar neón
          } else {
            fpsTextRef.current.style.color = "#ff0055"; // Rojo neón
          }
        }

        if (msTextRef.current) {
          msTextRef.current.textContent = `${frameMs} ms`;
        }

        if (dropsTextRef.current) {
          dropsTextRef.current.textContent = `${drops}`;
        }

        if (dotIndicatorRef.current) {
          dotIndicatorRef.current.style.backgroundColor =
            calculatedFps >= 58
              ? "#00ff66"
              : calculatedFps >= 50
                ? "#ffb700"
                : "#ff0055";
        }

        if (entitiesTextRef.current && activeEntitiesCount !== undefined) {
          entitiesTextRef.current.textContent = `${activeEntitiesCount}`;
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isVisible, activeEntitiesCount]);

  if (!isVisible) return null;

  return (
    <div
      className="absolute top-2 right-2 z-30 pointer-events-none select-none font-mono text-[10px] sm:text-[11px] bg-black/85 backdrop-blur-sm border border-primary/40 rounded px-2.5 py-1.5 shadow-[0_0_12px_rgba(0,240,255,0.25)] flex flex-col gap-0.5 tracking-wider text-on-surface"
      style={{ touchAction: "none" }}
    >
      <div className="flex items-center justify-between gap-3 border-b border-outline-variant/30 pb-0.5 mb-0.5">
        <div className="flex items-center gap-1.5 font-bold uppercase text-[9px] text-primary-fixed">
          <span
            ref={dotIndicatorRef}
            className="w-2 h-2 rounded-full inline-block shadow-[0_0_6px_currentColor] transition-colors duration-200"
            style={{ backgroundColor: "#00ff66" }}
          ></span>
          <span>TELEMETRÍA CRT</span>
        </div>
        <span className="text-[9px] text-outline">[F3]</span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-on-surface-variant uppercase text-[10px]">
          REFRESCO:
        </span>
        <span
          ref={fpsTextRef}
          className="font-bold text-[11px] transition-colors"
          style={{ color: "#00ff66" }}
        >
          60 FPS
        </span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-on-surface-variant uppercase text-[10px]">
          FRAME TIME:
        </span>
        <span ref={msTextRef} className="text-secondary font-mono">
          16.6 ms
        </span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-on-surface-variant uppercase text-[10px]">
          DROPS (&gt;22ms):
        </span>
        <span ref={dropsTextRef} className="text-tertiary font-mono">
          0
        </span>
      </div>

      {activeEntitiesCount !== undefined && (
        <div className="flex items-center justify-between gap-3">
          <span className="text-on-surface-variant uppercase text-[10px]">
            ENTIDADES:
          </span>
          <span ref={entitiesTextRef} className="text-primary-fixed font-mono">
            {activeEntitiesCount}
          </span>
        </div>
      )}
    </div>
  );
};
