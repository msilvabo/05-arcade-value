import { FC } from "react";
import Link from "next/link";
import { FAQS_LIST } from "@/data/activity";

export const PricingSection: FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 reveal">
      {/* Section Head */}
      <div className="flex items-center gap-4 mb-10">
        <div className="font-mono text-xs tracking-[0.22em] text-[#00ff88] font-bold">
          {"//"} 04
        </div>
        <h2 className="font-mono text-xl sm:text-2xl md:text-3xl tracking-wider text-white font-black uppercase">
          PRECIOS
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-outline-variant/60 to-transparent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Plan Único Card (6 cols) */}
        <div className="lg:col-span-6 relative rounded p-8 sm:p-10 bg-gradient-to-b from-surface-container to-[#0a0e16] border border-[#00ff88] shadow-[0_0_36px_rgba(0,255,136,0.18)] flex flex-col gap-5 overflow-hidden">
          {/* Inner dashed retro border */}
          <div
            className="absolute inset-1.5 border border-dashed border-[#00ff88]/30 rounded pointer-events-none"
            aria-hidden="true"
          />

          {/* Stamp Badge */}
          <div className="absolute top-6 right-6 border-2 border-[#00ff88] px-3 py-1 text-center font-mono font-bold text-xs text-[#00ff88] tracking-widest uppercase rotate-6 shadow-[0_0_12px_rgba(0,255,136,0.4)] bg-surface-container-lowest/80">
            FREE<br />PLAY
          </div>

          <div className="font-mono text-xs tracking-[0.22em] text-on-surface-variant uppercase font-bold">
            PLAN ÚNICO // INVITADO & MIEMBRO
          </div>

          <h3 className="font-mono text-xl sm:text-2xl text-[#00ff88] font-black tracking-wider uppercase drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]">
            JUGADOR VAULT
          </h3>

          <div className="flex items-baseline gap-3 my-2">
            <span className="font-mono font-black text-6xl sm:text-7xl bg-gradient-to-b from-white to-[#00ff88] bg-clip-text text-transparent drop-shadow-[0_0_14px_rgba(0,255,136,0.5)]">
              $0
            </span>
            <span className="font-mono text-xs sm:text-sm text-on-surface-variant tracking-widest uppercase font-bold">
              / SIEMPRE
            </span>
          </div>

          <div className="font-mono text-xs tracking-wider text-[#f5ff00] font-bold drop-shadow-[0_0_6px_rgba(245,255,0,0.4)]">
            SIN TRUCOS · SIN LETRA PEQUEÑA
          </div>

          <ul className="flex flex-col gap-3 font-mono text-xs sm:text-sm text-on-surface my-2">
            <li className="flex items-center gap-2">
              <span className="text-[#00ff88] font-bold">✔</span>
              <span>Acceso ilimitado a todos los juegos</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#00ff88] font-bold">✔</span>
              <span>Ranking global y Salón de la Fama</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#00ff88] font-bold">✔</span>
              <span>Sin anuncios molestos entre partidas</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#00ff88] font-bold">✔</span>
              <span>Guarda tus marcas y récords personales</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#00ff88] font-bold">✔</span>
              <span>Nuevos lanzamientos cada mes</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#00ff88] font-bold">✔</span>
              <span>100% web — funciona en cualquier dispositivo</span>
            </li>
          </ul>

          <Link
            href="/auth"
            className="w-full text-center py-4 rounded font-mono font-bold text-sm tracking-widest uppercase bg-gradient-to-r from-[#00ff88] to-[#00f5ff] text-surface-container-lowest font-black shadow-[0_0_24px_rgba(0,255,136,0.5)] hover:shadow-[0_0_36px_rgba(0,255,136,0.8)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer mt-2"
          >
            EMPEZAR GRATIS →
          </Link>

          <div className="text-center font-mono text-[11px] text-on-surface-variant tracking-wider">
            No solicitamos tarjeta de crédito ni medios de pago.
          </div>
        </div>

        {/* FAQ List (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="font-mono text-sm tracking-wider uppercase text-[#00f5ff] font-bold drop-shadow-[0_0_8px_rgba(0,245,255,0.4)] mb-2">
            PREGUNTAS FRECUENTES
          </div>

          {FAQS_LIST.map((faq) => (
            <div
              key={faq.id}
              className="p-6 rounded bg-surface-container border border-outline-variant/30 flex flex-col gap-3"
            >
              <div className="font-mono text-xs sm:text-sm font-bold tracking-wider text-white uppercase flex items-center gap-2">
                <span className="text-[#f5ff00]">▸</span>
                <span>{faq.question}</span>
              </div>
              <p className="text-on-surface-variant text-sm leading-relaxed pl-4 border-l-2 border-outline-variant/30">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
