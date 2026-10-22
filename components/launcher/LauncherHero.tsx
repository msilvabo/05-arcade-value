"use client";

import { FC } from "react";
import Link from "next/link";
import { GameExtendedDetails } from "@/types/launcher";

interface LauncherHeroProps {
  game: GameExtendedDetails;
}

export const LauncherHero: FC<LauncherHeroProps> = ({ game }) => {
  return (
    <div className="flex flex-col gap-space-lg w-full">
      {/* 1. Barra de Navegación Secundaria / Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-space-md bg-surface-container-lowest/80 px-space-md py-space-sm rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-outline-variant/30">
        <div className="flex items-center gap-space-md flex-wrap">
          <Link
            href="/"
            className="group inline-flex items-center gap-space-xs font-label-md text-label-md uppercase tracking-wider text-primary-fixed hover:text-primary transition-all duration-200"
          >
            <span className="inline-block transition-transform duration-200 group-hover:-translate-x-1 drop-shadow-[0_0_8px_rgba(0,245,255,0.9)]">
              ◀
            </span>
            <span className="group-hover:drop-shadow-[0_0_8px_rgba(0,245,255,0.8)]">
              VOLVER AL VAULT
            </span>
          </Link>
          <span className="text-outline-variant select-none">/</span>
          <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
            <Link href="/" className="hover:text-on-surface transition-colors">
              BIBLIOTECA
            </Link>
            <span className="text-outline-variant select-none">&gt;</span>
            <span className="text-secondary-fixed font-bold drop-shadow-[0_0_6px_rgba(255,77,128,0.5)]">
              {game.title}: {game.subtitle}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-space-sm">
          <span className="w-2 h-2 rounded-full bg-primary-fixed-dim animate-pulse"></span>
          <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-widest">
            SERVIDOR LATAM-04 • CABINA SINCRONIZADA
          </span>
        </div>
      </div>

      {/* 2. Cabecera Hero del Juego */}
      <section className="flex flex-col gap-space-md relative overflow-hidden bg-surface-container-low rounded-xl p-space-lg lg:p-space-xl shadow-[0_8px_32px_rgba(0,0,0,0.7)] border border-outline-variant/30">
        {/* Glow Accents */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 -bottom-20 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col gap-space-xs relative z-10">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="bg-secondary-container text-surface-container-lowest font-label-sm text-label-sm px-space-xs py-0.5 font-bold uppercase rounded shadow-[0_0_10px_rgba(255,77,128,0.8)]">
              {game.badge}
            </span>
            <span className="text-tertiary-fixed font-label-sm text-label-sm uppercase tracking-wider">
              {game.genre}
            </span>
          </div>

          <h1 className="font-display-lg text-display-lg text-primary uppercase tracking-widest drop-shadow-[0_0_16px_rgba(0,245,255,0.8)] select-none">
            {game.title}:{" "}
            <span className="text-secondary-container drop-shadow-[0_0_20px_rgba(255,77,128,0.9)]">
              {game.subtitle}
            </span>
          </h1>

          <p className="font-headline-md text-headline-md text-on-surface-variant flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary-fixed-dim text-[20px]">
              sports_esports
            </span>
            <span>CABINA OFICIAL {game.cabinetNumber} • {game.developer}</span>
          </p>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center gap-space-sm pt-space-xs relative z-10">
          <div className="flex items-center gap-space-xs bg-surface-container px-space-sm py-space-xs rounded shadow-md border border-outline-variant/20">
            <span className="material-symbols-outlined text-primary-fixed text-[16px]">
              person
            </span>
            <span className="font-label-md text-label-md text-primary-fixed uppercase tracking-wider">
              1 JUGADOR
            </span>
          </div>
          <div className="flex items-center gap-space-xs bg-surface-container px-space-sm py-space-xs rounded shadow-md border border-outline-variant/20">
            <span className="material-symbols-outlined text-tertiary-fixed text-[16px]">
              videogame_asset
            </span>
            <span className="font-label-md text-label-md text-tertiary-fixed uppercase tracking-wider">
              COMPATIBLE CON GAMEPAD
            </span>
          </div>
          <div className="flex items-center gap-space-xs bg-surface-container px-space-sm py-space-xs rounded shadow-md border border-outline-variant/20">
            <span className="material-symbols-outlined text-secondary-fixed text-[16px]">
              volume_up
            </span>
            <span className="font-label-md text-label-md text-secondary-fixed uppercase tracking-wider">
              AUDIO ESTÉREO 8-BIT
            </span>
          </div>
          <div className="flex items-center gap-space-xs bg-surface-container px-space-sm py-space-xs rounded shadow-md border border-outline-variant/20">
            <span className="material-symbols-outlined text-primary-fixed-dim text-[16px]">
              tv
            </span>
            <span className="font-label-md text-label-md text-primary-fixed-dim uppercase tracking-wider">
              CRT SCANLINES ON
            </span>
          </div>
          <div className="flex items-center gap-space-xs bg-surface-container-highest px-space-sm py-space-xs rounded shadow-md ml-auto border border-tertiary-container/30">
            <span className="material-symbols-outlined text-tertiary-container text-[16px]">
              toll
            </span>
            <span className="font-label-md text-label-md text-tertiary uppercase tracking-wider font-bold">
              1 CRÉDITO / PARTIDA
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
