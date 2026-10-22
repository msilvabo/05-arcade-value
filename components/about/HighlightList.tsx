import React from "react";
import type { HighlightCardItem } from "@/types/contact";

function HighlightIcon({ kind }: { kind: "HEART" | "BROWSER" | "PLANT" }) {
  const c = "currentColor";
  if (kind === "HEART") {
    return (
      <svg
        className="w-9 h-9 shrink-0 drop-shadow-[0_0_6px_currentColor] [image-rendering:pixelated]"
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <g fill={c}>
          <rect x="2" y="3" width="4" height="2" />
          <rect x="10" y="3" width="4" height="2" />
          <rect x="1" y="4" width="2" height="4" />
          <rect x="13" y="4" width="2" height="4" />
          <rect x="2" y="8" width="2" height="2" />
          <rect x="12" y="8" width="2" height="2" />
          <rect x="3" y="9" width="10" height="2" />
          <rect x="4" y="11" width="8" height="2" />
          <rect x="5" y="12" width="6" height="2" />
          <rect x="6" y="13" width="4" height="1" />
          <rect x="7" y="14" width="2" height="1" />
        </g>
      </svg>
    );
  }

  if (kind === "BROWSER") {
    return (
      <svg
        className="w-9 h-9 shrink-0 drop-shadow-[0_0_6px_currentColor] [image-rendering:pixelated]"
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <g fill={c}>
          <rect x="1" y="2" width="14" height="12" fill="none" stroke={c} strokeWidth="1.4" />
          <rect x="1" y="2" width="14" height="3" />
          <rect x="3" y="3" width="1" height="1" fill="#0a0a0f" />
          <rect x="5" y="3" width="1" height="1" fill="#0a0a0f" />
          <rect x="7" y="3" width="1" height="1" fill="#0a0a0f" />
          <rect x="3" y="7" width="4" height="1" />
          <rect x="3" y="9" width="6" height="1" />
          <rect x="3" y="11" width="3" height="1" />
        </g>
      </svg>
    );
  }

  return (
    <svg
      className="w-9 h-9 shrink-0 drop-shadow-[0_0_6px_currentColor] [image-rendering:pixelated]"
      viewBox="0 0 16 16"
      aria-hidden="true"
    >
      <g fill={c}>
        <rect x="7" y="2" width="2" height="10" />
        <rect x="4" y="4" width="3" height="2" />
        <rect x="9" y="6" width="3" height="2" />
        <rect x="3" y="3" width="2" height="2" />
        <rect x="11" y="5" width="2" height="2" />
        <rect x="3" y="12" width="10" height="2" />
        <rect x="4" y="14" width="8" height="1" />
      </g>
    </svg>
  );
}

const HIGHLIGHTS: HighlightCardItem[] = [
  { icon: "HEART", text: "HECHO CON ❤️ PARA JUGADORES", color: "magenta" },
  { icon: "BROWSER", text: "JUEGOS EN HTML — CORREN EN CUALQUIER NAVEGADOR", color: "cyan" },
  { icon: "PLANT", text: "PROYECTO EN CONSTANTE CRECIMIENTO", color: "green" },
];

export function HighlightList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 mt-13 w-full">
      {HIGHLIGHTS.map((item, idx) => {
        const colorClasses =
          item.color === "magenta"
            ? "text-[var(--color-magenta)] hover:border-[var(--color-magenta)] hover:shadow-[0_12px_28px_-14px_rgba(255,0,127,0.5)]"
            : item.color === "cyan"
            ? "text-[var(--color-cyan)] hover:border-[var(--color-cyan)] hover:shadow-[0_12px_28px_-14px_rgba(0,240,255,0.5)]"
            : "text-[var(--color-green)] hover:border-[var(--color-green)] hover:shadow-[0_12px_28px_-14px_rgba(0,255,102,0.5)]";

        return (
          <div
            key={idx}
            className={`flex items-center gap-4 p-5 bg-[var(--color-bg-2,#10111a)] border border-[var(--color-line,#1e2235)] transition-all duration-200 hover:-translate-y-1 text-left ${colorClasses}`}
          >
            <HighlightIcon kind={item.icon} />
            <div className="font-pixel text-[10px] tracking-widest leading-relaxed text-[var(--color-ink,#f8fafc)] select-none">
              {item.text}
            </div>
          </div>
        );
      })}
    </div>
  );
}
