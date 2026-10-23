"use client";

import { FC, useState, useEffect } from "react";
import { GameRoomHud } from "@/components/game-room/GameRoomHud";
import { CrtCabinet } from "@/components/game-room/CrtCabinet";
import { ArkanoidPresentation } from "@/components/game-room/ArkanoidPresentation";
import { AsteroidsGame } from "@/components/game-room/AsteroidsGame";
import { GameRoomOverlay } from "@/components/game-room/GameRoomOverlay";
import { getHighScore, saveGameScore } from "@/lib/scores";

interface PlayRoomClientProps {
  gameId: string;
}

export const PlayRoomClient: FC<PlayRoomClientProps> = ({ gameId }) => {
  const isAsteroids = gameId === "asteroids-2084" || gameId === "asteroids";

  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() =>
    getHighScore(gameId, isAsteroids ? 231800 : 142500)
  );
  const [lives, setLives] = useState<number>(3);
  const [level, setLevel] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [audioOn, setAudioOn] = useState<boolean>(true);
  const [scanlinesActive, setScanlinesActive] = useState<boolean>(true);
  const [curvatureActive, setCurvatureActive] = useState<boolean>(true);
  const [restartSignal, setRestartSignal] = useState<number>(0);

  useEffect(() => {
    const saved = getHighScore(gameId, isAsteroids ? 231800 : 142500);
    setHighScore(saved);
  }, [gameId, isAsteroids]);

  const handleScoreIncrement = (pts: number) => {
    setScore((prev) => prev + pts);
  };

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
  };

  const handleGameOver = async (finalScore: number) => {
    setIsGameOver(true);
    const result = await saveGameScore(gameId, finalScore);
    if (result.isNewRecord) {
      setHighScore(result.highScore);
    }
  };

  const handleRestart = () => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setIsGameOver(false);
    setIsPaused(false);
    setRestartSignal((prev) => prev + 1);
  };

  const levelLabel = isAsteroids
    ? `NV. ${String(level).padStart(2, "0")}: CINTURÓN VECTOR`
    : "NV. 04: MATRIZ NEÓN";

  return (
    <div className="flex flex-col min-h-screen bg-surface select-none">
      {/* HUD Superior Arcade */}
      <GameRoomHud
        score={score}
        highScore={highScore}
        lives={lives}
        level={levelLabel}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused((prev) => !prev)}
        audioOn={audioOn}
        onToggleAudio={() => setAudioOn((prev) => !prev)}
        gameId={gameId}
      />

      {/* Escenario Principal del Gabinete Arcade CRT */}
      <main className="relative w-full py-space-md lg:py-space-xl px-space-sm md:px-space-md flex flex-col items-center justify-center overflow-hidden flex-1">
        {/* Resplandores ambientales de tubos catódicos */}
        <div className="absolute w-[680px] h-[680px] bg-primary-container/10 rounded-full blur-[140px] pointer-events-none -top-24"></div>
        <div className="absolute w-[500px] h-[500px] bg-secondary-container/15 rounded-full blur-[120px] pointer-events-none -bottom-20"></div>

        {/* Chasis Arcade Exterior con CRT Monitor */}
        <div className="relative w-full max-w-4xl flex justify-center">
          <CrtCabinet
            scanlinesActive={scanlinesActive}
            curvatureActive={curvatureActive}
          >
            {isAsteroids ? (
              <AsteroidsGame
                isPaused={isPaused || isGameOver}
                onScoreChange={handleScoreChange}
                onLivesChange={(l) => setLives(l)}
                onLevelChange={(lvl) => setLevel(lvl)}
                onGameOver={handleGameOver}
                restartSignal={restartSignal}
              />
            ) : (
              <ArkanoidPresentation
                isPaused={isPaused || isGameOver}
                onScoreIncrement={handleScoreIncrement}
              />
            )}

            {/* Modales de Pausa y Game Over */}
            <GameRoomOverlay
              isPaused={isPaused}
              onResume={() => setIsPaused(false)}
              isGameOver={isGameOver}
              onRestart={handleRestart}
              score={score}
              gameId={gameId}
            />
          </CrtCabinet>
        </div>

        {/* Barra de Herramientas de Emulación y Test Visual */}
        <div className="w-full max-w-4xl mt-space-sm flex flex-wrap items-center justify-between gap-space-xs bg-surface-container-low p-2 rounded border border-outline-variant/30">
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-label-sm text-primary-fixed uppercase font-bold">
              AJUSTES CRT:
            </span>
            <button
              type="button"
              onClick={() => setScanlinesActive((prev) => !prev)}
              className={`px-2 py-1 rounded text-[11px] font-label-sm uppercase transition-all cursor-pointer ${
                scanlinesActive
                  ? "bg-primary-container text-on-primary font-bold shadow-[0_0_8px_rgba(0,245,255,0.6)]"
                  : "bg-surface-container-highest text-outline"
              }`}
            >
              SCANLINES {scanlinesActive ? "ON" : "OFF"}
            </button>
            <button
              type="button"
              onClick={() => setCurvatureActive((prev) => !prev)}
              className={`px-2 py-1 rounded text-[11px] font-label-sm uppercase transition-all cursor-pointer ${
                curvatureActive
                  ? "bg-primary-container text-on-primary font-bold shadow-[0_0_8px_rgba(0,245,255,0.6)]"
                  : "bg-surface-container-highest text-outline"
              }`}
            >
              CURVATURA {curvatureActive ? "ON" : "OFF"}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-label-sm text-label-sm text-secondary-fixed uppercase font-bold">
              SIMULACIÓN:
            </span>
            <button
              type="button"
              onClick={() => {
                if (isGameOver) {
                  handleRestart();
                } else {
                  handleGameOver(score);
                }
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-label-sm uppercase transition-all cursor-pointer border ${
                isGameOver
                  ? "bg-secondary-container text-white border-secondary-container shadow-[0_0_8px_rgba(255,77,128,0.7)]"
                  : "bg-surface-container-highest text-secondary-container border-secondary-container/30 hover:bg-surface-bright"
              }`}
            >
              {isGameOver ? "REANUDAR PARTIDA" : "FORZAR GAME OVER"}
            </button>
          </div>
        </div>

        {/* Guía de Control para el Jugador */}
        <div className="w-full max-w-4xl mt-space-md grid grid-cols-1 md:grid-cols-3 gap-space-sm text-center">
          {isAsteroids ? (
            <>
              <div className="bg-surface-container-low p-space-sm rounded shadow flex items-center justify-center gap-2 border border-outline-variant/30">
                <span className="material-symbols-outlined text-primary-fixed text-[18px]">
                  arrow_back
                </span>
                <span className="material-symbols-outlined text-primary-fixed text-[18px]">
                  arrow_forward
                </span>
                <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider">
                  FLECHAS / A-D: ROTAR NAVE
                </span>
              </div>

              <div className="bg-surface-container-low p-space-sm rounded shadow flex items-center justify-center gap-2 border border-outline-variant/30">
                <span className="material-symbols-outlined text-primary-fixed text-[18px]">
                  arrow_upward
                </span>
                <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider">
                  FLECHA ARRIBA / W: PROPULSAR
                </span>
              </div>

              <div className="bg-surface-container-low p-space-sm rounded shadow flex items-center justify-center gap-2 border border-outline-variant/30">
                <span className="px-2 py-0.5 bg-surface-container-high text-tertiary font-label-sm text-label-sm rounded uppercase font-bold">
                  ESPACIO
                </span>
                <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider">
                  DISPARAR CAÑONES
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="bg-surface-container-low p-space-sm rounded shadow flex items-center justify-center gap-2 border border-outline-variant/30">
                <span className="material-symbols-outlined text-primary-fixed text-[18px]">
                  arrow_back
                </span>
                <span className="material-symbols-outlined text-primary-fixed text-[18px]">
                  arrow_forward
                </span>
                <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider">
                  FLECHAS / RATÓN: MOVER VAUS
                </span>
              </div>

              <div className="bg-surface-container-low p-space-sm rounded shadow flex items-center justify-center gap-2 border border-outline-variant/30">
                <span className="px-2 py-0.5 bg-surface-container-high text-tertiary font-label-sm text-label-sm rounded uppercase font-bold">
                  ESPACIO
                </span>
                <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider">
                  LANZAR BOLA / LÁSER
                </span>
              </div>

              <div className="bg-surface-container-low p-space-sm rounded shadow flex items-center justify-center gap-2 border border-outline-variant/30">
                <span className="px-2 py-0.5 bg-surface-container-high text-secondary font-label-sm text-label-sm rounded uppercase font-bold">
                  P
                </span>
                <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider">
                  PAUSAR SIMULACIÓN
                </span>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Telemetría Inferior */}
      <footer className="w-full bg-surface-container-lowest py-space-sm px-space-md lg:px-margin shadow-[0_-4px_15px_rgba(0,0,0,0.7)] z-20 border-t border-outline-variant/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-space-xs text-center md:text-left font-label-sm text-label-sm text-outline">
          <div className="flex items-center gap-space-sm justify-center md:justify-start">
            <span className="w-2 h-2 rounded-full bg-primary-container shadow-[0_0_6px_rgba(0,245,255,0.8)]"></span>
            <span className="text-on-surface uppercase tracking-wider">
              CABINA: AR-VAULT-42 // V-SYNC BLOQUEADO // LATENCIA: 0.8MS
            </span>
          </div>
          <div className="flex items-center gap-space-md justify-center md:justify-end text-outline-variant">
            <span>MODO COMPETICIÓN ACTIVO</span>
            <span>ROM EMULATOR REV.84</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
