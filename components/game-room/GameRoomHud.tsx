"use client";

import { FC } from "react";
import Link from "next/link";

interface GameRoomHudProps {
  score: number;
  highScore: number;
  lives: number;
  level: string;
  isPaused: boolean;
  onTogglePause: () => void;
  audioOn: boolean;
  onToggleAudio: () => void;
  volume?: number;
  onVolumeChange?: (v: number) => void;
  gameId: string;
}

export const GameRoomHud: FC<GameRoomHudProps> = ({
  score,
  highScore,
  lives,
  level,
  isPaused,
  onTogglePause,
  audioOn,
  onToggleAudio,
  volume = 0.7,
  onVolumeChange,
  gameId,
}) => {
  const formattedScore = score.toLocaleString().padStart(6, "0");
  const formattedHighScore = highScore.toLocaleString().padStart(6, "0");

  return (
    <header className="w-full bg-surface-container-lowest px-space-md lg:px-margin py-space-sm shadow-[0_8px_30px_rgba(0,0,0,0.8)] z-20 border-b border-outline-variant/30">
      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row items-center justify-between gap-space-sm">
        {/* TelemetrÃ­a Primaria: Puntos y RÃ©cord */}
        <div className="flex items-center gap-space-md flex-wrap justify-center">
          {/* PuntuaciÃ³n Actual */}
          <div className="bg-surface-container-low px-space-md py-space-xs rounded shadow-[inset_0_0_12px_rgba(0,245,255,0.15)] flex flex-col border border-primary-container/20">
            <span className="font-label-sm text-label-sm text-primary-fixed-dim uppercase tracking-widest">
              PUNTUACIÃ“N ACTUAL
            </span>
            <span className="font-headline-md text-headline-md text-primary-container tracking-wider drop-shadow-[0_0_10px_rgba(0,245,255,0.8)]">
              {formattedScore}
            </span>
          </div>

          {/* RÃ©cord Global */}
          <div className="bg-surface-container-low px-space-md py-space-xs rounded shadow-[inset_0_0_12px_rgba(227,236,0,0.12)] flex flex-col border border-tertiary-container/20">
            <span className="font-label-sm text-label-sm text-tertiary-fixed tracking-widest uppercase">
              RÃ‰CORD MÃXIMO
            </span>
            <span className="font-headline-md text-headline-md text-tertiary tracking-wider drop-shadow-[0_0_10px_rgba(253,255,181,0.7)]">
              {formattedHighScore}
            </span>
          </div>

          {/* Indicador de Nivel */}
          <div className="hidden sm:flex bg-surface-container-high px-space-md py-space-xs rounded items-center gap-space-xs shadow-[0_0_15px_rgba(255,77,128,0.2)] border border-secondary-container/20">
            <span className="material-symbols-outlined text-secondary text-[20px] animate-pulse">
              grid_view
            </span>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                FASE ACTIVA
              </span>
              <span className="font-title-sm text-title-sm text-secondary-fixed tracking-wider uppercase">
                {level}
              </span>
            </div>
          </div>
        </div>

        {/* TelemetrÃ­a Central: Vidas y Piloto */}
        <div className="flex items-center gap-space-lg">
          {/* Vidas de Reserva */}
          <div className="flex flex-col items-center">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest mb-0.5">
              NAVES DE RESERVA
            </span>
            <div className="flex items-center gap-1.5 bg-surface-container-lowest px-space-sm py-1 rounded border border-outline-variant/30">
              {[0, 1, 2, 3].map((index) => {
                const active = index < lives;
                return (
                  <span
                    key={index}
                    className={`material-symbols-outlined text-[20px] ${
                      active
                        ? "text-secondary-container drop-shadow-[0_0_8px_rgba(255,77,128,0.9)]"
                        : "text-outline-variant"
                    }`}
                    style={{
                      fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    favorite
                  </span>
                );
              })}
            </div>
          </div>

          {/* Perfil Jugador 1 */}
          <div className="hidden md:flex items-center gap-space-xs bg-surface-container px-space-md py-1.5 rounded border border-primary-container/20">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-ping"></span>
            <div className="flex flex-col text-left">
              <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider">
                JUGADOR 1
              </span>
              <span className="font-label-lg text-label-lg text-primary tracking-widest uppercase font-bold">
                RETRO_PRO_84
              </span>
            </div>
          </div>
        </div>

        {/* Botones de AcciÃ³n RÃ¡pida */}
        <div className="flex items-center gap-space-xs">
          <button
            type="button"
            onClick={onTogglePause}
            className={`group px-space-sm py-1 transition-all duration-150 rounded flex items-center gap-1 shadow-[0_0_10px_rgba(0,0,0,0.5)] active:translate-y-0.5 cursor-pointer border ${
              isPaused
                ? "bg-tertiary-container text-on-tertiary border-tertiary shadow-[0_0_12px_rgba(222,231,0,0.8)]"
                : "bg-surface-container-high hover:bg-primary-container text-primary-fixed hover:text-on-primary-container border-outline-variant/30"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isPaused ? "play_arrow" : "pause_circle"}
            </span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">
              {isPaused ? "[P] CONTINUAR" : "[P] PAUSA"}
            </span>
          </button>

          <div className="flex items-center gap-1 bg-surface-container-high px-2 py-1 rounded border border-outline-variant/30 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
            <button
              type="button"
              onClick={onToggleAudio}
              className="text-secondary hover:text-on-secondary-container transition-colors flex items-center cursor-pointer"
              title={audioOn ? "Silenciar audio (M)" : "Activar audio (M)"}
            >
              <span className="material-symbols-outlined text-[16px]">
                {!audioOn || volume === 0
                  ? "volume_off"
                  : volume < 0.5
                    ? "volume_down"
                    : "volume_up"}
              </span>
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={audioOn ? volume : 0}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onVolumeChange?.(val);
                if (!audioOn && val > 0) onToggleAudio();
              }}
              className="w-14 h-1.5 accent-primary-container bg-surface-container-highest rounded cursor-pointer"
              title={`Volumen: ${Math.round((audioOn ? volume : 0) * 100)}%`}
            />
            <span className="font-label-sm text-[10px] text-primary-fixed font-bold w-6 text-right">
              {audioOn ? `${Math.round(volume * 100)}%` : "MUT"}
            </span>
          </div>

          <Link
            href={`/games/${gameId}`}
            className="px-space-sm py-1 bg-surface-container-high hover:bg-surface-variant text-on-surface-variant hover:text-on-surface transition-all duration-150 rounded flex items-center gap-1 shadow-[0_0_10px_rgba(0,0,0,0.5)] active:translate-y-0.5 border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[16px]">
              logout
            </span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">
              [ESC] SALIR
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};
