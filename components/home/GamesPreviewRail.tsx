import { FC } from "react";
import Link from "next/link";
import { GAMES } from "@/data/games";
import { GameArtwork } from "@/components/library/GameArtwork";

export const GamesPreviewRail: FC = () => {
  const previewGames = GAMES.slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 reveal">
      {/* Section Head */}
      <div className="flex items-center gap-4 mb-8">
        <div className="font-mono text-xs tracking-[0.22em] text-[#00f5ff] font-bold">
          {"//"} 02
        </div>
        <h2 className="font-mono text-xl sm:text-2xl md:text-3xl tracking-wider text-white font-black uppercase">
          JUEGOS DISPONIBLES AHORA
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-outline-variant/60 to-transparent" />
      </div>

      {/* Mini Cards Grid / Rail */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {previewGames.map((game) => (
          <Link
            key={game.id}
            href={`/games/${game.id}`}
            className="group rounded bg-surface-container border border-outline-variant/30 hover:border-primary/60 transition-all duration-200 overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,245,255,0.2)]"
          >
            {/* Mini Cover Art */}
            <div className="relative aspect-video sm:aspect-square w-full overflow-hidden bg-black/60">
              <GameArtwork artType={game.artType} title={game.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent opacity-80" />
            </div>

            {/* Mini Meta */}
            <div className="p-3 flex flex-col justify-between flex-1 gap-1">
              <h3 className="font-mono font-bold text-xs text-white uppercase tracking-wider line-clamp-1 group-hover:text-primary-fixed transition-colors">
                {game.title}
              </h3>
              <div className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
                {game.category}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Button to full library */}
      <div className="mt-8 text-center">
        <Link
          href="/library"
          className="inline-flex items-center gap-2 px-6 py-3 rounded font-mono font-bold text-xs uppercase tracking-widest bg-surface-container-high border border-primary/40 text-primary-fixed hover:bg-primary-container hover:text-on-primary-container hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all cursor-pointer"
        >
          <span>VER TODOS LOS JUEGOS</span>
          <span>→</span>
        </Link>
      </div>
    </section>
  );
};
