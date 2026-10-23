import { Metadata } from "next";
import { Suspense } from "react";
import { LauncherClient } from "@/components/launcher/LauncherClient";
import { getGameConfig, getAvailableGameIds } from "@/app/games/_lib/registry";

export function generateStaticParams() {
  return getAvailableGameIds().map((id) => ({ id }));
}

interface GameLauncherPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: GameLauncherPageProps): Promise<Metadata> {
  const { id } = await params;
  const game = getGameConfig(id);
  return {
    title: `${game.title}: ${game.subtitle} // Arcade Vault`,
    description: game.missionLog.story,
  };
}

async function LauncherRegion({ params }: GameLauncherPageProps) {
  const { id } = await params;
  const game = getGameConfig(id);
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
