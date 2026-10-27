"use client";

import { FC, useState, useEffect, useRef } from "react";
import { VirtualButtonConfig } from "./types";
import { pressKey, releaseKey } from "./virtualInput";

interface VirtualActionButtonProps {
  config: VirtualButtonConfig;
  disabled?: boolean;
  className?: string;
}

const COLOR_STYLES = {
  cyan: {
    base: "border-[#00f0ff]/70 text-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.35),inset_0_0_8px_rgba(0,240,255,0.2)] bg-[#00f0ff]/10",
    active:
      "border-[#00f0ff] bg-[#00f0ff]/35 shadow-[0_0_22px_rgba(0,240,255,0.85),inset_0_0_14px_rgba(0,240,255,0.5)] scale-95",
    sublabel: "text-[#00f0ff]/80",
  },
  magenta: {
    base: "border-[#ff006e]/70 text-[#ff006e] shadow-[0_0_10px_rgba(255,0,110,0.35),inset_0_0_8px_rgba(255,0,110,0.2)] bg-[#ff006e]/10",
    active:
      "border-[#ff006e] bg-[#ff006e]/35 shadow-[0_0_22px_rgba(255,0,110,0.85),inset_0_0_14px_rgba(255,0,110,0.5)] scale-95",
    sublabel: "text-[#ff006e]/80",
  },
  amber: {
    base: "border-[#ffb700]/70 text-[#ffb700] shadow-[0_0_10px_rgba(255,183,0,0.35),inset_0_0_8px_rgba(255,183,0,0.2)] bg-[#ffb700]/10",
    active:
      "border-[#ffb700] bg-[#ffb700]/35 shadow-[0_0_22px_rgba(255,183,0,0.85),inset_0_0_14px_rgba(255,183,0,0.5)] scale-95",
    sublabel: "text-[#ffb700]/80",
  },
  green: {
    base: "border-[#00ff88]/70 text-[#00ff88] shadow-[0_0_10px_rgba(0,255,136,0.35),inset_0_0_8px_rgba(0,255,136,0.2)] bg-[#00ff88]/10",
    active:
      "border-[#00ff88] bg-[#00ff88]/35 shadow-[0_0_22px_rgba(0,255,136,0.85),inset_0_0_14px_rgba(0,255,136,0.5)] scale-95",
    sublabel: "text-[#00ff88]/80",
  },
  surface: {
    base: "border-outline-variant/60 text-on-surface shadow-[inset_0_0_8px_rgba(255,255,255,0.05)] bg-surface-container-high/70",
    active:
      "border-outline bg-surface-container-highest shadow-[0_0_12px_rgba(255,255,255,0.2)] scale-95",
    sublabel: "text-outline",
  },
};

const SIZE_STYLES = {
  sm: "w-12 h-12 text-[10px]",
  md: "w-14 h-14 sm:w-16 sm:h-16 text-[11px]",
  lg: "w-16 h-16 sm:w-20 sm:h-20 text-xs",
};

export const VirtualActionButton: FC<VirtualActionButtonProps> = ({
  config,
  disabled = false,
  className = "",
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const isPressedRef = useRef(false);

  useEffect(() => {
    isPressedRef.current = isPressed;
  }, [isPressed]);

  const colorStyle = COLOR_STYLES[config.color] || COLOR_STYLES.cyan;
  const sizeStyle = SIZE_STYLES[config.size || "md"];

  // Liberar la tecla si el componente se desmonta mientras estaba pulsado
  useEffect(() => {
    return () => {
      if (isPressedRef.current) {
        releaseKey(config.key);
      }
    };
  }, [config.key]);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled) return;
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignorar si el navegador no soporta captura de puntero
    }
    setIsPressed(true);
    pressKey(config.key);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled) return;
    e.preventDefault();
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignorar
    }
    setIsPressed(false);
    releaseKey(config.key);
  };

  const handlePointerCancel = () => {
    if (disabled) return;
    setIsPressed(false);
    releaseKey(config.key);
  };

  return (
    <button
      type="button"
      aria-label={`${config.label} ${config.sublabel || ""}`}
      disabled={disabled}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      className={`relative select-none touch-none rounded-full border-2 flex flex-col items-center justify-center transition-transform duration-75 cursor-pointer font-bold tracking-wider ${sizeStyle} ${
        isPressed ? colorStyle.active : colorStyle.base
      } ${disabled ? "opacity-40 pointer-events-none" : ""} ${className}`}
      style={{
        WebkitTapHighlightColor: "transparent",
        userSelect: "none",
        touchAction: "none",
      }}
    >
      {/* Resplandor de marco interno */}
      <div className="absolute inset-1 rounded-full border border-white/10 pointer-events-none"></div>

      {config.icon ? (
        <span className="material-symbols-outlined text-[20px] pointer-events-none">
          {config.icon}
        </span>
      ) : (
        <span className="pointer-events-none uppercase font-display-md text-center leading-tight">
          {config.label}
        </span>
      )}

      {config.sublabel && (
        <span
          className={`pointer-events-none text-[8px] font-label-sm tracking-widest uppercase mt-0.5 ${colorStyle.sublabel}`}
        >
          {config.sublabel}
        </span>
      )}
    </button>
  );
};
