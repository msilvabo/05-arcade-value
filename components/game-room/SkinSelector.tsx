"use client";

import { FC } from "react";
import { GameSkinId, RetroPaletteVariant } from "@/app/games/_lib/types";

export interface SkinOption {
  id: string;
  skin: GameSkinId;
  variant?: RetroPaletteVariant;
  name: string;
  shortName: string;
  tag: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  glowColor: string;
  bgColor: string;
}

export const SKIN_OPTIONS: SkinOption[] = [
  {
    id: "clasico",
    skin: "clasico",
    name: "Arcade Clásico (1980s)",
    shortName: "CLÁSICO",
    tag: "VECTOR 1980",
    description:
      "Geometría vectorial nítida en blanco fósforo sin resplandor difuso.",
    primaryColor: "#ffffff",
    secondaryColor: "#00d2ff",
    glowColor: "rgba(255, 255, 255, 0.4)",
    bgColor: "#050608",
  },
  {
    id: "neon",
    skin: "neon",
    name: "Cyberpunk Neón (2084)",
    shortName: "NEÓN",
    tag: "SYNTH 2084",
    description: "Resplandor fosforescente multicapa con cian láser y magenta.",
    primaryColor: "#00f5ff",
    secondaryColor: "#ff006e",
    glowColor: "rgba(0, 245, 255, 0.8)",
    bgColor: "#04050e",
  },
  {
    id: "retro-amber",
    skin: "retro",
    variant: "amber",
    name: "Fósforo Ámbar P3",
    shortName: "ÁMBAR",
    tag: "CRT P3",
    description:
      "Tubo catódico vintage monocromo con persistencia ámbar cálida.",
    primaryColor: "#ffaa00",
    secondaryColor: "#ff5500",
    glowColor: "rgba(255, 170, 0, 0.8)",
    bgColor: "#090805",
  },
  {
    id: "retro-green",
    skin: "retro",
    variant: "green",
    name: "Fósforo Verde P1",
    shortName: "VERDE",
    tag: "CRT P1",
    description:
      "Terminal radar militar y pantalla de fósforo verde esmeralda.",
    primaryColor: "#33ff33",
    secondaryColor: "#00cc44",
    glowColor: "rgba(51, 255, 51, 0.8)",
    bgColor: "#040a05",
  },
];

export function getActiveOptionId(
  skin: GameSkinId,
  retroVariant: RetroPaletteVariant = "amber"
): string {
  if (skin === "retro") {
    return retroVariant === "green" ? "retro-green" : "retro-amber";
  }
  return skin;
}

interface SkinSelectorProps {
  currentSkin: GameSkinId;
  retroVariant?: RetroPaletteVariant;
  onSelectSkin: (skin: GameSkinId, variant?: RetroPaletteVariant) => void;
  variant?: "compact" | "cards" | "toolbar";
}

export const SkinSelector: FC<SkinSelectorProps> = ({
  currentSkin,
  retroVariant = "amber",
  onSelectSkin,
  variant = "compact",
}) => {
  const activeId = getActiveOptionId(currentSkin, retroVariant);

  if (variant === "cards") {
    return (
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {SKIN_OPTIONS.map((opt) => {
          const isActive = opt.id === activeId;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelectSkin(opt.skin, opt.variant)}
              style={{
                borderColor: isActive ? opt.primaryColor : undefined,
                boxShadow: isActive ? `0 0 15px ${opt.glowColor}` : undefined,
              }}
              className={`p-3 rounded-lg border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                isActive
                  ? "bg-surface-container-high/90 border-2 scale-[1.02]"
                  : "bg-surface-container-low/70 border-outline-variant/30 hover:border-outline hover:bg-surface-container"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span
                    className="font-label-sm text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: opt.bgColor,
                      color: opt.primaryColor,
                      border: `1px solid ${opt.primaryColor}40`,
                    }}
                  >
                    {opt.tag}
                  </span>
                  {isActive && (
                    <span
                      className="w-2 h-2 rounded-full animate-ping"
                      style={{ backgroundColor: opt.primaryColor }}
                    />
                  )}
                </div>

                <div className="font-title-sm text-title-sm uppercase font-bold text-on-surface mb-1">
                  {opt.name}
                </div>

                <p className="font-body-sm text-[11px] text-on-surface-variant line-clamp-2 mb-2">
                  {opt.description}
                </p>
              </div>

              {/* Muestra de Color Chips */}
              <div className="flex items-center gap-1.5 pt-2 border-t border-outline-variant/20">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/20"
                  style={{ backgroundColor: opt.bgColor }}
                  title="Fondo lienzo"
                />
                <span
                  className="w-3.5 h-3.5 rounded-full shadow-sm"
                  style={{ backgroundColor: opt.primaryColor }}
                  title="Primario / Jugador"
                />
                <span
                  className="w-3.5 h-3.5 rounded-full shadow-sm"
                  style={{ backgroundColor: opt.secondaryColor }}
                  title="Secundario / Entorno"
                />
                <span className="ml-auto font-label-sm text-[10px] text-outline uppercase font-mono">
                  {isActive ? "ACTIVO" : "ELEGIR"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  // Variant: "compact" (para HUD) y "toolbar" (para barra de controles de cabina)
  return (
    <div className="inline-flex items-center gap-1 bg-surface-container-highest/80 p-1 rounded-md border border-outline-variant/30">
      {SKIN_OPTIONS.map((opt) => {
        const isActive = opt.id === activeId;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelectSkin(opt.skin, opt.variant)}
            title={`${opt.name} — ${opt.description}`}
            style={{
              borderColor: isActive ? opt.primaryColor : undefined,
              boxShadow: isActive ? `0 0 10px ${opt.glowColor}` : undefined,
            }}
            className={`px-2 py-1 rounded text-[11px] font-label-sm uppercase font-bold tracking-wider transition-all duration-150 cursor-pointer flex items-center gap-1.5 border ${
              isActive
                ? "bg-surface-bright text-white border-2"
                : "border-transparent text-outline hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            <span
              className="w-2 h-2 rounded-full shadow-[0_0_4px_currentColor]"
              style={{ backgroundColor: opt.primaryColor }}
            />
            <span>{opt.shortName}</span>
          </button>
        );
      })}
    </div>
  );
};
