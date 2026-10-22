"use client";

import { FC, useState } from "react";
import { Header } from "@/components/library/Header";
import { Footer } from "@/components/library/Footer";
import { LauncherHero } from "@/components/launcher/LauncherHero";
import { MissionLog } from "@/components/launcher/MissionLog";
import { GameRecordsSidebar } from "@/components/launcher/GameRecordsSidebar";
import { GameExtendedDetails } from "@/types/launcher";

interface LauncherClientProps {
  game: GameExtendedDetails;
}

export const LauncherClient: FC<LauncherClientProps> = ({ game }) => {
  const [sfx, setSfx] = useState<boolean>(true);
  const [music, setMusic] = useState<boolean>(true);

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        credits={4}
        sfx={sfx}
        music={music}
        onToggleSfx={() => setSfx((prev) => !prev)}
        onToggleMusic={() => setMusic((prev) => !prev)}
      />

      <main className="w-full pt-20 bg-surface relative min-h-[calc(100vh-80px)] flex-1">
        {/* Synthwave Grid Horizon Overlay Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-container/20 via-surface-container-lowest to-transparent h-96"></div>

        <div className="w-full px-space-md sm:px-space-lg lg:px-margin py-space-lg flex flex-col gap-space-xl relative z-10">
          <LauncherHero game={game} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
            <div className="lg:col-span-7">
              <MissionLog game={game} />
            </div>

            <div className="lg:col-span-5">
              <GameRecordsSidebar game={game} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
