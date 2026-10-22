import React from "react";
import { HighlightList } from "./HighlightList";

export function AboutHero() {
  return (
    <section className="max-w-[1100px] mx-auto pt-20 px-6 pb-10 text-center flex flex-col items-center">
      {/* Kicker neón */}
      <div className="font-pixel text-[11px] tracking-[0.24em] text-[var(--color-yellow,#ffd600)] mb-4.5 drop-shadow-[0_0_8px_rgba(255,214,0,0.5)] select-none">
        ▸ ACERCA DE
      </div>

      {/* Título de alto impacto */}
      <h1 className="font-pixel text-3xl sm:text-4xl md:text-5xl lg:text-[52px] tracking-[0.06em] leading-tight m-0 bg-gradient-to-b from-white via-white to-[var(--color-cyan,#00f0ff)] bg-clip-text text-transparent drop-shadow-[0_0_16px_rgba(0,240,255,0.45)]">
        ACERCA DE ARCADE VAULT
      </h1>

      {/* Párrafo de misión */}
      <p className="max-w-[720px] mx-auto mt-7 text-sm md:text-[15px] leading-relaxed text-[var(--color-ink-dim,#94a3b8)] tracking-wide">
        ARCADE VAULT nació del amor por los videojuegos clásicos. Nuestra misión es preservar y celebrar
        los arcades que definieron una generación, haciéndolos accesibles para todos, en cualquier lugar
        y sin costo.
      </p>

      {/* Tarjetas de características */}
      <HighlightList />
    </section>
  );
}
