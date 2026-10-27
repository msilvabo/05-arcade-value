"use client";

import { FC, useEffect } from "react";
import { getGameVirtualControls } from "./configs";
import { VirtualActionButton } from "./VirtualActionButton";
import { VirtualDpad } from "./VirtualDpad";
import { releaseAllKeys } from "./virtualInput";

interface VirtualGamepadProps {
  gameId: string;
  orientation?: "portrait" | "landscape";
  className?: string;
}

export const VirtualGamepad: FC<VirtualGamepadProps> = ({
  gameId,
  orientation = "portrait",
  className = "",
}) => {
  const config = getGameVirtualControls(gameId);

  // Limpiar cualquier tecla retenida al desmontar el gamepad
  useEffect(() => {
    return () => {
      releaseAllKeys();
    };
  }, []);

  // MODO HORIZONTAL (Landscape): Overlay flotante en las esquinas inferiores
  if (orientation === "landscape") {
    return (
      <div
        className={`pointer-events-none fixed inset-0 z-40 overflow-hidden select-none touch-none ${className}`}
        style={{ touchAction: "none" }}
      >
        {/* Cruzeta o controles direccionales en la esquina inferior izquierda */}
        {config.dpadType !== "none" && (
          <div className="pointer-events-auto absolute bottom-4 left-4 p-2 bg-surface-container-lowest/80 backdrop-blur-md rounded-2xl border border-outline-variant/30 shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
            <VirtualDpad type={config.dpadType} />
          </div>
        )}

        {/* Botones de acción en la esquina inferior derecha */}
        {config.primaryButtons.length > 0 && (
          <div className="pointer-events-auto absolute bottom-4 right-4 p-2.5 bg-surface-container-lowest/80 backdrop-blur-md rounded-2xl border border-outline-variant/30 shadow-[0_8px_32px_rgba(0,0,0,0.8)] flex items-center gap-3">
            {config.primaryButtons.map((btn) => (
              <VirtualActionButton key={btn.id} config={btn} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // MODO VERTICAL (Portrait): Panel de control arcade tipo consola / gabinete
  return (
    <div
      className={`w-full max-w-4xl bg-surface-container-lowest/95 rounded-2xl p-4 sm:p-5 border-2 border-outline-variant/40 shadow-[0_15px_40px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.1)] select-none touch-none ${className}`}
      style={{ touchAction: "none", userSelect: "none" }}
    >
      {/* Barra decorativa superior del panel arcade */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-outline-variant/20 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_8px_rgba(0,240,255,0.8)]"></span>
          <span className="font-label-sm text-[10px] text-primary-fixed-dim tracking-[0.25em] uppercase font-bold">
            MANDO TÁCTIL ARCADE // VAULT-PAD
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-outline text-[9px] font-label-sm uppercase">
          <span className="material-symbols-outlined text-[13px] text-secondary">
            touch_app
          </span>
          <span>MULTI-TOUCH ACTIVO</span>
        </div>
      </div>

      {/* Disposición ergonómica: D-Pad a la izquierda, Botones a la derecha */}
      <div className="flex items-center justify-between gap-4 px-2 sm:px-6 py-2 min-h-[170px]">
        {/* Lado Izquierdo: D-Pad */}
        <div className="flex-1 flex items-center justify-start sm:justify-center">
          {config.dpadType !== "none" ? (
            <VirtualDpad type={config.dpadType} />
          ) : (
            <div className="text-outline text-xs italic font-label-sm">
              Control táctil directo en pantalla
            </div>
          )}
        </div>

        {/* Divisor central con remaches estéticos */}
        <div className="hidden sm:flex flex-col items-center justify-center gap-3 py-2 text-outline-variant/40">
          <span className="w-1.5 h-1.5 rounded-full bg-surface-container-high border border-outline-variant/40"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-surface-container-high border border-outline-variant/40"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-surface-container-high border border-outline-variant/40"></span>
        </div>

        {/* Lado Derecho: Botones de Acción */}
        <div className="flex-1 flex items-center justify-end sm:justify-center gap-3 sm:gap-4 flex-wrap">
          {config.primaryButtons.map((btn) => (
            <VirtualActionButton key={btn.id} config={btn} />
          ))}
        </div>
      </div>

      {/* Pie del chasis con ranura de disipación */}
      <div className="mt-2 pt-2 border-t border-outline-variant/15 flex items-center justify-center gap-2">
        <span className="w-6 h-1 rounded-full bg-surface-container-high"></span>
        <span className="w-6 h-1 rounded-full bg-surface-container-high"></span>
        <span className="w-6 h-1 rounded-full bg-surface-container-high"></span>
      </div>
    </div>
  );
};
