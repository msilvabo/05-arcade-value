"use client";

import { FC, useState, useEffect, useRef } from "react";
import { DpadLayoutType, VirtualActionKey } from "./types";
import { pressKey, releaseKey } from "./virtualInput";

interface VirtualDpadProps {
  type: DpadLayoutType;
  className?: string;
}

export const VirtualDpad: FC<VirtualDpadProps> = ({ type, className = "" }) => {
  const [activeDirection, setActiveDirection] =
    useState<VirtualActionKey | null>(null);
  const activeDirectionRef = useRef<VirtualActionKey | null>(null);

  useEffect(() => {
    activeDirectionRef.current = activeDirection;
  }, [activeDirection]);

  useEffect(() => {
    return () => {
      if (activeDirectionRef.current) {
        releaseKey(activeDirectionRef.current);
      }
    };
  }, []);

  const handlePress = (key: VirtualActionKey) => {
    if (activeDirectionRef.current && activeDirectionRef.current !== key) {
      releaseKey(activeDirectionRef.current);
    }
    setActiveDirection(key);
    pressKey(key);
  };

  const handleRelease = (key: VirtualActionKey) => {
    if (activeDirectionRef.current === key) {
      setActiveDirection(null);
      releaseKey(key);
    }
  };

  if (type === "none") {
    return null;
  }

  // Modo 2 direcciones laterales (Arkanoid / Asteroids)
  if (type === "2-way-horizontal") {
    return (
      <div
        className={`flex items-center gap-3 select-none touch-none ${className}`}
        style={{ touchAction: "none" }}
      >
        <button
          type="button"
          aria-label="Izquierda"
          onPointerDown={(e) => {
            e.preventDefault();
            handlePress("ArrowLeft");
          }}
          onPointerUp={(e) => {
            e.preventDefault();
            handleRelease("ArrowLeft");
          }}
          onPointerCancel={() => handleRelease("ArrowLeft")}
          onPointerLeave={() => handleRelease("ArrowLeft")}
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 flex items-center justify-center transition-transform duration-75 cursor-pointer font-bold ${
            activeDirection === "ArrowLeft"
              ? "border-[#00f0ff] bg-[#00f0ff]/30 text-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.85)] scale-95"
              : "border-[#00f0ff]/60 bg-surface-container-high/80 text-[#00f0ff] shadow-[0_0_8px_rgba(0,240,255,0.25)]"
          }`}
          style={{
            WebkitTapHighlightColor: "transparent",
            userSelect: "none",
            touchAction: "none",
          }}
        >
          <span className="material-symbols-outlined text-[32px] sm:text-[36px] pointer-events-none">
            arrow_back
          </span>
        </button>

        <button
          type="button"
          aria-label="Derecha"
          onPointerDown={(e) => {
            e.preventDefault();
            handlePress("ArrowRight");
          }}
          onPointerUp={(e) => {
            e.preventDefault();
            handleRelease("ArrowRight");
          }}
          onPointerCancel={() => handleRelease("ArrowRight")}
          onPointerLeave={() => handleRelease("ArrowRight")}
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 flex items-center justify-center transition-transform duration-75 cursor-pointer font-bold ${
            activeDirection === "ArrowRight"
              ? "border-[#00f0ff] bg-[#00f0ff]/30 text-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.85)] scale-95"
              : "border-[#00f0ff]/60 bg-surface-container-high/80 text-[#00f0ff] shadow-[0_0_8px_rgba(0,240,255,0.25)]"
          }`}
          style={{
            WebkitTapHighlightColor: "transparent",
            userSelect: "none",
            touchAction: "none",
          }}
        >
          <span className="material-symbols-outlined text-[32px] sm:text-[36px] pointer-events-none">
            arrow_forward
          </span>
        </button>
      </div>
    );
  }

  // Modo 4 direcciones (Chrono Snake / Cyber Tetris)
  return (
    <div
      className={`relative w-40 h-40 sm:w-44 sm:h-44 select-none touch-none ${className}`}
      style={{ touchAction: "none" }}
    >
      {/* Fondo de cruzeta arcade */}
      <div className="absolute inset-0 m-auto w-36 h-36 bg-surface-container-lowest/80 rounded-full border border-outline-variant/30 pointer-events-none shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]"></div>

      {/* Botón ARRIBA */}
      <button
        type="button"
        aria-label="Arriba"
        onPointerDown={(e) => {
          e.preventDefault();
          handlePress("ArrowUp");
        }}
        onPointerUp={(e) => {
          e.preventDefault();
          handleRelease("ArrowUp");
        }}
        onPointerCancel={() => handleRelease("ArrowUp")}
        onPointerLeave={() => handleRelease("ArrowUp")}
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-12 h-14 sm:w-14 sm:h-16 rounded-t-xl border-2 border-b-0 flex items-center justify-center transition-transform duration-75 cursor-pointer ${
          activeDirection === "ArrowUp"
            ? "border-[#00f0ff] bg-[#00f0ff]/35 text-[#00f0ff] shadow-[0_0_18px_rgba(0,240,255,0.85)] scale-95"
            : "border-[#00f0ff]/60 bg-surface-container-high/90 text-[#00f0ff] shadow-[0_0_8px_rgba(0,240,255,0.25)]"
        }`}
        style={{
          WebkitTapHighlightColor: "transparent",
          userSelect: "none",
          touchAction: "none",
        }}
      >
        <span className="material-symbols-outlined text-[26px] pointer-events-none">
          keyboard_arrow_up
        </span>
      </button>

      {/* Botón ABAJO */}
      <button
        type="button"
        aria-label="Abajo"
        onPointerDown={(e) => {
          e.preventDefault();
          handlePress("ArrowDown");
        }}
        onPointerUp={(e) => {
          e.preventDefault();
          handleRelease("ArrowDown");
        }}
        onPointerCancel={() => handleRelease("ArrowDown")}
        onPointerLeave={() => handleRelease("ArrowDown")}
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-14 sm:w-14 sm:h-16 rounded-b-xl border-2 border-t-0 flex items-center justify-center transition-transform duration-75 cursor-pointer ${
          activeDirection === "ArrowDown"
            ? "border-[#00f0ff] bg-[#00f0ff]/35 text-[#00f0ff] shadow-[0_0_18px_rgba(0,240,255,0.85)] scale-95"
            : "border-[#00f0ff]/60 bg-surface-container-high/90 text-[#00f0ff] shadow-[0_0_8px_rgba(0,240,255,0.25)]"
        }`}
        style={{
          WebkitTapHighlightColor: "transparent",
          userSelect: "none",
          touchAction: "none",
        }}
      >
        <span className="material-symbols-outlined text-[26px] pointer-events-none">
          keyboard_arrow_down
        </span>
      </button>

      {/* Botón IZQUIERDA */}
      <button
        type="button"
        aria-label="Izquierda"
        onPointerDown={(e) => {
          e.preventDefault();
          handlePress("ArrowLeft");
        }}
        onPointerUp={(e) => {
          e.preventDefault();
          handleRelease("ArrowLeft");
        }}
        onPointerCancel={() => handleRelease("ArrowLeft")}
        onPointerLeave={() => handleRelease("ArrowLeft")}
        className={`absolute top-1/2 left-0 -translate-y-1/2 w-14 h-12 sm:w-16 sm:h-14 rounded-l-xl border-2 border-r-0 flex items-center justify-center transition-transform duration-75 cursor-pointer ${
          activeDirection === "ArrowLeft"
            ? "border-[#00f0ff] bg-[#00f0ff]/35 text-[#00f0ff] shadow-[0_0_18px_rgba(0,240,255,0.85)] scale-95"
            : "border-[#00f0ff]/60 bg-surface-container-high/90 text-[#00f0ff] shadow-[0_0_8px_rgba(0,240,255,0.25)]"
        }`}
        style={{
          WebkitTapHighlightColor: "transparent",
          userSelect: "none",
          touchAction: "none",
        }}
      >
        <span className="material-symbols-outlined text-[26px] pointer-events-none">
          keyboard_arrow_left
        </span>
      </button>

      {/* Botón DERECHA */}
      <button
        type="button"
        aria-label="Derecha"
        onPointerDown={(e) => {
          e.preventDefault();
          handlePress("ArrowRight");
        }}
        onPointerUp={(e) => {
          e.preventDefault();
          handleRelease("ArrowRight");
        }}
        onPointerCancel={() => handleRelease("ArrowRight")}
        onPointerLeave={() => handleRelease("ArrowRight")}
        className={`absolute top-1/2 right-0 -translate-y-1/2 w-14 h-12 sm:w-16 sm:h-14 rounded-r-xl border-2 border-l-0 flex items-center justify-center transition-transform duration-75 cursor-pointer ${
          activeDirection === "ArrowRight"
            ? "border-[#00f0ff] bg-[#00f0ff]/35 text-[#00f0ff] shadow-[0_0_18px_rgba(0,240,255,0.85)] scale-95"
            : "border-[#00f0ff]/60 bg-surface-container-high/90 text-[#00f0ff] shadow-[0_0_8px_rgba(0,240,255,0.25)]"
        }`}
        style={{
          WebkitTapHighlightColor: "transparent",
          userSelect: "none",
          touchAction: "none",
        }}
      >
        <span className="material-symbols-outlined text-[26px] pointer-events-none">
          keyboard_arrow_right
        </span>
      </button>

      {/* Centro / Hub del D-Pad */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface-container-lowest border border-outline-variant/50 pointer-events-none flex items-center justify-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.9)]">
        <div className="w-4 h-4 rounded-full bg-surface-container-high border border-outline-variant/30"></div>
      </div>
    </div>
  );
};
