"use client";

import { FC } from "react";
import Link from "next/link";
import { FloatingSilhouettes } from "./FloatingSilhouettes";

export const HomeHero: FC = () => {
  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center py-20 px-4 sm:px-6 overflow-hidden">
      <FloatingSilhouettes />

      <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
        {/* Eyebrow */}
        <div className="font-mono text-xs sm:text-sm tracking-[0.24em] text-tertiary-fixed uppercase mb-6 flex items-center gap-1 font-bold">
          <span>▸ INSERTA UNA MONEDA</span>
          <span className="animate-pulse text-tertiary-fixed font-black">_</span>
        </div>

        {/* Home Title */}
        <h1 className="font-mono font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider leading-[1.05] uppercase flex flex-col gap-1 sm:gap-2">
          <span className="text-white drop-shadow-[0_0_16px_rgba(255,255,255,0.45)]">
            EL ARCADE
          </span>
          <span className="bg-gradient-to-b from-[#00f5ff] to-[#4dd0e1] bg-clip-text text-transparent filter drop-shadow-[0_0_18px_rgba(0,245,255,0.55)]">
            CLÁSICO ESTÁ
          </span>
          <span className="bg-gradient-to-b from-[#ff006e] to-[#ff6b9e] bg-clip-text text-transparent filter drop-shadow-[0_0_18px_rgba(255,0,110,0.55)]">
            DE VUELTA
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-7 sm:mt-8 mb-9 sm:mb-10 max-w-2xl text-on-surface-variant font-mono text-sm sm:text-base leading-relaxed tracking-wide">
          Juega los mejores clásicos directamente en tu navegador.
          <br className="hidden sm:inline" /> Sin descargas. Sin costo. Solo diversión pura de los 80s y 90s.
        </p>

        {/* Dual CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            href="/library"
            className="w-full sm:w-auto px-8 py-4 rounded font-mono font-bold text-sm tracking-widest uppercase bg-primary-container text-on-primary-container shadow-[0_0_24px_rgba(0,245,255,0.55)] hover:shadow-[0_0_36px_rgba(0,245,255,0.85)] hover:scale-105 active:scale-95 transition-all text-center border border-primary/40 cursor-pointer"
          >
            ▶ EXPLORAR JUEGOS
          </Link>
          <Link
            href="/auth"
            className="w-full sm:w-auto px-8 py-4 rounded font-mono font-bold text-sm tracking-widest uppercase bg-secondary-container text-on-secondary-container shadow-[0_0_24px_rgba(255,0,110,0.45)] hover:shadow-[0_0_36px_rgba(255,0,110,0.75)] hover:scale-105 active:scale-95 transition-all text-center border border-secondary/40 cursor-pointer"
          >
            ✦ CREAR CUENTA
          </Link>
        </div>

        {/* Scroll indicator */}
        <div
          className="mt-14 sm:mt-16 flex flex-col items-center gap-2 text-outline-variant font-mono text-[10px] tracking-[0.2em] uppercase select-none"
          aria-hidden="true"
        >
          <span>DESLIZA</span>
          <span className="text-primary-container text-xs animate-bounce">▼</span>
        </div>
      </div>
    </section>
  );
};
