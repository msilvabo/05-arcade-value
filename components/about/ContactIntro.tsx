import React from "react";

export function ContactIntro() {
  return (
    <div className="flex flex-col">
      {/* Kicker neón cyan */}
      <div className="font-pixel text-[11px] tracking-[0.24em] text-[var(--color-cyan,#00f0ff)] mb-3 drop-shadow-[0_0_8px_rgba(0,240,255,0.4)] select-none">
        ▸ CONTACTO
      </div>

      {/* Título de sección */}
      <h2 className="font-pixel text-2xl sm:text-3xl lg:text-4xl tracking-wider text-[var(--color-cyan,#00f0ff)] drop-shadow-[0_0_12px_rgba(0,240,255,0.4)] m-0">
        CONTÁCTANOS
      </h2>

      {/* Descripción motivacional */}
      <p className="text-[var(--color-ink-dim,#94a3b8)] text-sm leading-relaxed my-5">
        ¿Tienes alguna sugerencia, quieres proponer un juego o simplemente saludar a la comunidad retro?
        Escríbenos y nuestro equipo te responderá cuanto antes.
      </p>

      {/* Indicadores LED retro */}
      <div className="flex flex-col gap-2.5 mt-2">
        <div className="flex items-center gap-2.5 font-pixel text-[9px] text-[var(--color-ink-dim,#94a3b8)] tracking-widest">
          <span className="w-2 h-2 rounded-full bg-[var(--color-green,#00ff66)] shadow-[0_0_8px_var(--color-green,#00ff66)] inline-block" />
          <span>RESPUESTA EN 24-48H</span>
        </div>

        <div className="flex items-center gap-2.5 font-pixel text-[9px] text-[var(--color-ink-dim,#94a3b8)] tracking-widest">
          <span className="w-2 h-2 rounded-full bg-[var(--color-yellow,#ffd600)] shadow-[0_0_8px_var(--color-yellow,#ffd600)] inline-block" />
          <span>SUGERENCIAS BIENVENIDAS</span>
        </div>

        <div className="flex items-center gap-2.5 font-pixel text-[9px] text-[var(--color-ink-dim,#94a3b8)] tracking-widest">
          <span className="w-2 h-2 rounded-full bg-[var(--color-magenta,#ff007f)] shadow-[0_0_8px_var(--color-magenta,#ff007f)] inline-block" />
          <span>SIN SPAM, JAMÁS</span>
        </div>
      </div>
    </div>
  );
}
