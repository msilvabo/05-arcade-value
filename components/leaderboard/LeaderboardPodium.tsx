"use client";

import { FC } from "react";
import { LeaderboardEntry } from "@/types/leaderboard";

interface LeaderboardPodiumProps {
  entries: LeaderboardEntry[];
  gameTitle?: string;
}

export const LeaderboardPodium: FC<LeaderboardPodiumProps> = ({
  entries,
  gameTitle,
}) => {
  const top1 = entries.find((e) => e.rank === 1);
  const top2 = entries.find((e) => e.rank === 2);
  const top3 = entries.find((e) => e.rank === 3);

  const displayTitle = gameTitle || top1?.gameTitle || "ARCADE VAULT";

  if (!top1) {
    return (
      <div className="w-full mb-space-xl p-space-lg rounded-xl bg-surface-container-low border border-outline-variant/30 text-center flex flex-col items-center">
        <span className="material-symbols-outlined text-[48px] text-tertiary-fixed mb-2 animate-pulse">
          emoji_events
        </span>
        <h3 className="font-headline-md text-headline-md text-primary uppercase tracking-wider">
          PODIO DE HONOR // {displayTitle.toUpperCase()}
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md mt-1">
          Aún no hay puntuaciones registradas para esta cabina. ¡Completa una
          partida e inscribe tu nombre como el primer campeón!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mb-space-xl">
      <div className="flex items-center justify-between mb-space-md">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-tertiary-fixed text-[24px]">
            workspace_premium
          </span>
          <h2 className="font-headline-md text-headline-md uppercase text-on-surface tracking-wider">
            PODIO DE HONOR // {displayTitle.toUpperCase()}
          </h2>
        </div>
        <span className="font-label-sm text-label-sm text-outline-variant uppercase">
          MÁXIMA GLORIA VAULT
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md items-end">
        {/* Puesto 2: Plata */}
        <div className="order-2 md:order-1 flex flex-col rounded-lg bg-surface-container-low p-space-md border border-outline-variant/30 relative group hover:border-secondary-container transition-all">
          <div className="absolute -top-3 left-space-md px-space-sm py-0.5 rounded bg-surface-container-highest border border-outline font-label-sm text-label-sm uppercase font-bold text-secondary-fixed shadow-[0_0_10px_rgba(255,178,191,0.4)] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">
              military_tech
            </span>
            RANGO #02 // PLATA
          </div>

          <div className="relative w-full h-44 rounded bg-surface-container-lowest overflow-hidden mb-space-md mt-2">
            {top2 ? (
              <>
                {top2.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={top2.avatar}
                    alt={top2.gamerTag}
                    className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-surface-container-high text-secondary-fixed">
                    <span className="material-symbols-outlined text-[64px]">
                      person
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent"></div>
                <div className="absolute bottom-2 left-2 px-space-sm py-space-xs bg-surface-container-lowest/90 rounded backdrop-blur-sm">
                  <span className="font-headline-md text-headline-md text-secondary-fixed font-bold uppercase tracking-wider">
                    {top2.gamerTag}
                  </span>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-surface-container-lowest text-outline-variant p-4 text-center">
                <span className="material-symbols-outlined text-[36px] text-outline mb-1">
                  lock
                </span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">
                  PLAZA VACANTE
                </span>
                <span className="text-[11px] text-outline-variant">
                  ¡Sé el 2do piloto en clasificar!
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              PUNTUACIÓN RECORD
            </span>
            <span className="font-headline-lg text-headline-lg text-primary tracking-wider font-bold drop-shadow-[0_0_8px_rgba(0,245,255,0.6)]">
              {top2 ? top2.formattedScore : "---"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-space-xs mt-space-sm pt-space-xs border-t border-outline-variant/30 font-label-sm text-label-sm">
            <div>
              <span className="text-outline uppercase text-[10px]">
                PRECISIÓN:{" "}
              </span>
              <span className="text-primary-fixed font-bold">
                {top2 ? top2.accuracy : "---"}
              </span>
            </div>
            <div className="text-right">
              <span className="text-outline uppercase text-[10px]">
                COMBO:{" "}
              </span>
              <span className="text-secondary-fixed font-bold">
                {top2 ? top2.combo : "---"}
              </span>
            </div>
          </div>
        </div>

        {/* Puesto 1: Oro / Campeón (Centro destacado) */}
        <div className="order-1 md:order-2 flex flex-col rounded-lg bg-surface-container-high p-space-md border-2 border-primary-container relative group shadow-[0_0_30px_rgba(0,245,255,0.35)] -translate-y-2">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-space-md py-1 rounded bg-tertiary-container text-on-tertiary font-label-md text-label-md uppercase font-bold shadow-[0_0_15px_rgba(222,231,0,0.8)] flex items-center gap-1.5 whitespace-nowrap">
            <span className="material-symbols-outlined text-[16px]">crown</span>
            CAMPEÓN MUNDIAL // ORO
          </div>

          <div className="relative w-full h-56 rounded bg-surface-container-lowest overflow-hidden mb-space-md mt-3 shadow-[0_0_20px_rgba(0,245,255,0.25)]">
            {top1.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={top1.avatar}
                alt={top1.gamerTag}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-surface-container-high text-tertiary-fixed">
                <span className="material-symbols-outlined text-[72px]">
                  crown
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent"></div>
            <div className="absolute bottom-2 left-2 px-space-sm py-space-xs bg-surface-container-lowest/90 rounded backdrop-blur-sm flex items-center gap-2">
              <span className="font-headline-lg text-headline-lg text-primary font-bold uppercase tracking-wider drop-shadow-[0_0_10px_rgba(0,245,255,0.8)]">
                {top1.gamerTag}
              </span>
              <span className="w-3 h-3 rounded-full bg-primary-fixed animate-ping"></span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-label-sm text-label-sm text-tertiary-fixed uppercase tracking-wider font-bold">
              ★ MÁXIMA PUNTUACIÓN HISTÓRICA
            </span>
            <span className="font-display-lg text-display-lg text-primary tracking-wider font-bold drop-shadow-[0_0_16px_rgba(0,245,255,0.8)]">
              {top1.formattedScore}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-space-xs mt-space-sm pt-space-xs border-t border-primary-container/40 font-label-sm text-label-sm">
            <div>
              <span className="text-outline uppercase text-[10px]">
                PRECISIÓN:{" "}
              </span>
              <span className="text-tertiary-fixed font-bold">
                {top1.accuracy} (PERFECT)
              </span>
            </div>
            <div className="text-right">
              <span className="text-outline uppercase text-[10px]">
                COMBO MAX:{" "}
              </span>
              <span className="text-primary-fixed font-bold">{top1.combo}</span>
            </div>
          </div>
        </div>

        {/* Puesto 3: Bronce */}
        <div className="order-3 md:order-3 flex flex-col rounded-lg bg-surface-container-low p-space-md border border-outline-variant/30 relative group hover:border-tertiary-container transition-all">
          <div className="absolute -top-3 right-space-md px-space-sm py-0.5 rounded bg-surface-container-highest border border-outline font-label-sm text-label-sm uppercase font-bold text-tertiary-fixed shadow-[0_0_10px_rgba(253,255,181,0.3)] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">
              emoji_events
            </span>
            RANGO #03 // BRONCE
          </div>

          <div className="relative w-full h-44 rounded bg-surface-container-lowest overflow-hidden mb-space-md mt-2">
            {top3 ? (
              <>
                {top3.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={top3.avatar}
                    alt={top3.gamerTag}
                    className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-surface-container-high text-tertiary-fixed">
                    <span className="material-symbols-outlined text-[64px]">
                      person
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent"></div>
                <div className="absolute bottom-2 left-2 px-space-sm py-space-xs bg-surface-container-lowest/90 rounded backdrop-blur-sm">
                  <span className="font-headline-md text-headline-md text-tertiary-fixed font-bold uppercase tracking-wider">
                    {top3.gamerTag}
                  </span>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-surface-container-lowest text-outline-variant p-4 text-center">
                <span className="material-symbols-outlined text-[36px] text-outline mb-1">
                  lock
                </span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">
                  PLAZA VACANTE
                </span>
                <span className="text-[11px] text-outline-variant">
                  ¡Sé el 3er piloto en clasificar!
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              PUNTUACIÓN RECORD
            </span>
            <span className="font-headline-lg text-headline-lg text-primary tracking-wider font-bold drop-shadow-[0_0_8px_rgba(0,245,255,0.6)]">
              {top3 ? top3.formattedScore : "---"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-space-xs mt-space-sm pt-space-xs border-t border-outline-variant/30 font-label-sm text-label-sm">
            <div>
              <span className="text-outline uppercase text-[10px]">
                PRECISIÓN:{" "}
              </span>
              <span className="text-primary-fixed font-bold">
                {top3 ? top3.accuracy : "---"}
              </span>
            </div>
            <div className="text-right">
              <span className="text-outline uppercase text-[10px]">
                COMBO:{" "}
              </span>
              <span className="text-secondary-fixed font-bold">
                {top3 ? top3.combo : "---"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
