"use client";

import { FC, useEffect } from "react";
import { Game } from "@/types/game";
import { GameArtwork } from "./GameArtwork";

interface GameModalProps {
  game: Game | null;
  onClose: () => void;
  credits: number;
}

export const GameModal: FC<GameModalProps> = ({ game, onClose, credits }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (game) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [game, onClose]);

  if (!game) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-surface-container rounded-xl border border-primary-container/60 shadow-[0_0_35px_rgba(0,245,255,0.4)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-space-md py-3 bg-surface-container-lowest border-b border-outline-variant/40">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary-container animate-pulse" />
            <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-widest font-bold">
              ESTADO DE CABINA // PRÓXIMAMENTE
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded bg-surface-container-high hover:bg-surface-bright text-on-surface hover:text-white transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Artwork Banner */}
        <div className="relative w-full h-40 bg-surface-container-lowest flex items-center justify-center overflow-hidden border-b border-outline-variant/30">
          <GameArtwork artType={game.artType} title={game.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent opacity-80" />
        </div>

        {/* Modal Content */}
        <div className="p-space-lg flex flex-col gap-space-md text-center">
          <div>
            <h3 className="font-headline-md text-headline-md text-primary tracking-wider uppercase drop-shadow-[0_0_8px_rgba(0,245,255,0.6)]">
              {game.title}
            </h3>
            <p className="font-label-sm text-label-sm text-tertiary-fixed tracking-widest uppercase mt-1">
              {game.category} • {game.year} • DIFILCULTAD: {game.difficulty}
            </p>
          </div>

          <div className="bg-surface-container-lowest p-space-md rounded-lg border border-outline-variant/30 flex flex-col gap-2 text-left">
            <div className="flex items-center justify-between text-body-sm font-body-sm">
              <span className="text-outline uppercase tracking-wider">Récord Actual:</span>
              <span className="text-tertiary-fixed font-bold tracking-wider">
                {game.record.score} ({game.record.holder})
              </span>
            </div>
            <div className="flex items-center justify-between text-body-sm font-body-sm">
              <span className="text-outline uppercase tracking-wider">Fichas en tu cartera:</span>
              <span className="text-primary-fixed font-bold tracking-wider">
                {credits.toString().padStart(2, "0")} CRÉDITOS
              </span>
            </div>
          </div>

          <div className="p-space-sm rounded bg-secondary-container/10 border border-secondary-container/40">
            <p className="font-label-sm text-label-sm text-secondary-fixed tracking-wider uppercase">
              [!] ESTA CABINA ESTÁ SIENDO RESTAURADA PARA EL LANZAMIENTO COMPLETO.
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              El motor de emulación está en preparación. ¡Muy pronto podrás competir por el récord mundial!
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-primary-container text-on-primary-container font-label-lg text-label-lg uppercase tracking-widest font-bold rounded shadow-[0_0_15px_rgba(0,245,255,0.6)] hover:shadow-[0_0_25px_rgba(0,245,255,0.9)] hover:scale-[1.01] active:translate-y-0.5 transition-all cursor-pointer"
          >
            ENTENDIDO / REGRESAR AL SALÓN
          </button>
        </div>
      </div>
    </div>
  );
};
