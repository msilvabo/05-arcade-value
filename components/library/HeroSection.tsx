"use client";

import { FC } from "react";

interface HeroSectionProps {
  onInsertCredit: () => void;
  showCoinFeedback: boolean;
  onOpenLeaderboard?: () => void;
}

export const HeroSection: FC<HeroSectionProps> = ({
  onInsertCredit,
  showCoinFeedback,
  onOpenLeaderboard,
}) => {
  return (
    <section className="relative w-full overflow-hidden bg-surface-container-lowest px-space-md lg:px-margin py-space-xl">
      {/* Ambient Vector Grid Backing */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-container via-surface-container-lowest to-surface" />
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(to_right,#00f5ff_1px,transparent_1px),linear-gradient(to_bottom,#00f5ff_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Live Server Telemetry */}
        <div className="flex flex-wrap items-center justify-center gap-space-sm bg-surface-container-low px-space-md py-1 rounded-full shadow-[0_0_15px_rgba(0,245,255,0.15)] mb-space-md border border-outline-variant/30">
          <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse" />
          <span className="font-label-md text-label-md text-primary tracking-widest uppercase">
            1,248 JUGADORES EN LÍNEA
          </span>
          <span className="text-outline-variant font-label-md text-label-md">•</span>
          <span className="w-2 h-2 rounded-full bg-secondary-container" />
          <span className="font-label-md text-label-md text-secondary-fixed tracking-widest uppercase">
            18 CABINAS ACTIVAS
          </span>
          <span className="text-outline-variant font-label-md text-label-md">•</span>
          <span className="font-label-sm text-label-sm text-tertiary-fixed tracking-widest uppercase">
            SISTEMA OK
          </span>
        </div>

        {/* Colossal Marquee Title */}
        <div className="relative my-space-xs select-none">
          <h1 className="font-display-lg text-display-lg md:text-[68px] md:leading-[76px] uppercase tracking-widest font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-container via-primary to-secondary-container drop-shadow-[0_0_25px_rgba(0,245,255,0.8)] [text-shadow:0_0_20px_#00f5ff,0_0_40px_#ff4d80]">
            ARCADE VAULT
          </h1>
          <span className="absolute -top-3 -right-6 hidden sm:inline-block px-2 py-0.5 bg-secondary-container text-on-secondary font-label-sm text-label-sm rounded uppercase tracking-widest shadow-[0_0_12px_rgba(255,77,128,0.9)] animate-bounce font-bold">
            REV.84
          </span>
        </div>

        {/* Coin Insert Prompt & Actions */}
        <p className="font-headline-md text-headline-md text-tertiary-fixed uppercase tracking-widest animate-pulse mt-space-xs mb-space-lg drop-shadow-[0_0_8px_rgba(227,236,0,0.6)]">
          ★ INSERTA UNA MONEDA PARA JUGAR ★
        </p>

        <div className="flex flex-wrap items-center justify-center gap-space-md">
          <button
            className="group relative px-space-xl py-space-sm bg-primary-container/10 hover:bg-primary-container text-primary-container hover:text-on-primary font-headline-md text-headline-md uppercase tracking-wider rounded transition-all duration-150 shadow-[0_0_20px_rgba(0,245,255,0.4)] hover:shadow-[0_0_30px_rgba(0,245,255,0.9)] active:translate-y-0.5 flex items-center gap-space-sm cursor-pointer border border-primary-container/40"
            id="insertCoinBtn"
            type="button"
            onClick={onInsertCredit}
          >
            <span className="material-symbols-outlined text-[24px]">toll</span>
            <span>INSERTAR CRÉDITO (+1)</span>
          </button>

          <button
            className="px-space-lg py-space-sm bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-lg text-label-lg uppercase tracking-wider rounded transition-all shadow-md flex items-center gap-2 cursor-pointer border border-outline-variant/30"
            type="button"
            onClick={onOpenLeaderboard}
          >
            <span className="material-symbols-outlined text-[20px] text-tertiary-fixed">
              military_tech
            </span>
            <span>SALÓN DE RÉCORDS</span>
          </button>
        </div>

        {/* Quick Audio Feedback Micro-display */}
        <div
          className={`h-6 mt-space-sm font-label-md text-label-md text-tertiary uppercase tracking-widest transition-opacity duration-300 ${
            showCoinFeedback ? "opacity-100" : "opacity-0"
          }`}
          id="coinFlashMsg"
        >
          [ ¡CRÉDITO INSERTADO CON ÉXITO! FICHAS RESTANTES DISPONIBLES ]
        </div>
      </div>
    </section>
  );
};
