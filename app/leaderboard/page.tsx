"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/library/Header";
import { Footer } from "@/components/library/Footer";
import { LeaderboardPodium } from "@/components/leaderboard/LeaderboardPodium";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { fetchLeaderboardScores } from "@/lib/scores";
import { getGameConfig } from "@/app/games/_lib/registry";
import { LeaderboardEntry, LeaderboardPeriod } from "@/types/leaderboard";
import { LEADERBOARD_ENTRIES } from "@/data/leaderboard";

export default function LeaderboardPage() {
  const [credits] = useState<number>(4);
  const [sfx, setSfx] = useState<boolean>(true);
  const [music, setMusic] = useState<boolean>(true);
  const [selectedGame, setSelectedGame] = useState<string>("asteroids-2084");
  const [period, setPeriod] = useState<LeaderboardPeriod>("all-time");
  const [entries, setEntries] =
    useState<LeaderboardEntry[]>(LEADERBOARD_ENTRIES);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Cargar puntuaciones de Supabase cuando cambia el juego o el período
  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const data = await fetchLeaderboardScores(selectedGame, period);
        if (active) {
          setEntries(data);
          setIsLoading(false);
        }
      } catch (err) {
        console.warn("Error cargando scores:", err);
        if (active) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [selectedGame, period]);

  const activeGameConfig = getGameConfig(selectedGame);

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
                [SISTEMA TOP-TIER ARCHIVE // SUPABASE]
              </span>
              <span className="hidden sm:inline text-outline-variant">
                {"//"}
              </span>
              <span className="hidden sm:inline">
                TABLA OFICIAL DE PUNTUACIONES
              </span>
            </div>
            <div className="flex items-center gap-space-md">
              <span className="text-primary-fixed">
                ESTADO DE BASE DE DATOS: ONLINE
              </span>
              <span className="text-secondary-fixed">
                CABINA: {activeGameConfig.title}
              </span>
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
                  CABINA:
                </span>
                <span className="font-label-sm text-label-sm text-primary-fixed font-bold">
                  {activeGameConfig.cabinetNumber} •{" "}
                  {activeGameConfig.developer}
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
                  SUPABASE CLOUD RLS
                </span>
              </div>
            </div>
          </div>

          {/* Podio Neón Top 3 */}
          <LeaderboardPodium
            entries={entries}
            gameTitle={activeGameConfig.title}
          />

          {/* Selector de cartucho y Tabla Top 10 */}
          <LeaderboardTable
            entries={entries}
            selectedGame={selectedGame}
            onSelectGame={(g) => {
              setIsLoading(true);
              setSelectedGame(g);
            }}
            period={period}
            onSelectPeriod={(p) => {
              setIsLoading(true);
              setPeriod(p);
            }}
            isLoading={isLoading}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
