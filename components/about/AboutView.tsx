"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutDivider } from "@/components/about/AboutDivider";
import { ContactSection } from "@/components/about/ContactSection";
import { Footer } from "@/components/library/Footer";

export function AboutView() {
  const [credits, setCredits] = useState<number>(4);
  const [sfx, setSfx] = useState<boolean>(true);
  const [music, setMusic] = useState<boolean>(true);

  const handleInsertCredit = () => {
    setCredits((prev) => prev + 1);
  };

  return (
    <div className="relative min-h-screen bg-surface font-body-md text-body-md text-on-surface overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container flex flex-col">
      {/* Retícula ambiental retro de fondo */}
      <div
        className="fixed inset-0 pointer-events-none opacity-10 bg-[linear-gradient(to_right,#00f5ff_1px,transparent_1px),linear-gradient(to_bottom,#00f5ff_1px,transparent_1px)] bg-[size:4rem_4rem] z-0"
        aria-hidden="true"
      />

      {/* Global Navbar */}
      <Navbar
        credits={credits}
        sfx={sfx}
        music={music}
        onToggleSfx={() => setSfx((prev) => !prev)}
        onToggleMusic={() => setMusic((prev) => !prev)}
        onInsertCredit={handleInsertCredit}
      />

      {/* Contenido Principal con espaciado para compensar el Navbar fijo */}
      <main className="relative z-10 flex-1 pt-24 pb-12 w-full">
        {/* Sub-HUD Status Bar */}
        <div className="max-w-[1200px] mx-auto px-6 mb-6">
          <div className="w-full py-2 flex flex-wrap items-center justify-between gap-2 text-on-surface-variant font-label-sm text-xs uppercase tracking-wider border-b border-outline-variant/30">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-ping" />
              <span className="text-primary-container font-pixel text-[9px] tracking-widest">
                [MANIFIESTO &amp; CANAL DE CONTACTO]
              </span>
              <span className="hidden sm:inline text-outline-variant">{"//"}</span>
              <span className="hidden sm:inline font-mono text-[11px]">
                NODO CENTRAL VAULT: ESTADO ACTIVO
              </span>
            </div>
            <div className="font-pixel text-[9px] text-[var(--color-yellow,#ffd600)] tracking-widest">
              CANAL DE COMUNICACIÓN ENCRIPTADO
            </div>
          </div>
        </div>

        {/* Hero & Misión */}
        <AboutHero />

        {/* Divisor ornamental pixel neón */}
        <AboutDivider />

        {/* Sección de Contacto y Terminal VAULT-OS */}
        <ContactSection />
      </main>

      {/* Footer Global */}
      <Footer />
    </div>
  );
}
