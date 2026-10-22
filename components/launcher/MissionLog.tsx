"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { GameExtendedDetails } from "@/types/launcher";

interface MissionLogProps {
  game: GameExtendedDetails;
}

export const MissionLog: FC<MissionLogProps> = ({ game }) => {
  const [difficulty, setDifficulty] = useState<"cadete" | "veterano" | "pesadilla">("veterano");

  const diffMultiplier =
    difficulty === "cadete" ? "1.0x" : difficulty === "veterano" ? "1.5x" : "2.5x";

  return (
    <div className="flex flex-col gap-space-lg">
      {/* CRT Screen Preview Container */}
      <div className="relative bg-surface-container-lowest rounded-xl p-space-md shadow-[inset_0_0_25px_rgba(0,0,0,0.9),0_10px_35px_rgba(0,0,0,0.8)] overflow-hidden border border-outline-variant/30">
        <div className="flex items-center justify-between pb-space-sm text-outline-variant font-label-sm text-label-sm uppercase tracking-widest">
          <div className="flex items-center gap-space-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary-container inline-block shadow-[0_0_8px_rgba(255,77,128,0.9)] animate-pulse"></span>
            <span className="text-on-surface">CANAL CH-042 • RASTER FREQ 60HZ</span>
          </div>
          <span className="text-primary-fixed font-bold">[V-SYNC BLOQUEADO]</span>
        </div>

        {/* Gameplay Preview Screen */}
        <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-surface-container-lowest shadow-[inset_0_0_50px_rgba(0,0,0,1)] flex items-center justify-center border border-primary-container/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-fPs7U_GTq0m3kNp99qTRAbytzHyZ8fL6cWWVJF9hPJUMROEIPTaikbm99dJOjAR6tdjh4Y537vSJRAXjV5A4UXuPcyh1hyO3EasemWHL8YreXuNSxgYyHx0dk7FBIUWsr024iu-VyRtB4Emn3uYzeJdZ9NSeIH6GTKDStkaHU_FZ4Mn0N_kPXANwxgOmQScJL3jyC93OmKXg1WNJYFtjzDG57YDod7Sp72WpWLCtcpn8lThmewAn0g"
            alt="Gameplay Preview"
            className="w-full h-full object-cover"
          />

          {/* HUD Overlay sobre gameplay */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/90 via-transparent to-transparent flex flex-col justify-between p-space-md pointer-events-none">
            <div className="flex justify-between items-center w-full font-label-md text-label-md">
              <span className="bg-surface-container-lowest/80 text-primary-fixed px-space-sm py-0.5 rounded shadow border border-primary-container/40">
                1UP: 049800
              </span>
              <span className="bg-surface-container-lowest/80 text-secondary-fixed px-space-sm py-0.5 rounded shadow border border-secondary-container/40">
                RÉCORD: {game.maxScore}
              </span>
            </div>
            <div className="flex justify-between items-end w-full">
              <div className="flex items-center gap-1">
                <span className="text-tertiary-fixed font-label-sm text-label-sm uppercase">
                  NAVES:
                </span>
                <div className="w-5 h-2 rounded bg-primary-fixed-dim shadow-[0_0_6px_rgba(0,245,255,0.8)]"></div>
                <div className="w-5 h-2 rounded bg-primary-fixed-dim shadow-[0_0_6px_rgba(0,245,255,0.8)]"></div>
                <div className="w-5 h-2 rounded bg-primary-fixed-dim shadow-[0_0_6px_rgba(0,245,255,0.8)]"></div>
              </div>
              <span className="font-label-sm text-label-sm text-tertiary-fixed font-bold uppercase tracking-widest bg-surface-container-lowest/90 px-space-sm py-0.5 rounded border border-tertiary-fixed/30">
                FASE 14 // NÚCLEO DOH
              </span>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none"></div>
        </div>
      </div>

      {/* Bitácora de Misión & Lore */}
      <div className="bg-surface-container rounded-lg p-space-lg flex flex-col gap-space-sm shadow-md border border-outline-variant/30">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-secondary-fixed text-[20px]">
            info
          </span>
          <h2 className="font-title-sm text-title-sm text-primary uppercase tracking-wider">
            BITÁCORA DE MISIÓN
          </h2>
        </div>
        <p className="font-body-lg text-body-lg text-on-surface leading-relaxed">
          {game.missionLog.story}
        </p>
        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed pt-1">
          <strong className="text-primary-fixed">OBJETIVO CENTRAL:</strong>{" "}
          {game.missionLog.objective}
        </p>
      </div>

      {/* Selector de Dificultad Dinámico */}
      <div className="bg-surface-container-low rounded-lg p-space-md flex flex-col gap-space-sm shadow-md border border-outline-variant/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs text-primary-fixed">
            <span className="material-symbols-outlined text-[18px]">speed</span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest font-bold">
              MODULADOR DE DIFICULTAD
            </span>
          </div>
          <span className="font-label-sm text-label-sm text-tertiary-fixed font-bold">
            MULTIPLICADOR: {diffMultiplier}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setDifficulty("cadete")}
            className={`py-2 px-3 rounded text-center font-label-sm text-label-sm uppercase transition-all cursor-pointer border ${
              difficulty === "cadete"
                ? "bg-primary-container text-on-primary font-bold border-primary-container shadow-[0_0_12px_rgba(0,245,255,0.6)]"
                : "bg-surface-container-highest text-on-surface-variant border-outline-variant/30 hover:text-on-surface"
            }`}
          >
            CADETE (1.0x)
          </button>
          <button
            type="button"
            onClick={() => setDifficulty("veterano")}
            className={`py-2 px-3 rounded text-center font-label-sm text-label-sm uppercase transition-all cursor-pointer border ${
              difficulty === "veterano"
                ? "bg-secondary-container text-on-secondary font-bold border-secondary-container shadow-[0_0_12px_rgba(255,77,128,0.6)]"
                : "bg-surface-container-highest text-on-surface-variant border-outline-variant/30 hover:text-on-surface"
            }`}
          >
            VETERANO (1.5x)
          </button>
          <button
            type="button"
            onClick={() => setDifficulty("pesadilla")}
            className={`py-2 px-3 rounded text-center font-label-sm text-label-sm uppercase transition-all cursor-pointer border ${
              difficulty === "pesadilla"
                ? "bg-tertiary-container text-on-tertiary font-bold border-tertiary shadow-[0_0_12px_rgba(222,231,0,0.8)]"
                : "bg-surface-container-highest text-on-surface-variant border-outline-variant/30 hover:text-on-surface"
            }`}
          >
            PESADILLA (2.5x)
          </button>
        </div>
      </div>

      {/* Mapeo de Controlador Mecánico */}
      <div className="bg-surface-container-low rounded-lg p-space-md flex flex-col gap-space-xs shadow-md border border-outline-variant/30">
        <div className="flex items-center gap-space-xs text-primary-fixed-dim">
          <span className="material-symbols-outlined text-[18px]">keyboard</span>
          <span className="font-label-sm text-label-sm uppercase tracking-widest font-bold">
            MAPEO DE CONTROLADOR MECÁNICO
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
          {game.missionLog.controls.map((ctrl, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 rounded bg-surface-container-lowest border border-outline-variant/20 font-body-sm text-body-sm"
            >
              <span className="text-tertiary-fixed font-bold font-mono">{ctrl.key}</span>
              <span className="text-on-surface-variant">{ctrl.action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cápsulas y Potenciadores */}
      {game.missionLog.powerups.length > 0 && (
        <div className="bg-surface-container-low rounded-lg p-space-md flex flex-col gap-space-xs shadow-md border border-outline-variant/30">
          <div className="flex items-center gap-space-xs text-secondary-fixed">
            <span className="material-symbols-outlined text-[18px]">token</span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest font-bold">
              CÁPSULAS DE POTENCIACIÓN DETECTADAS
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
            {game.missionLog.powerups.map((p, i) => (
              <div
                key={i}
                className="p-2.5 rounded bg-surface-container-lowest border border-outline-variant/20 flex flex-col gap-1"
              >
                <span className={`font-label-sm text-label-sm font-bold uppercase ${p.color}`}>
                  ◆ {p.name}
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-[11px] leading-snug">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botones de Acción Principal: Iniciar Partida & Práctica */}
      <div className="flex flex-col sm:flex-row items-stretch gap-space-md pt-space-xs">
        <Link
          href={`/games/${game.id}/play`}
          className="flex-1 group relative flex items-center justify-center gap-space-sm bg-tertiary-container hover:bg-tertiary-fixed text-on-tertiary font-headline-md text-headline-md uppercase tracking-widest py-space-md px-space-lg rounded transition-all duration-150 active:translate-y-1 shadow-[0_0_25px_rgba(222,231,0,0.6)] hover:shadow-[0_0_40px_rgba(222,231,0,0.9)] cursor-pointer text-center"
        >
          <span className="material-symbols-outlined text-[28px] transition-transform group-hover:scale-125">
            play_arrow
          </span>
          <span className="font-bold">▶ JUGAR AHORA</span>
          <span className="absolute inset-0 rounded animate-ping bg-tertiary-fixed/20 pointer-events-none"></span>
        </Link>

        <Link
          href={`/games/${game.id}/play`}
          className="group flex items-center justify-center gap-space-xs bg-surface-container-high hover:bg-surface-bright text-primary font-label-lg text-label-lg uppercase tracking-wider py-space-md px-space-md rounded transition-all duration-150 active:translate-y-0.5 shadow-md hover:shadow-[0_0_15px_rgba(0,245,255,0.3)] cursor-pointer border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-[20px] text-primary-fixed group-hover:rotate-45 transition-transform">
            model_training
          </span>
          <span className="text-center">MODO PRÁCTICA LIBRE</span>
        </Link>
      </div>

      {/* Cabinet Status Micro-HUD */}
      <div className="flex flex-wrap items-center justify-between text-outline-variant font-label-sm text-label-sm bg-surface-container-lowest px-space-md py-space-xs rounded border border-outline-variant/20 gap-2">
        <span>EMULADOR: MAME/CORE-v0.256</span>
        <span className="text-tertiary-fixed font-bold">ESTADO DE HARDWARE: ÓPTIMO</span>
        <span>CABINA: {game.cabinetNumber} {"//"} MONEDA DETECTADA</span>
      </div>
    </div>
  );
};
