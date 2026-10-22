import { FC } from "react";
import Link from "next/link";

export const FinalCtaSection: FC = () => {
  return (
    <section className="relative max-w-4xl mx-auto px-4 sm:px-6 py-28 text-center reveal">
      {/* Top divider line */}
      <div
        className="absolute top-8 left-1/2 -translate-x-1/2 w-3/4 max-w-md h-px bg-gradient-to-r from-transparent via-[#00f5ff]/60 to-transparent"
        aria-hidden="true"
      />

      <h2 className="font-mono text-3xl sm:text-5xl md:text-6xl font-black tracking-wider uppercase mb-8 bg-gradient-to-b from-white to-[#f5ff00] bg-clip-text text-transparent filter drop-shadow-[0_0_18px_rgba(245,255,0,0.45)]">
        ¿LISTO PARA JUGAR?
      </h2>

      <div className="flex justify-center">
        <Link
          href="/library"
          className="inline-flex items-center gap-3 px-10 py-5 rounded font-mono font-black text-base sm:text-lg tracking-[0.2em] uppercase bg-[#ff006e] text-white shadow-[0_0_30px_rgba(255,0,110,0.6)] hover:shadow-[0_0_45px_rgba(255,0,110,0.9)] hover:scale-105 active:scale-95 transition-all border border-pink-400/50 cursor-pointer"
        >
          <span>INSERTAR MONEDA</span>
          <span>→</span>
        </Link>
      </div>

      <div className="mt-8 font-mono text-xs sm:text-sm text-on-surface-variant tracking-wider uppercase">
        Gratis. Sin registro obligatorio. Empieza en segundos.
      </div>

      {/* Bottom divider line */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-3/4 max-w-md h-px bg-gradient-to-r from-transparent via-[#00f5ff]/60 to-transparent"
        aria-hidden="true"
      />
    </section>
  );
};
