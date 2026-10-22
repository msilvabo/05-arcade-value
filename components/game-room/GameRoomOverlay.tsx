"use client";

import { FC, useState } from "react";
import Link from "next/link";

interface GameRoomOverlayProps {
  isPaused: boolean;
  onResume: () => void;
  isGameOver: boolean;
  onRestart: () => void;
  score: number;
  gameId: string;
}

export const GameRoomOverlay: FC<GameRoomOverlayProps> = ({
  isPaused,
  onResume,
  isGameOver,
  onRestart,
  score,
  gameId,
}) => {
  const [initials, setInitials] = useState<string[]>(["R", "P", "8"]);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSaveScore = () => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  if (!isPaused && !isGameOver) return null;

  return (
    <div className="absolute inset-0 bg-surface-container-lowest/90 backdrop-blur-md z-30 flex items-center justify-center p-4">
      {/* Modal de Pausa */}
      {isPaused && !isGameOver && (
        <div className="relative w-full max-w-md bg-surface-container-low rounded-xl p-6 md:p-8 shadow-[0_0_40px_rgba(0,245,255,0.4)] border border-primary-container/40 flex flex-col items-center text-center">
          <div className="bg-primary-container px-3 py-0.5 rounded shadow-[0_0_12px_rgba(0,245,255,0.8)] -mt-11 mb-4">
            <span className="font-label-sm text-label-sm text-on-primary uppercase tracking-widest font-bold">
              TERMINAL EN SUSPENSIÓN
            </span>
          </div>

          <h2 className="font-display-lg text-display-lg text-primary tracking-wider uppercase drop-shadow-[0_0_16px_rgba(0,245,255,0.9)] animate-pulse">
            ⏸ PAUSA
          </h2>

          <p className="font-body-md text-body-md text-on-surface-variant my-3">
            La simulación cuántica ha sido pausada temporalmente.
          </p>

          <div className="w-full flex flex-col gap-2.5 mt-2">
            <button
              type="button"
              onClick={onResume}
              className="w-full py-3 bg-primary-container hover:bg-white text-on-primary font-headline-md text-headline-md uppercase tracking-wider rounded shadow-[0_0_20px_rgba(0,245,255,0.8)] transition-all cursor-pointer"
            >
              ▶ REANUDAR PARTIDA
            </button>

            <Link
              href={`/games/${gameId}`}
              className="w-full py-2.5 bg-surface-container-highest hover:bg-surface-bright text-on-surface font-title-sm text-title-sm uppercase tracking-wider rounded transition-all text-center border border-outline-variant/30"
            >
              VOLVER AL LANZADOR
            </Link>

            <Link
              href="/"
              className="w-full py-2.5 bg-surface-container text-on-surface-variant hover:text-on-surface font-label-md text-label-md uppercase tracking-wider rounded transition-all text-center"
            >
              IR AL VAULT PRINCIPAL
            </Link>
          </div>
        </div>
      )}

      {/* Modal de Fin del Juego (GAME OVER) */}
      {isGameOver && (
        <div className="relative w-full max-w-lg bg-surface-container-low rounded-xl p-6 md:p-8 shadow-[0_0_40px_rgba(255,77,128,0.5),inset_0_0_20px_rgba(0,245,255,0.15)] border border-secondary-container/50 flex flex-col items-center text-center">
          <div className="bg-secondary-container px-3 py-0.5 rounded shadow-[0_0_12px_rgba(255,77,128,0.8)] -mt-11 mb-4">
            <span className="font-label-sm text-label-sm text-white uppercase tracking-widest font-bold">
              ARCADE VAULT • SISTEMA DE CLASIFICACIÓN
            </span>
          </div>

          <h2 className="font-display-lg text-display-lg text-secondary-container tracking-wider uppercase drop-shadow-[0_0_18px_rgba(255,77,128,0.9)] animate-pulse">
            ★ FIN DEL JUEGO ★
          </h2>

          <p className="font-title-sm text-title-sm text-on-surface-variant uppercase tracking-wider mt-1 mb-4">
            HAS COMPLETADO CON HONOR LA MATRIZ:{" "}
            <span className="text-primary-fixed">NIVEL 04</span>
          </p>

          {/* Marcador Final */}
          <div className="w-full bg-surface-container-lowest p-4 rounded mb-4 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)] border border-outline-variant/30 flex flex-col items-center">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest mb-1">
              PUNTUACIÓN TOTAL ACUMULADA
            </span>
            <span className="font-headline-lg text-headline-lg text-primary tracking-widest font-bold drop-shadow-[0_0_12px_rgba(0,245,255,0.9)]">
              {score.toLocaleString()} PUNTOS
            </span>
            <div className="mt-2 inline-flex items-center gap-1.5 bg-tertiary-container/20 px-2.5 py-1 rounded border border-tertiary-container/30">
              <span className="material-symbols-outlined text-tertiary-fixed text-[16px]">
                military_tech
              </span>
              <span className="font-label-sm text-label-sm text-tertiary-fixed font-bold tracking-widest uppercase">
                ¡NUEVA MEJOR MARCA PERSONAL REGISTRADA!
              </span>
            </div>
          </div>

          {/* Iniciales High Score */}
          <div className="w-full mb-6">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mb-2">
              GUARDAR PUNTUACIÓN EN EL SALÓN DE LA FAMA
            </label>
            <div className="flex items-center justify-center gap-3">
              <span className="font-label-md text-label-md text-outline uppercase">
                TAG PILOTO:
              </span>
              <div className="flex gap-2">
                {[0, 1, 2].map((idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={initials[idx]}
                    onChange={(e) => {
                      const newInitials = [...initials];
                      newInitials[idx] = e.target.value.toUpperCase();
                      setInitials(newInitials);
                    }}
                    className="w-12 h-12 bg-surface-container-highest text-primary-container font-headline-md text-headline-md text-center uppercase rounded focus:bg-surface-bright focus:text-white shadow-[0_0_10px_rgba(0,245,255,0.4)] outline-none border border-outline-variant/40"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="w-full flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleSaveScore}
              className="w-full py-3 bg-primary-container hover:bg-white text-on-primary font-headline-md text-headline-md uppercase tracking-wider rounded shadow-[0_0_20px_rgba(0,245,255,0.8)] transition-all duration-150 active:translate-y-1 flex items-center justify-center gap-2 cursor-pointer font-bold"
            >
              <span className="material-symbols-outlined text-[24px]">verified</span>
              GUARDAR PUNTUACIÓN
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
              <button
                type="button"
                onClick={onRestart}
                className="py-3 bg-secondary-container hover:bg-secondary text-white font-title-sm text-title-sm uppercase tracking-wider rounded shadow-[0_0_15px_rgba(255,77,128,0.7)] transition-all duration-150 active:translate-y-1 flex items-center justify-center gap-1.5 cursor-pointer font-bold"
              >
                <span className="material-symbols-outlined text-[20px]">replay</span>
                REINTENTAR
              </button>

              <Link
                href="/"
                className="py-3 bg-surface-container-highest hover:bg-surface-bright text-on-surface font-title-sm text-title-sm uppercase tracking-wider rounded transition-all duration-150 active:translate-y-1 flex items-center justify-center gap-1.5 text-center border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[20px]">door_open</span>
                IR AL VAULT
              </Link>
            </div>
          </div>

          {/* Mensaje de Confirmación */}
          {savedMessage && (
            <div className="mt-3 text-tertiary-fixed font-label-sm text-label-sm uppercase tracking-widest animate-pulse">
              ✓ DATOS TRANSMITIDOS SATISFACTORIAMENTE AL NODO PRINCIPAL
            </div>
          )}
        </div>
      )}
    </div>
  );
};
