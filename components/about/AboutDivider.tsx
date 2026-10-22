import React from "react";

export function AboutDivider() {
  return (
    <div
      className="max-w-[1200px] mx-auto my-14 px-6 flex items-center gap-4 select-none"
      aria-hidden="true"
    >
      {/* Barra izquierda con gradiente neón */}
      <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-magenta,#ff007f)] to-transparent opacity-80" />

      {/* Bloques de pixeles parpadeantes */}
      <div className="flex gap-1 items-center">
        {Array.from({ length: 24 }).map((_, i) => {
          let bgClass = "bg-[var(--color-cyan,#00f0ff)] shadow-[0_0_6px_var(--color-cyan,#00f0ff)]";
          if (i % 3 === 0) {
            bgClass = "bg-[var(--color-magenta,#ff007f)] shadow-[0_0_6px_var(--color-magenta,#ff007f)]";
          } else if (i % 5 === 0) {
            bgClass = "bg-[var(--color-yellow,#ffd600)] shadow-[0_0_6px_var(--color-yellow,#ffd600)]";
          }

          return (
            <span
              key={i}
              className={`w-1.5 h-1.5 inline-block animate-pulse ${bgClass}`}
              style={{ animationDelay: `${(i % 12) * 100}ms` }}
            />
          );
        })}
      </div>

      {/* Barra derecha con gradiente neón */}
      <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-magenta,#ff007f)] to-transparent opacity-80" />
    </div>
  );
}
