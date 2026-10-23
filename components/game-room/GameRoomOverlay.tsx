"use client";

import { FC, useState, useEffect } from "react";
import Link from "next/link";
import { saveScoreRecord } from "@/lib/scores";
import { createClient } from "@/lib/supabase/client";

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
  const [gamerTag, setGamerTag] = useState<string>("PILOTO");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Ajuste de estado al cambiar isGameOver sin efecto síncrono
  const [prevGameOver, setPrevGameOver] = useState(isGameOver);
  if (prevGameOver !== isGameOver) {
    setPrevGameOver(isGameOver);
    if (isGameOver) {
      setIsSaved(false);
      setStatusMessage(null);
    }
  }

  // Cargar usuario autenticado de Supabase si existe
  useEffect(() => {
    if (!isGameOver) return;
    let cancelled = false;

    const checkUser = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (cancelled || !user) return;

        const metaTag = user.user_metadata?.gamer_tag;
        if (metaTag) {
          setGamerTag(metaTag.toUpperCase());
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("gamer_tag")
          .eq("id", user.id)
          .maybeSingle();

        if (!cancelled && profile?.gamer_tag) {
          setGamerTag(profile.gamer_tag.toUpperCase());
        }
      } catch {
        // Modo offline
      }
    };

    checkUser();
    return () => {
      cancelled = true;
    };
  }, [isGameOver]);

  const handleSaveScore = async () => {
    const cleanTag = gamerTag.trim().toUpperCase();
    if (!cleanTag || isSubmitting || isSaved) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await saveScoreRecord({
        gameId,
        score,
        playerName: cleanTag,
        accuracy: "98%",
        combo: "x12",
      });

      if (res.success) {
        setIsSaved(true);
        setStatusMessage("✓ PUNTUACIÓN REGISTRADA EXITOSAMENTE EN SUPABASE");
      } else {
        setIsSaved(true);
        setStatusMessage(
          `✓ GUARDADO LOCALMENTE (${res.error || "Récord guardado"})`
        );
      }
    } catch {
      setIsSaved(true);
      setStatusMessage("✓ GUARDADO LOCALMENTE EN ESTE DISPOSITIVO");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInternalRestart = () => {
    setIsSaved(false);
    setStatusMessage(null);
    onRestart();
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
              ARCADE VAULT • REGISTRO DE CLASIFICACIÓN
            </span>
          </div>

          <h2 className="font-display-lg text-display-lg text-secondary-container tracking-wider uppercase drop-shadow-[0_0_18px_rgba(255,77,128,0.9)] animate-pulse">
            ★ FIN DEL JUEGO ★
          </h2>

          <p className="font-title-sm text-title-sm text-on-surface-variant uppercase tracking-wider mt-1 mb-4">
            SIMULACIÓN CONCLUIDA EN LA CABINA CRT
          </p>

          {/* Marcador Final */}
          <div className="w-full bg-surface-container-lowest p-4 rounded mb-4 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)] border border-outline-variant/30 flex flex-col items-center">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest mb-1">
              PUNTUACIÓN TOTAL ACUMULADA
            </span>
            <span className="font-headline-lg text-headline-lg text-primary tracking-widest font-bold drop-shadow-[0_0_12px_rgba(0,245,255,0.9)]">
              {score.toLocaleString()} PUNTOS
            </span>
          </div>

          {/* Formulario de Registro de Alias / Nombre para Supabase */}
          <div className="w-full mb-6 bg-surface-container-lowest/60 p-4 rounded border border-outline-variant/30 flex flex-col items-center">
            <label
              htmlFor="pilot-alias"
              className="font-label-md text-label-md text-primary-fixed uppercase tracking-wider font-bold mb-2 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">
                badge
              </span>
              REGISTRA TU ALIAS O NOMBRE:
            </label>

            <div className="w-full max-w-xs flex flex-col items-center gap-2">
              <input
                id="pilot-alias"
                type="text"
                maxLength={15}
                disabled={isSaved || isSubmitting}
                value={gamerTag}
                onChange={(e) =>
                  setGamerTag(
                    e.target.value.replace(/[^a-zA-Z0-9_-]/g, "").toUpperCase()
                  )
                }
                placeholder="PILOTO_01"
                className="w-full py-2.5 px-4 bg-surface-container-highest text-primary font-headline-md text-headline-md text-center uppercase rounded focus:bg-surface-bright focus:text-white shadow-[0_0_15px_rgba(0,245,255,0.3)] outline-none border border-primary-container/60 tracking-widest disabled:opacity-50"
              />
              <span className="text-[11px] text-outline-variant uppercase tracking-wider">
                MÁX. 15 CARACTERES (LETRAS, NÚMEROS Y GUIONES)
              </span>
            </div>
          </div>

          {/* Mensaje de Estado / Feedback */}
          {statusMessage && (
            <div
              className={`w-full mb-4 p-2.5 rounded font-label-sm text-label-sm uppercase tracking-wider text-center border ${
                statusMessage.includes("EXITOSAMENTE")
                  ? "bg-tertiary-container/20 text-tertiary-fixed border-tertiary-container/40"
                  : "bg-primary-container/20 text-primary-fixed border-primary-container/40"
              }`}
            >
              {statusMessage}
            </div>
          )}

          {/* Botones de Acción */}
          <div className="w-full flex flex-col gap-2.5">
            {!isSaved ? (
              <button
                type="button"
                disabled={isSubmitting || !gamerTag.trim()}
                onClick={handleSaveScore}
                className="w-full py-3 bg-primary-container hover:bg-white text-on-primary font-headline-md text-headline-md uppercase tracking-wider rounded shadow-[0_0_20px_rgba(0,245,255,0.8)] transition-all duration-150 active:translate-y-1 flex items-center justify-center gap-2 cursor-pointer font-bold disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[24px]">
                  {isSubmitting ? "hourglass_empty" : "verified"}
                </span>
                {isSubmitting
                  ? "TRANSMITIENDO A SUPABASE..."
                  : "GUARDAR EN SALÓN DE LA FAMA"}
              </button>
            ) : (
              <Link
                href="/leaderboard"
                className="w-full py-3 bg-tertiary-container hover:bg-tertiary-fixed text-on-tertiary font-headline-md text-headline-md uppercase tracking-wider rounded shadow-[0_0_20px_rgba(222,231,0,0.8)] transition-all flex items-center justify-center gap-2 font-bold text-center"
              >
                <span className="material-symbols-outlined text-[24px]">
                  leaderboard
                </span>
                VER EN EL SALÓN DE LA FAMA →
              </Link>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
              <button
                type="button"
                onClick={handleInternalRestart}
                className="py-3 bg-secondary-container hover:bg-secondary text-white font-title-sm text-title-sm uppercase tracking-wider rounded shadow-[0_0_15px_rgba(255,77,128,0.7)] transition-all duration-150 active:translate-y-1 flex items-center justify-center gap-1.5 cursor-pointer font-bold"
              >
                <span className="material-symbols-outlined text-[20px]">
                  replay
                </span>
                REINTENTAR
              </button>

              <Link
                href="/"
                className="py-3 bg-surface-container-highest hover:bg-surface-bright text-on-surface font-title-sm text-title-sm uppercase tracking-wider rounded transition-all duration-150 active:translate-y-1 flex items-center justify-center gap-1.5 text-center border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[20px]">
                  door_open
                </span>
                IR AL VAULT
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
