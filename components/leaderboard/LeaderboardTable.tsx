"use client";

import { FC, useState, useMemo } from "react";
import { LeaderboardEntry, LeaderboardPeriod } from "@/types/leaderboard";
import { Game } from "@/types/game";

const ICON_MAP: Record<string, string> = {
  arkanoid: "sports_baseball",
  tetris: "grid_view",
  "space-invaders": "rocket_launch",
  pacman: "motion_photos_on",
  snake: "gesture",
  asteroids: "change_history",
};

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  selectedGame: string;
  onSelectGame: (gameId: string) => void;
  games?: Game[];
  isLoading?: boolean;
}

export const LeaderboardTable: FC<LeaderboardTableProps> = ({
  entries,
  selectedGame,
  onSelectGame,
  games,
  isLoading = false,
}) => {
  const [period, setPeriod] = useState<LeaderboardPeriod>("all-time");
  const [searchQuery, setSearchQuery] = useState("");

  const gamesList = useMemo(() => {
    if (games && games.length > 0) {
      return games.map((game) => ({
        id: game.id,
        name: game.title.split(":")[0].replace(/^(CYBER|CHRONO|SPACE)\s+/, ""),
        icon: ICON_MAP[game.artType] || "videogame_asset",
        record: game.record?.score?.replace(" PTS", "") || "---",
      }));
    }

    return [
      {
        id: "arkanoid-neon-revenge",
        name: "ARKANOID",
        icon: "sports_baseball",
        record: "984.520",
      },
      {
        id: "cyber-tetris-99",
        name: "TETRIS",
        icon: "grid_view",
        record: "842.100",
      },
      {
        id: "space-invaders-galaxy",
        name: "INVADERS",
        icon: "rocket_launch",
        record: "620.000",
      },
      {
        id: "pacman-neon-maze",
        name: "PAC-MAN",
        icon: "motion_photos_on",
        record: "3.333.360",
      },
      { id: "chrono-snake", name: "SNAKE", icon: "gesture", record: "450.800" },
      {
        id: "asteroids-2084",
        name: "ASTEROIDS",
        icon: "change_history",
        record: "510.900",
      },
    ];
  }, [games]);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch = entry.gamerTag
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [entries, searchQuery]);

  return (
    <div className="w-full flex flex-col gap-space-lg">
      {/* Selector de Período y Cartuchos */}
      <div className="w-full flex flex-col gap-space-md">
        {/* Intervalo de auditoría */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-space-md bg-surface-container-low p-space-sm rounded border border-outline-variant/30">
          <div className="flex items-center gap-space-xs font-label-md text-label-md uppercase text-on-surface-variant">
            <span className="material-symbols-outlined text-primary-fixed text-[18px]">
              tune
            </span>
            <span className="text-primary-fixed font-bold">
              INTERVALO DE AUDITORÍA:
            </span>
          </div>
          <div className="flex items-center gap-space-xs bg-surface-container-lowest p-1 rounded">
            <button
              type="button"
              onClick={() => setPeriod("all-time")}
              className={`px-space-md py-space-xs rounded font-label-sm text-label-sm uppercase tracking-wider transition-all cursor-pointer ${
                period === "all-time"
                  ? "bg-primary-container text-on-primary font-bold shadow-[0_0_12px_rgba(0,245,255,0.7)]"
                  : "bg-surface-container text-on-surface-variant hover:text-on-surface"
              }`}
            >
              GLOBAL HISTÓRICO
            </button>
            <button
              type="button"
              onClick={() => setPeriod("monthly")}
              className={`px-space-md py-space-xs rounded font-label-sm text-label-sm uppercase tracking-wider transition-all cursor-pointer ${
                period === "monthly"
                  ? "bg-primary-container text-on-primary font-bold shadow-[0_0_12px_rgba(0,245,255,0.7)]"
                  : "bg-surface-container text-on-surface-variant hover:text-on-surface"
              }`}
            >
              TEMPORADA ACTUAL (OCTUBRE)
            </button>
            <button
              type="button"
              onClick={() => setPeriod("weekly")}
              className={`px-space-md py-space-xs rounded font-label-sm text-label-sm uppercase tracking-wider transition-all cursor-pointer ${
                period === "weekly"
                  ? "bg-primary-container text-on-primary font-bold shadow-[0_0_12px_rgba(0,245,255,0.7)]"
                  : "bg-surface-container text-on-surface-variant hover:text-on-surface"
              }`}
            >
              HOY
            </button>
          </div>
        </div>

        {/* Cartuchos Arcade Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-space-sm">
          {gamesList.map((game, idx) => {
            const isSelected =
              selectedGame === game.id ||
              selectedGame.startsWith(game.id) ||
              game.id.startsWith(selectedGame);

            return (
              <button
                key={game.id}
                type="button"
                onClick={() => onSelectGame(game.id)}
                className={`group relative flex flex-col p-space-sm rounded text-left transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-surface-container-high border-primary-container shadow-[0_0_20px_rgba(0,245,255,0.4)] -translate-y-1"
                    : "bg-surface-container-low border-outline-variant/30 hover:bg-surface-container hover:-translate-y-0.5"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-space-xs">
                  <span
                    className={`font-label-sm text-label-sm uppercase font-bold tracking-widest ${
                      isSelected ? "text-primary-fixed" : "text-outline"
                    }`}
                  >
                    {isSelected ? "[ACTIVO]" : `CART-0${idx + 1}`}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSelected
                        ? "bg-primary-fixed shadow-[0_0_8px_rgba(0,245,255,1)]"
                        : "bg-outline-variant"
                    }`}
                  />
                </div>
                <div
                  className={`flex items-center gap-space-xs my-space-xs ${
                    isSelected ? "text-primary-fixed" : "text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {game.icon}
                  </span>
                  <span className="font-headline-md text-headline-md font-bold uppercase tracking-wider">
                    {game.name}
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  RÉCORD: {game.record}
                </span>
                <div
                  className={`mt-space-sm w-full h-1 rounded ${
                    isSelected
                      ? "bg-primary-fixed shadow-[0_0_6px_rgba(0,245,255,0.9)]"
                      : "bg-surface-container-highest"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabla Completa Top 10 */}
      <div className="bg-surface-container-low rounded-lg p-space-md border border-outline-variant/30 shadow-[0_0_20px_rgba(0,0,0,0.5)] relative">
        {isLoading && (
          <div className="absolute inset-0 bg-surface/60 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-lg">
            <span className="font-headline-sm text-headline-sm text-primary animate-pulse tracking-widest uppercase">
              SINCRONIZANDO TELEMETRÍA...
            </span>
          </div>
        )}

        {/* Cabecera y Buscador */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md mb-space-md pb-space-sm border-b border-outline-variant/30">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[24px]">
              leaderboard
            </span>
            <h2 className="font-headline-md text-headline-md uppercase text-on-surface tracking-wider">
              CLASIFICACIÓN // {filteredEntries.length} PILOTOS REGISTRADOS
            </h2>
          </div>

          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="FILTRAR GAMERTAG..."
              className="w-full bg-surface-container-lowest text-primary text-body-sm py-1.5 pl-8 pr-3 rounded border border-outline-variant/50 focus:border-primary-container outline-none placeholder:text-outline"
            />
          </div>
        </div>

        {/* Tabla Responsiva */}
        <div className="overflow-x-auto">
          {filteredEntries.length === 0 ? (
            <div className="py-space-xl text-center text-outline font-label-md text-label-md uppercase tracking-wider">
              NO SE ENCONTRARON PUNTUACIONES REGISTRADAS PARA ESTE CRITERIO
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/40 text-outline font-label-sm text-label-sm uppercase tracking-wider">
                  <th className="py-space-sm px-space-md">RANGO</th>
                  <th className="py-space-sm px-space-md">
                    PILOTO // GAMERTAG
                  </th>
                  <th className="py-space-sm px-space-md text-right">
                    PUNTUACIÓN
                  </th>
                  <th className="py-space-sm px-space-md text-center">
                    PRECISIÓN
                  </th>
                  <th className="py-space-sm px-space-md text-center">COMBO</th>
                  <th className="py-space-sm px-space-md text-right hidden sm:table-cell">
                    FECHA
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-body-md text-body-md">
                {filteredEntries.map((entry) => {
                  const isChampion = entry.rank === 1;
                  const isTop3 = entry.rank <= 3;
                  return (
                    <tr
                      key={`${entry.gameId}-${entry.gamerTag}-${entry.rank}`}
                      className={`transition-colors hover:bg-surface-container group ${
                        isChampion
                          ? "bg-primary-container/10 font-bold"
                          : isTop3
                            ? "bg-surface-container-high/40"
                            : ""
                      }`}
                    >
                      {/* Rango */}
                      <td className="py-space-sm px-space-md whitespace-nowrap">
                        <div className="flex items-center gap-space-xs">
                          <span
                            className={`w-7 h-7 rounded flex items-center justify-center font-label-md text-label-md font-bold ${
                              entry.rank === 1
                                ? "bg-tertiary-container text-on-tertiary shadow-[0_0_8px_rgba(222,231,0,0.8)]"
                                : entry.rank === 2
                                  ? "bg-secondary-fixed text-on-secondary-fixed shadow-[0_0_8px_rgba(255,178,191,0.5)]"
                                  : entry.rank === 3
                                    ? "bg-tertiary text-on-tertiary"
                                    : "bg-surface-container-highest text-outline"
                            }`}
                          >
                            {entry.rank < 10 ? `0${entry.rank}` : entry.rank}
                          </span>
                          {isChampion && (
                            <span className="material-symbols-outlined text-tertiary-fixed text-[18px]">
                              crown
                            </span>
                          )}
                        </div>
                      </td>

                      {/* GamerTag & Insignia */}
                      <td className="py-space-sm px-space-md whitespace-nowrap">
                        <div className="flex items-center gap-space-sm">
                          <span
                            className={`font-title-sm text-title-sm font-bold uppercase tracking-wider transition-colors ${
                              isChampion
                                ? "text-tertiary-fixed group-hover:text-primary"
                                : isTop3
                                  ? "text-primary-fixed group-hover:text-primary"
                                  : "text-on-surface group-hover:text-primary"
                            }`}
                          >
                            {entry.gamerTag}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-label-sm uppercase tracking-wider ${
                              entry.badge === "CHAMPION"
                                ? "bg-tertiary-container/30 text-tertiary-fixed border border-tertiary-container"
                                : entry.badge === "MASTER"
                                  ? "bg-secondary-container/30 text-secondary-container border border-secondary-container"
                                  : entry.badge === "VETERAN"
                                    ? "bg-primary-container/30 text-primary-fixed border border-primary-container"
                                    : "bg-surface-container-highest text-outline"
                            }`}
                          >
                            {entry.badge}
                          </span>
                        </div>
                      </td>

                      {/* Puntuación */}
                      <td className="py-space-sm px-space-md text-right font-title-sm text-title-sm text-primary font-bold tracking-wider whitespace-nowrap drop-shadow-[0_0_4px_rgba(0,245,255,0.4)]">
                        {entry.formattedScore}
                      </td>

                      {/* Precisión */}
                      <td className="py-space-sm px-space-md text-center text-primary-fixed whitespace-nowrap">
                        {entry.accuracy}
                      </td>

                      {/* Combo */}
                      <td className="py-space-sm px-space-md text-center text-secondary-fixed whitespace-nowrap">
                        {entry.combo}
                      </td>

                      {/* Fecha */}
                      <td className="py-space-sm px-space-md text-right text-outline text-body-sm whitespace-nowrap hidden sm:table-cell">
                        {entry.date}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
