"use client";

import { FC, ReactNode } from "react";

interface CrtCabinetProps {
  children: ReactNode;
  scanlinesActive: boolean;
  curvatureActive: boolean;
}

export const CrtCabinet: FC<CrtCabinetProps> = ({
  children,
  scanlinesActive,
  curvatureActive,
}) => {
  return (
    <div
      className="relative w-full max-w-4xl bg-surface-container-lowest rounded-2xl sm:rounded-3xl p-2 sm:p-4 md:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.95),inset_0_0_40px_rgba(0,0,0,0.9)] border-2 sm:border-4 border-surface-container-high/60 select-none touch-none"
      style={{ touchAction: "none" }}
    >
      {/* Tornillos & Ribetes de Montaje de Gabinete */}
      <div className="absolute top-2 sm:top-3 left-3 sm:left-4 flex gap-1.5 sm:gap-2">
        <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-surface-bright shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)] border border-outline-variant"></span>
        <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-surface-container shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)]"></span>
      </div>
      <div className="absolute top-2 sm:top-3 right-3 sm:right-4 flex gap-1.5 sm:gap-2">
        <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-surface-container shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)]"></span>
        <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-surface-bright shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)] border border-outline-variant"></span>
      </div>

      <div className="text-center pb-2 px-1 overflow-hidden">
        <span className="font-label-sm text-[9px] sm:text-label-sm text-primary-fixed-dim/70 tracking-[0.15em] sm:tracking-[0.35em] uppercase font-bold truncate block">
          TAITO 1986 // MODELO CATÓDICO KX-21 // PANTALLA POLICROMÁTICA
        </span>
      </div>

      {/* Pantalla CRT Curvada */}
      <div
        className={`relative w-full aspect-[4/3] max-h-[640px] bg-surface-dim overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.95)] flex flex-col justify-between border sm:border-2 border-outline-variant/40 select-none touch-none ${
          curvatureActive ? "rounded-xl sm:rounded-3xl" : "rounded-lg"
        }`}
        style={{ touchAction: "none" }}
      >
        {/* Viñeta de curvatura y reflejo de cristal catódico */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.85)_100%)] pointer-events-none z-10"></div>
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-primary/5 to-transparent rotate-12 pointer-events-none z-10"></div>

        {/* Scanlines opcionales de cabina */}
        {scanlinesActive && (
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] pointer-events-none z-20 opacity-80"></div>
        )}

        {/* Contenido del Escenario Arkanoid */}
        <div className="relative z-0 w-full h-full flex flex-col">
          {children}
        </div>
      </div>

      {/* Marquesina Inferior: Altavoces, Telemetría y Ranura de Moneda */}
      <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 flex flex-wrap items-center justify-between gap-2 sm:gap-3 px-1 sm:px-2 border-t border-outline-variant/20">
        {/* Rejilla de Ventilación y Altavoces */}
        <div className="hidden xs:flex gap-1.5">
          <div className="w-1.5 h-5 sm:h-6 bg-surface-container-high rounded-full"></div>
          <div className="w-1.5 h-5 sm:h-6 bg-surface-container-high rounded-full"></div>
          <div className="w-1.5 h-5 sm:h-6 bg-surface-container-high rounded-full"></div>
          <div className="w-1.5 h-5 sm:h-6 bg-surface-container-high rounded-full"></div>
          <div className="w-1.5 h-5 sm:h-6 bg-surface-container-high rounded-full"></div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-label-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary-container shadow-[0_0_8px_rgba(255,77,128,0.8)]"></span>
            <span className="font-label-sm text-[10px] sm:text-label-sm text-on-surface-variant uppercase tracking-wider">
              RGB: ÓPTIMO
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-container shadow-[0_0_8px_rgba(0,245,255,0.8)]"></span>
            <span className="font-label-sm text-[10px] sm:text-label-sm text-on-surface-variant uppercase tracking-wider">
              CRT: 60 HZ
            </span>
          </div>
        </div>

        {/* Ranura de Moneda */}
        <div className="flex items-center gap-1.5 bg-surface-container-high px-2 sm:px-3 py-1 rounded border border-tertiary/20 text-[10px] sm:text-label-sm">
          <span className="material-symbols-outlined text-tertiary-fixed text-[16px]">
            paid
          </span>
          <span className="font-label-sm text-label-sm text-tertiary-fixed tracking-widest uppercase">
            RANURA 25¢ ACTIVA
          </span>
        </div>
      </div>
    </div>
  );
};
