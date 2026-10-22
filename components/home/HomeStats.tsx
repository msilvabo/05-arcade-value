import { FC } from "react";
import { HOME_STATS } from "@/data/activity";

export const HomeStats: FC = () => {
  return (
    <section className="relative w-full bg-gradient-to-b from-[#06060a] to-[#0c0c14] border-y border-outline-variant/30 py-16 px-4 sm:px-6 overflow-hidden reveal">
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_center,rgba(245,255,0,0.12),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-outline-variant/30">
        {HOME_STATS.map((stat, idx) => (
          <div
            key={idx}
            style={{ transitionDelay: `${idx * 90}ms` }}
            className="flex flex-col items-center justify-center text-center p-6 sm:p-8"
          >
            <div className="font-mono font-black text-4xl sm:text-5xl lg:text-6xl text-[#f5ff00] drop-shadow-[0_0_16px_rgba(245,255,0,0.45)] tracking-wider">
              {stat.number}
            </div>
            <div className="font-mono text-sm sm:text-base font-bold text-white tracking-[0.18em] uppercase mt-3">
              {stat.unit}
            </div>
            <div className="font-mono text-xs text-on-surface-variant tracking-[0.16em] uppercase mt-1">
              {stat.subtitle}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
