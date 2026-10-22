"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { GameExtendedDetails } from "@/types/launcher";

interface GameRecordsSidebarProps {
  game: GameExtendedDetails;
}

export const GameRecordsSidebar: FC<GameRecordsSidebarProps> = ({ game }) => {
  const [tab, setTab] = useState<"semana" | "historico">("historico");

  const recordsList = [
    { rank: "01", medal: "🥇", player: "CYBER_GHOST", tag: "CHAMP", score: "142,500", date: "12/10" },
    { rank: "02", medal: "🥈", player: "NEON_VALKYRIE", tag: "", score: "128,900", date: "14/10" },
    { rank: "03", medal: "🥉", player: "RETRO_BLASTER", tag: "", score: "115,200", date: "15/10" },
    { rank: "04", medal: "", player: "PIXEL_MAGE", tag: "", score: "098,400", date: "16/10" },
    { rank: "05", medal: "", player: "MATRIX_RUNNER", tag: "", score: "088,100", date: "18/10" },
    { rank: "06", medal: "", player: "SYNTH_BOY", tag: "", score: "076,300", date: "19/10" },
    { rank: "07", medal: "", player: "LASER_PUNK", tag: "", score: "064,200", date: "20/10" },
    { rank: "08", medal: "", player: "BYTE_HUNTER", tag: "", score: "058,900", date: "20/10" },
    { rank: "09", medal: "", player: "VORTEX_PILOT", tag: "", score: "052,000", date: "21/10" },
    { rank: "10", medal: "", player: "KAIZEN_ACE", tag: "", score: "049,800", date: "21/10" },
  ];

  return (
    <div className="flex flex-col gap-space-md w-full">
      {/* Tablero Principal de Clasificación */}
      <div className="bg-surface-container-low rounded-xl p-space-lg flex flex-col gap-space-md shadow-[0_8px_30px_rgba(0,0,0,0.7)] border border-outline-variant/30">
        {/* Encabezado con Trofeo */}
        <div className="flex items-center justify-between flex-wrap gap-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-tertiary-fixed text-[24px] drop-shadow-[0_0_8px_rgba(227,236,0,0.8)]">
              emoji_events
            </span>
            <h3 className="font-title-sm text-title-sm text-primary uppercase tracking-wider">
              MEJORES PUNTUACIONES
            </h3>
          </div>
          <span className="font-label-sm text-label-sm text-secondary-fixed uppercase tracking-widest">
            (TOP 10 MUNDIAL)
          </span>
        </div>

        {/* Filtros Rápidos (Tabs Segmentadas) */}
        <div className="flex bg-surface-container-lowest p-1 rounded-lg gap-1 border border-outline-variant/20">
          <button
            type="button"
            onClick={() => setTab("semana")}
            className={`flex-1 py-space-xs px-space-sm font-label-sm text-label-sm uppercase tracking-wider rounded transition-colors text-center cursor-pointer ${
              tab === "semana"
                ? "bg-surface-container-high text-primary-fixed font-bold shadow-[inset_0_-2px_0_0_#00f5ff,0_0_10px_rgba(0,245,255,0.3)]"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            ESTA SEMANA
          </button>
          <button
            type="button"
            onClick={() => setTab("historico")}
            className={`flex-1 py-space-xs px-space-sm font-label-sm text-label-sm uppercase tracking-wider rounded transition-colors text-center cursor-pointer ${
              tab === "historico"
                ? "bg-surface-container-high text-primary-fixed font-bold shadow-[inset_0_-2px_0_0_#00f5ff,0_0_10px_rgba(0,245,255,0.3)]"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            HISTÓRICO GLOBAL
          </button>
        </div>

        {/* Cabecera de Tabla Pixelada */}
        <div className="grid grid-cols-12 text-outline-variant font-label-sm text-label-sm uppercase tracking-widest px-space-sm py-space-xs bg-surface-container-lowest rounded border border-outline-variant/20">
          <span className="col-span-2">POS</span>
          <span className="col-span-5">PILOTO</span>
          <span className="col-span-3 text-right">PUNTOS</span>
          <span className="col-span-2 text-right">FECHA</span>
        </div>

        {/* Lista de Récords */}
        <div className="flex flex-col gap-1 font-body-sm text-body-sm font-mono">
          {recordsList.map((rec) => (
            <div
              key={rec.rank}
              className={`grid grid-cols-12 items-center px-space-sm py-space-xs rounded shadow-sm hover:bg-surface-container-high transition-colors ${
                rec.rank === "01"
                  ? "bg-surface-container border border-tertiary/40"
                  : rec.rank === "02"
                  ? "bg-surface-container-lowest border border-outline-variant/30"
                  : "bg-surface-container-lowest/60"
              }`}
            >
              <div
                className={`col-span-2 flex items-center gap-1 font-bold ${
                  rec.rank === "01"
                    ? "text-tertiary-fixed drop-shadow-[0_0_4px_rgba(227,236,0,0.8)]"
                    : rec.rank === "02"
                    ? "text-on-surface"
                    : rec.rank === "03"
                    ? "text-secondary-fixed"
                    : "text-outline"
                }`}
              >
                <span>{rec.rank}</span>
                {rec.medal && <span>{rec.medal}</span>}
              </div>

              <div className="col-span-5 flex items-center gap-1 truncate font-bold text-on-surface">
                <span className="truncate">{rec.player}</span>
                {rec.tag && (
                  <span className="text-[9px] bg-tertiary-container text-on-tertiary px-1 rounded uppercase font-bold tracking-tighter shrink-0">
                    {rec.tag}
                  </span>
                )}
              </div>

              <span className="col-span-3 text-right font-bold text-primary-fixed drop-shadow-[0_0_6px_rgba(0,245,255,0.7)]">
                {rec.score}
              </span>
              <span className="col-span-2 text-right text-outline-variant text-[10px]">
                {rec.date}
              </span>
            </div>
          ))}
        </div>

        {/* Enlace al Salón de la Fama Completo */}
        <Link
          href="/leaderboard"
          className="w-full text-center py-2 px-3 rounded bg-surface-container hover:bg-surface-container-high text-primary-fixed font-label-sm text-label-sm uppercase tracking-wider transition-all border border-primary-container/30 hover:shadow-[0_0_12px_rgba(0,245,255,0.3)] mt-2"
        >
          VER CLASIFICACIÓN COMPLETA // TOP 100 →
        </Link>
      </div>

      {/* Tarjeta de Telemetría de la Cabina */}
      <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-xs border border-outline-variant/30 font-body-sm text-body-sm">
        <span className="font-label-sm text-label-sm text-tertiary-fixed font-bold uppercase tracking-wider">
          TELEMETRÍA EN DIRECTO
        </span>
        <div className="flex justify-between items-center text-on-surface-variant">
          <span>PILOTOS EN COLA:</span>
          <span className="text-primary-fixed font-bold">{game.activePlayers} ACTIVOS</span>
        </div>
        <div className="flex justify-between items-center text-on-surface-variant">
          <span>RÉCORD MUNDIAL:</span>
          <span className="text-secondary-fixed font-bold">{game.maxScore} PTS</span>
        </div>
        <div className="flex justify-between items-center text-on-surface-variant">
          <span>POSEEDOR DEL TITULAR:</span>
          <span className="text-tertiary-fixed font-bold">{game.recordHolder}</span>
        </div>
      </div>
    </div>
  );
};
