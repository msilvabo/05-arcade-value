"use client";

import { FC, useState } from "react";
import { ArcadeIcon } from "@/components/ui/ArcadeIcon";

interface CrtDockProps {
  onToggleCrt?: () => void;
}

export const CrtDock: FC<CrtDockProps> = ({ onToggleCrt }) => {
  const [feedback, setFeedback] = useState<string | null>(null);

  const showTemporaryFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2500);
  };

  return (
    <aside className="w-full bg-surface-container-low border-t border-outline-variant/30 px-space-md lg:px-margin py-space-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md">
          <ArcadeIcon name="tune" className="text-primary-container w-7 h-7" />
          <div>
            <p className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-bold">
              CONFIGURACIÓN RÁPIDA DE EMULACIÓN CRT
            </p>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
              FILTRO DE FÓSFORO VERDE / CURVATURA SCANLINE / LATENCIA 0 MS
            </p>
            {feedback && (
              <p className="font-label-sm text-label-sm text-tertiary-fixed tracking-wider uppercase animate-pulse mt-0.5">
                {feedback}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-space-sm shrink-0">
          <button
            className="px-space-md py-1 bg-surface-container hover:bg-surface-bright text-on-surface font-label-sm text-label-sm uppercase tracking-wider rounded transition-colors cursor-pointer"
            type="button"
            onClick={() => {
              if (onToggleCrt) onToggleCrt();
              showTemporaryFeedback("[ OK: CURVATURA Y REAJUSTE DE PANTALLA APLICADO ]");
            }}
          >
            REAJUSTAR PANTALLA
          </button>
          <button
            className="px-space-md py-1 bg-secondary-container hover:bg-secondary-container/90 text-on-secondary font-label-sm text-label-sm uppercase tracking-wider rounded transition-all shadow-[0_0_10px_rgba(255,77,128,0.5)] cursor-pointer"
            type="button"
            onClick={() => {
              showTemporaryFeedback("[ MODO COMPETITIVO: MÍNIMA LATENCIA ACTIVADA ]");
            }}
          >
            MODO COMPETITIVO
          </button>
        </div>
      </div>
    </aside>
  );
};
