"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { submitScoreAction } from "@/app/actions/leaderboard";

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
  const [nickname, setNickname] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSaveScore = async () => {
    if (isSaving || saved) return;
    setIsSaving(true);
    setErrorMessage("");

    const tag = nickname.trim() || "PILOTO_VAULT";
    const result = await submitScoreAction({
      gameId,
      score,
      nickname: tag,
      accuracy: "98%",
      combo: "x16",
    });

    setIsSaving(false);

    if (result.success) {
      setSaved(true);
    } else {
      setErrorMessage(
        result.error || "No se pudo sincronizar la puntuación con el servidor."
      );
    }
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
            PARTIDA FINALIZADA // REGISTRO DE TELEMETRÍA DISPONIBLE
          </p>

          {/* Marcador Final */}
          <div className="w-full bg-surface-container-lowest p-4 rounded mb-4 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)] border border-outline-variant/30 flex flex-col items-center">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest mb-1">
              PUNTUACIÓN OBTENIDA
            </span>
            <span className="font-headline-lg text-headline-lg text-primary tracking-widest font-bold drop-shadow-[0_0_12px_rgba(0,245,255,0.9)]">
              {score.toLocaleString()} PUNTOS
            </span>
          </div>

          {/* Registro de Nickname en Salón de la Fama */}
          <div className="w-full mb-5 bg-surface-container p-3.5 rounded border border-outline-variant/30 text-left">
            <label className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider block mb-1.5 font-bold">
              REGISTRAR EN EL SALÓN DE LA FAMA
            </label>
            <p className="text-on-surface-variant text-[12px] mb-2.5">
              Ingresa tu nickname o gamer tag para figurar en la tabla global:
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                maxLength={16}
                value={nickname}
                onChange={(e) => setNickname(e.target.value.toUpperCase())}
                placeholder="TU NICKNAME (EJ: PILOTO_99)"
                disabled={saved || isSaving}
                className="flex-1 bg-surface-container-lowest text-primary font-headline-sm text-headline-sm px-3 py-2 rounded focus:border-primary-container focus:shadow-[0_0_10px_rgba(0,245,255,0.4)] outline-none border border-outline-variant/40 uppercase placeholder:text-outline tracking-wider"
              />

              <button
                type="button"
                onClick={handleSaveScore}
                disabled={isSaving || saved}
                className={`px-4 py-2 rounded font-label-md text-label-md uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  saved
                    ? "bg-tertiary text-on-tertiary shadow-[0_0_12px_rgba(222,231,0,0.8)] cursor-default"
                    : "bg-primary-container hover:bg-white text-on-primary shadow-[0_0_15px_rgba(0,245,255,0.7)]"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {saved ? "check_circle" : "publish"}
                </span>
                {saved ? "REGISTRADO" : isSaving ? "ENVIANDO..." : "REGISTRAR"}
              </button>
            </div>

            {/* Mensajes de Confirmación o Error */}
            {saved && (
              <div className="mt-2.5 p-2 bg-tertiary-container/20 rounded border border-tertiary-container/40 flex items-center justify-between gap-2">
                <span className="text-tertiary-fixed font-label-sm text-label-sm uppercase tracking-wider font-bold">
                  ✓ ¡PUNTUACIÓN PUBLICADA EN EL SALÓN DE LA FAMA!
                </span>
                <Link
                  href="/leaderboard"
                  className="px-2.5 py-1 bg-tertiary-container text-on-tertiary rounded text-[11px] font-label-sm font-bold uppercase tracking-wider hover:bg-white transition-colors"
                >
                  VER TABLA
                </Link>
              </div>
            )}

            {errorMessage && (
              <div className="mt-2 text-error font-label-sm text-label-sm uppercase tracking-wider">
                ⚠ {errorMessage}
              </div>
            )}
          </div>

          {/* Botones de Acción */}
          <div className="w-full flex flex-col gap-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
              <button
                type="button"
                onClick={onRestart}
                className="py-3 bg-secondary-container hover:bg-secondary text-white font-title-sm text-title-sm uppercase tracking-wider rounded shadow-[0_0_15px_rgba(255,77,128,0.7)] transition-all duration-150 active:translate-y-1 flex items-center justify-center gap-1.5 cursor-pointer font-bold"
              >
                <span className="material-symbols-outlined text-[20px]">
                  replay
                </span>
                REINTENTAR PARTIDA
              </button>

              <Link
                href="/leaderboard"
                className="py-3 bg-surface-container-highest hover:bg-surface-bright text-on-surface font-title-sm text-title-sm uppercase tracking-wider rounded transition-all duration-150 active:translate-y-1 flex items-center justify-center gap-1.5 text-center border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[20px]">
                  leaderboard
                </span>
                SALÓN DE LA FAMA
              </Link>
            </div>

            <Link
              href="/"
              className="py-2.5 bg-surface-container text-on-surface-variant hover:text-on-surface font-label-md text-label-md uppercase tracking-wider rounded transition-all text-center"
            >
              IR AL VAULT PRINCIPAL
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
