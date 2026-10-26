"use client";

import { FC, useState, useMemo } from "react";
import { LeaderboardEntry, LeaderboardPeriod } from "@/types/leaderboard";
import { getLeaderboardCartridges } from "@/app/games/_lib/registry";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  selectedGame: string;
  onSelectGame: (gameId: string) => void;
  period?: LeaderboardPeriod;
  onSelectPeriod?: (period: LeaderboardPeriod) => void;
  isLoading?: boolean;
}

export const LeaderboardTable: FC<LeaderboardTableProps> = ({
  entries,
  selectedGame,
  onSelectGame,
  period = "all-time",
  onSelectPeriod,
  isLoading = false,
}) => {
  const [localPeriod, setLocalPeriod] = useState<LeaderboardPeriod>(period);
  const [searchQuery, setSearchQuery] = useState("");

  const currentPeriod = onSelectPeriod ? period : localPeriod;
  const handlePeriodChange = (p: LeaderboardPeriod) => {
    if (onSelectPeriod) {
      onSelectPeriod(p);
    } else {
      setLocalPeriod(p);
    }
  };

  const gamesList = useMemo(() => getLeaderboardCartridges(), []);

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
              onClick={() => handlePeriodChange("all-time")}
              className={`px-space-md py-space-xs rounded font-label-sm text-label-sm uppercase tracking-wider transition-all cursor-pointer ${
                currentPeriod === "all-time"
                  ? "bg-primary-container text-on-primary font-bold shadow-[0_0_12px_rgba(0,245,255,0.7)]"
                  : "bg-surface-container text-on-surface-variant hover:text-on-surface"
              }`}
            >
              GLOBAL HISTÓRICO
            </button>
            <button
              type="button"
              onClick={() => handlePeriodChange("monthly")}
              className={`px-space-md py-space-xs rounded font-label-sm text-label-sm uppercase tracking-wider transition-all cursor-pointer ${
                currentPeriod === "monthly"
                  ? "bg-primary-container text-on-primary font-bold shadow-[0_0_12px_rgba(0,245,255,0.7)]"
                  : "bg-surface-container text-on-surface-variant hover:text-on-surface"
              }`}
            >
              ESTE MES
            </button>
            <button
              type="button"
              onClick={() => handlePeriodChange("weekly")}
              className={`px-space-md py-space-xs rounded font-label-sm text-label-sm uppercase tracking-wider transition-all cursor-pointer ${
                currentPeriod === "weekly"
                  ? "bg-primary-container text-on-primary font-bold shadow-[0_0_12px_rgba(0,245,255,0.7)]"
                  : "bg-surface-container text-on-surface-variant hover:text-on-surface"
              }`}
            >
              ESTA SEMANA
            </button>
          </div>
        </div>

        {/* Cartuchos Arcade Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-space-sm">
          {gamesList.map((game, idx) => {
            const isSelected =
              selectedGame === game.id ||
              selectedGame
                .replace("-2084", "")
                .replace("-neon-revenge", "")
                .replace("cyber-", "")
                .replace("-99", "")
                .replace("-galaxy", "")
                .replace("-maze", "") ===
                game.id
                  .replace("-2084", "")
                  .replace("-neon-revenge", "")
                  .replace("cyber-", "")
                  .replace("-99", "")
                  .replace("-galaxy", "")
                  .replace("-maze", "");

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
              CLASIFICACIÓN COMPLETA // SUPABASE ARCHIVE
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
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/40 text-outline font-label-sm text-label-sm uppercase tracking-wider">
                <th className="py-space-sm px-space-md">RANGO</th>
                <th className="py-space-sm px-space-md">PILOTO // GAMERTAG</th>
                <th className="py-space-sm px-space-md text-right">
                  PUNTUACIÓN
                </th>
                <th className="py-space-sm px-space-md text-center">
                  PRECISIÓN
                </th>
                <th className="py-space-sm px-space-md text-center">COMBO</th>
                <th className="py-space-sm px-space-md text-right hidden sm:table-cell">
                  FECHA REGISTRO
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-primary animate-pulse font-headline-md"
                  >
                    SINCRONIZANDO MARCAS CON SUPABASE...
                  </td>
                </tr>
              ) : filteredEntries.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-on-surface-variant font-body-md"
                  >
                    No se encontraron puntuaciones registradas para este filtro.
                    ¡Sé el primero en jugar!
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => {
                  const isTop3 = entry.rank <= 3;
                  const isChampion = entry.rank === 1;

                  return (
                    <tr
                      key={`${entry.gameId}-${entry.rank}-${entry.gamerTag}-${entry.score}`}
                      className={`border-b border-outline-variant/20 hover:bg-surface-container transition-colors group ${
                        isChampion
                          ? "bg-tertiary-container/10"
                          : isTop3
                            ? "bg-surface-container-lowest/50"
                            : ""
                      }`}
                    >
                      {/* Rango */}
                      <td className="py-space-sm px-space-md whitespace-nowrap">
                        <div className="flex items-center gap-space-xs font-label-md text-label-md">
                          {entry.rank === 1 && (
                            <span className="text-tertiary-fixed font-bold flex items-center gap-1 drop-shadow-[0_0_8px_rgba(227,236,0,0.8)]">
                              <span className="material-symbols-outlined text-[18px]">
                                crown
                              </span>
                              #01
                            </span>
                          )}
                          {entry.rank === 2 && (
                            <span className="text-secondary-fixed font-bold flex items-center gap-1">
                              <span className="material-symbols-outlined text-[18px]">
                                military_tech
                              </span>
                              #02
                            </span>
                          )}
                          {entry.rank === 3 && (
                            <span className="text-tertiary-fixed font-bold flex items-center gap-1">
                              <span className="material-symbols-outlined text-[18px]">
                                emoji_events
                              </span>
                              #03
                            </span>
                          )}
                          {entry.rank > 3 && (
                            <span className="text-outline font-bold">
                              #{String(entry.rank).padStart(2, "0")}
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
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
