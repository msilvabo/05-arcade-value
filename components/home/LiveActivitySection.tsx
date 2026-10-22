import { FC } from "react";
import Link from "next/link";
import { LIVE_SCORES_FEED, DAILY_TOP_PLAYERS } from "@/data/activity";
import { NeonColor } from "@/types/activity";

const getTagColorClass = (color: NeonColor) => {
  switch (color) {
    case "magenta":
      return "text-[#ff006e] drop-shadow-[0_0_6px_rgba(255,0,110,0.6)]";
    case "yellow":
      return "text-[#f5ff00] drop-shadow-[0_0_6px_rgba(245,255,0,0.6)]";
    case "green":
      return "text-[#00ff88] drop-shadow-[0_0_6px_rgba(0,255,136,0.6)]";
    case "cyan":
    default:
      return "text-[#00f5ff] drop-shadow-[0_0_6px_rgba(0,245,255,0.6)]";
  }
};

export const LiveActivitySection: FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 reveal">
      {/* Section Head */}
      <div className="flex items-center gap-4 mb-10">
        <div className="font-mono text-xs tracking-[0.22em] text-[#f5ff00] font-bold">
          {"//"} 03
        </div>
        <h2 className="font-mono text-xl sm:text-2xl md:text-3xl tracking-wider text-white font-black uppercase">
          ACTIVIDAD EN VIVO
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-outline-variant/60 to-transparent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Ticker de Últimas Puntuaciones (7 cols) */}
        <div className="lg:col-span-7 rounded bg-surface-container border border-outline-variant/30 flex flex-col overflow-hidden shadow-lg">
          {/* Card Head */}
          <div className="flex items-center justify-between p-4 border-b border-outline-variant/30 bg-surface-container-high/50">
            <div className="font-mono text-xs text-[#00f5ff] font-bold tracking-wider drop-shadow-[0_0_8px_rgba(0,245,255,0.5)]">
              ▸ ÚLTIMAS PUNTUACIONES
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#00ff88]/10 border border-[#00ff88]/30 font-mono text-[10px] text-[#00ff88] tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
              <span>FEED EN TIEMPO REAL</span>
            </div>
          </div>

          {/* Ticker Rows */}
          <div className="flex flex-col divide-y divide-outline-variant/20 p-2">
            {LIVE_SCORES_FEED.map((item, idx) => (
              <div
                key={item.id}
                style={{ animationDelay: `${idx * 60}ms` }}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center p-3 hover:bg-surface-container-high/30 transition-colors font-mono text-xs"
              >
                {/* GamerTag */}
                <div className="sm:col-span-4 flex items-center gap-1.5 font-bold">
                  <span className={getTagColorClass(item.color)}>
                    {item.gamerTag}
                  </span>
                </div>

                {/* Game Title */}
                <div className="sm:col-span-4 text-on-surface-variant truncate">
                  ▸ {item.gameTitle}
                </div>

                {/* Score */}
                <div className="sm:col-span-2 text-right font-bold text-[#f5ff00] drop-shadow-[0_0_6px_rgba(245,255,0,0.4)]">
                  +{item.score.toLocaleString("es-ES")}
                </div>

                {/* Time Ago */}
                <div className="sm:col-span-2 text-right text-outline text-[11px] tracking-wider">
                  {item.timeAgo}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Jugadores Hoy (5 cols) */}
        <div className="lg:col-span-5 rounded bg-surface-container border border-outline-variant/30 flex flex-col overflow-hidden shadow-lg">
          {/* Card Head */}
          <div className="flex items-center justify-between p-4 border-b border-outline-variant/30 bg-surface-container-high/50">
            <div className="font-mono text-xs text-[#ff006e] font-bold tracking-wider drop-shadow-[0_0_8px_rgba(255,0,110,0.5)]">
              ▸ TOP JUGADORES · HOY
            </div>
            <Link
              href="/leaderboard"
              className="px-2.5 py-1 rounded font-mono text-[10px] tracking-wider uppercase border border-outline-variant/40 text-on-surface-variant hover:text-[#ff006e] hover:border-[#ff006e] transition-colors"
            >
              VER SALÓN →
            </Link>
          </div>

          {/* Top List */}
          <div className="flex flex-col gap-3 p-4">
            {DAILY_TOP_PLAYERS.map((player) => {
              const isTop1 = player.rank === 1;
              const isTop2 = player.rank === 2;
              const isTop3 = player.rank === 3;

              let rankBadgeClass = "text-on-surface-variant";
              let scoreColorClass = "text-[#00f5ff]";
              let barBg = "from-[#00f5ff]/10 to-transparent";

              if (isTop1) {
                rankBadgeClass = "text-[#ffcf3a] font-bold";
                scoreColorClass = "text-[#ffcf3a] drop-shadow-[0_0_6px_rgba(255,207,58,0.6)]";
                barBg = "from-[#ffcf3a]/20 to-transparent";
              } else if (isTop2) {
                rankBadgeClass = "text-[#c7d0e0] font-bold";
                scoreColorClass = "text-[#c7d0e0]";
                barBg = "from-[#c7d0e0]/15 to-transparent";
              } else if (isTop3) {
                rankBadgeClass = "text-[#d97a3a] font-bold";
                scoreColorClass = "text-[#d97a3a]";
                barBg = "from-[#d97a3a]/15 to-transparent";
              }

              return (
                <div
                  key={player.rank}
                  className="relative flex items-center justify-between p-3 rounded overflow-hidden border border-outline-variant/20 bg-surface-container-low"
                >
                  {/* Background progress fill bar */}
                  <div
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${barBg} pointer-events-none transition-all duration-500`}
                    style={{ width: `${player.percentage}%` }}
                  />

                  <div className="relative z-10 flex items-center gap-3 font-mono">
                    <span className={`text-xs font-mono ${rankBadgeClass}`}>
                      #{String(player.rank).padStart(2, "0")}
                    </span>
                    <span className="text-xs font-bold text-white tracking-wider">
                      {player.gamerTag}
                    </span>
                  </div>

                  <div className={`relative z-10 font-mono text-xs font-bold tracking-wider ${scoreColorClass}`}>
                    {player.score.toLocaleString("es-ES")} PTS
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
