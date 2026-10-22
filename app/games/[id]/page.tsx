import { Metadata } from "next";
import { Suspense } from "react";
import { LauncherClient } from "@/components/launcher/LauncherClient";
import { GAME_DETAILS } from "@/data/game-details";
import { GAMES } from "@/data/games";

export function generateStaticParams() {
  return GAMES.map((g) => ({ id: g.id }));
}

interface GameLauncherPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: GameLauncherPageProps): Promise<Metadata> {
  const { id } = await params;
  const game = GAME_DETAILS[id] || GAME_DETAILS["arkanoid"];
  return {
    title: `${game.title}: ${game.subtitle} // Arcade Vault`,
    description: game.missionLog.story,
  };
}

async function LauncherRegion({ params }: GameLauncherPageProps) {
  const { id } = await params;
  const game = GAME_DETAILS[id] || GAME_DETAILS["arkanoid"];
  return <LauncherClient game={game} />;
}

export default function GameLauncherPage({ params }: GameLauncherPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center font-headline-md text-primary">
          CARGANDO LANZADOR ARCADE...
        </div>
      }
    >
      <LauncherRegion params={params} />
    </Suspense>
  );
}
