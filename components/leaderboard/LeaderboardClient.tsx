"use client";

import { FC, useState, useTransition } from "react";
import { Header } from "@/components/library/Header";
import { Footer } from "@/components/library/Footer";
import { LeaderboardPodium } from "@/components/leaderboard/LeaderboardPodium";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { LeaderboardEntry } from "@/types/leaderboard";
import { Game } from "@/types/game";
import { getLeaderboardAction } from "@/app/actions/leaderboard";

interface LeaderboardClientProps {
  initialGames: Game[];
  initialEntries: LeaderboardEntry[];
}

export const LeaderboardClient: FC<LeaderboardClientProps> = ({
  initialGames,
  initialEntries,
}) => {
  const [credits] = useState<number>(4);
  const [sfx, setSfx] = useState<boolean>(true);
  const [music, setMusic] = useState<boolean>(true);

  const defaultGameId = initialGames[0]?.id || "arkanoid-neon-revenge";
  const [selectedGame, setSelectedGame] = useState<string>(defaultGameId);
  const [entries, setEntries] = useState<LeaderboardEntry[]>(initialEntries);
  const [isPending, startTransition] = useTransition();

  const handleSelectGame = (gameId: string) => {
    setSelectedGame(gameId);
    startTransition(async () => {
      try {
        const freshEntries = await getLeaderboardAction(gameId);
        setEntries(freshEntries);
      } catch (err) {
        console.error("Error al actualizar clasificación para el juego:", err);
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header común sincronizado */}
      <Header
        credits={credits}
        sfx={sfx}
        music={music}
        onToggleSfx={() => setSfx((prev) => !prev)}
        onToggleMusic={() => setMusic((prev) => !prev)}
      />

      {/* Contenido Principal con offset del header fijo */}
      <main className="w-full pt-20 bg-surface relative min-h-[calc(100vh-80px)] flex-1">
        <div className="relative w-full overflow-hidden px-space-md sm:px-space-lg lg:px-margin pb-space-xl">
          {/* Sub-HUD Ticker */}
          <div className="w-full py-space-sm flex flex-wrap items-center justify-between gap-space-sm text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider border-b border-outline-variant/30">
            <div className="flex items-center gap-space-sm">
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-ping"></span>
              <span className="text-tertiary-fixed font-bold tracking-widest">
                [SISTEMA TOP-TIER ARCHIVE]
              </span>
              <span className="hidden sm:inline text-outline-variant">
                {"//"}
              </span>
              <span className="hidden sm:inline">
                ACTUALIZACIÓN EN TIEMPO REAL: CANAL GL-09
              </span>
            </div>
            <div className="flex items-center gap-space-md">
              <span className="text-primary-fixed">
                SERVIDORES DE PUNTUACIÓN: ÓPTIMO
              </span>
              <span className="text-secondary-fixed">PARTIDAS HOY: 18,492</span>
            </div>
          </div>

          {/* Encabezado Monumental & Metadatos */}
          <div className="relative mt-space-md mb-space-xl flex flex-col items-center text-center">
            {/* Resplandor de fondo neón */}
            <div className="absolute -top-12 w-96 h-36 bg-tertiary-container/20 blur-3xl rounded-full pointer-events-none"></div>
            <div className="absolute top-0 w-80 h-32 bg-primary-container/20 blur-3xl rounded-full pointer-events-none"></div>

            <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs bg-surface-container-high rounded shadow-[0_0_15px_rgba(227,236,0,0.3)] mb-space-sm border border-tertiary-fixed/30">
              <span className="material-symbols-outlined text-tertiary-fixed text-[16px]">
                military_tech
              </span>
              <span className="font-label-md text-label-md text-tertiary-fixed uppercase tracking-widest font-bold">
                REGISTRO OFICIAL DE MAESTRÍA COIN-OP
              </span>
            </div>

            <h1 className="font-headline-lg lg:font-display-lg text-headline-lg lg:text-display-lg uppercase tracking-widest text-primary drop-shadow-[0_0_20px_rgba(0,245,255,0.7)]">
              SALÓN DE LA FAMA
            </h1>
            <p className="mt-space-xs max-w-2xl font-title-sm text-title-sm uppercase tracking-wider text-secondary-fixed drop-shadow-[0_0_8px_rgba(255,77,128,0.6)]">
              LOS MEJORES MAESTROS DE LA MONEDA Y EL JOYSTICK DE TODA LA RED
            </p>

            {/* Terminal Metadata Bar */}
            <div className="mt-space-md flex flex-wrap justify-center items-center gap-space-md bg-surface-container-lowest px-space-lg py-space-xs rounded shadow-[0_0_12px_rgba(0,0,0,0.6)] border border-outline-variant/30">
              <div className="flex items-center gap-space-xs">
                <span className="font-label-sm text-label-sm text-outline">
                  TEMPORADA:
                </span>
                <span className="font-label-sm text-label-sm text-tertiary-fixed font-bold">
                  OCTUBRE &apos;84 {"//"} FASE IV
                </span>
              </div>
              <span className="text-outline-variant font-label-sm text-label-sm">
                |
              </span>
              <div className="flex items-center gap-space-xs">
                <span className="font-label-sm text-label-sm text-outline">
                  CABINAS CONECTADAS:
                </span>
                <span className="font-label-sm text-label-sm text-primary-fixed font-bold">
                  3,891 UNIDADES
                </span>
              </div>
              <span className="text-outline-variant font-label-sm text-label-sm hidden md:inline">
                |
              </span>
              <div className="hidden md:flex items-center gap-space-xs">
                <span className="font-label-sm text-label-sm text-outline">
                  VERIFICACIÓN:
                </span>
                <span className="font-label-sm text-label-sm text-on-surface font-bold">
                  ROM ANTI-CHEAT v4.2
                </span>
              </div>
            </div>
          </div>

          {/* Podio Neón Top 3 */}
          <LeaderboardPodium entries={entries} />

          {/* Selector de cartucho y Tabla */}
          <LeaderboardTable
            entries={entries}
            selectedGame={selectedGame}
            onSelectGame={handleSelectGame}
            games={initialGames}
            isLoading={isPending}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};
