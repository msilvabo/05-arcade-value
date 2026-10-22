import { FC } from "react";
import { ArcadeIcon } from "@/components/ui/ArcadeIcon";

export const TournamentBanner: FC = () => {
  return (
    <section className="w-full bg-secondary-container/20 px-space-md lg:px-margin py-space-xs shadow-[0_0_20px_rgba(255,77,128,0.2)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-space-sm text-center md:text-left">
        <div className="flex items-center gap-space-sm">
          <span className="p-1 rounded bg-secondary-container text-on-secondary shadow-[0_0_10px_rgba(255,77,128,0.8)] flex items-center justify-center">
            <ArcadeIcon name="emoji_events" className="w-[18px] h-[18px] text-on-secondary" />
          </span>
          <span className="font-label-lg text-label-lg text-secondary-fixed uppercase tracking-wider">
            TORNEO SEMANAL: PREMIO DE 500 FICHAS VIRTUALES EN ARKANOID
          </span>
        </div>
        <div className="flex items-center gap-space-sm">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
            CIERRE DE CABINA:
          </span>
          <span className="px-space-sm py-0.5 bg-surface-container-highest rounded font-headline-md text-headline-md text-tertiary-fixed tracking-widest shadow-[0_0_8px_rgba(227,236,0,0.4)]">
            02D 14H 32M
          </span>
        </div>
      </div>
    </section>
  );
};
