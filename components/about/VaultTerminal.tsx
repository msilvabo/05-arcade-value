"use client";

import React, { useEffect, useState } from "react";

interface VaultTerminalProps {
  status: "loading" | "success" | "error";
  senderName: string;
  errorMessage?: string;
  onReset: () => void;
  onRetry: () => void;
}

export function VaultTerminal({
  status,
  senderName,
  errorMessage,
  onReset,
  onRetry,
}: VaultTerminalProps) {
  const [loadingStep, setLoadingStep] = useState(1);

  useEffect(() => {
    if (status !== "loading") return;

    const timer1 = setTimeout(() => setLoadingStep(2), 250);
    const timer2 = setTimeout(() => setLoadingStep(3), 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [status]);

  const step = status === "loading" ? loadingStep : 3;

  const displayName = senderName.trim().toUpperCase() || "JUGADOR";

  return (
    <div
      className={`bg-black border font-mono rounded-xs overflow-hidden transition-all duration-300 ${
        status === "error"
          ? "border-[var(--color-magenta,#ff007f)] shadow-[0_0_24px_rgba(255,0,127,0.35)]"
          : "border-[var(--color-green,#00ff66)] shadow-[0_0_24px_rgba(0,255,102,0.3)]"
      }`}
    >
      {/* Barra superior de terminal estilo macOS / Unix */}
      <div className="flex items-center gap-2 px-3.5 py-2.5 bg-[#0a0a0f] border-b border-[var(--color-line,#1e2235)]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block" />
        <span className="ml-2 font-pixel text-[9px] text-[var(--color-ink-faint,#64748b)] tracking-widest select-none">
          VAULT-OS // TERMINAL
        </span>
      </div>

      {/* Cuerpo de la terminal con mensajes secuenciales */}
      <div className="p-5 md:p-6 text-[13px] leading-relaxed space-y-2 text-left">
        <div className="flex items-center flex-wrap">
          <span className="text-[var(--color-cyan,#00f0ff)] mr-2 font-bold select-none">
            vault@arcade:~$
          </span>
          <span className="text-white">./send_message --to=team</span>
        </div>

        {step >= 1 && (
          <div className="text-[var(--color-ink-dim,#94a3b8)]">
            <span className="text-[var(--color-cyan,#00f0ff)]">[OK]</span> Conectando con servidor…
          </div>
        )}

        {step >= 2 && (
          <div className="text-[var(--color-ink-dim,#94a3b8)]">
            <span className="text-[var(--color-cyan,#00f0ff)]">[OK]</span> Validando contenido y filtros…
          </div>
        )}

        {step >= 3 && status === "loading" && (
          <div className="text-[var(--color-yellow,#ffd600)] flex items-center gap-2">
            <span>[ENVIANDO]</span> Transmitiendo paquete de datos…
            <span className="inline-block w-2 h-3.5 bg-[var(--color-yellow,#ffd600)] animate-pulse" />
          </div>
        )}

        {status === "success" && (
          <>
            <div className="text-[var(--color-ink-dim,#94a3b8)]">
              <span className="text-[var(--color-cyan,#00f0ff)]">[OK]</span> Transmisión completada.
            </div>
            <div className="mt-3 text-[var(--color-green,#00ff66)] font-bold text-sm tracking-wide drop-shadow-[0_0_8px_rgba(0,255,102,0.5)]">
              &gt; MENSAJE RECIBIDO. TE RESPONDEREMOS PRONTO. GRACIAS, {displayName}.
              <span className="inline-block w-2 h-3.5 bg-[var(--color-green,#00ff66)] ml-1 animate-pulse align-middle" />
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={onReset}
                className="font-pixel text-[10px] tracking-widest px-4 py-2 border border-[var(--color-green,#00ff66)] text-[var(--color-green,#00ff66)] hover:bg-[var(--color-green,#00ff66)] hover:text-black transition-colors duration-150 cursor-pointer"
              >
                ENVIAR OTRO MENSAJE
              </button>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mt-3 text-[var(--color-magenta,#ff007f)] font-bold text-sm tracking-wide drop-shadow-[0_0_8px_rgba(255,0,127,0.5)]">
              [FAIL] TRANSMISIÓN FALLIDA: {errorMessage || "No se pudo entregar el paquete."}
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={onRetry}
                className="font-pixel text-[10px] tracking-widest px-4 py-2 bg-[var(--color-magenta,#ff007f)] text-white hover:bg-white hover:text-black transition-colors duration-150 cursor-pointer shadow-[0_0_12px_rgba(255,0,127,0.5)]"
              >
                MODIFICAR / REINTENTAR
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
