import { Metadata } from "next";
import { Suspense } from "react";
import { PlayRoomClient } from "@/components/game-room/PlayRoomClient";
import { GAMES } from "@/data/games";

export function generateStaticParams() {
  return GAMES.map((g) => ({ id: g.id }));
}

interface PlayPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PlayPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Jugando // ${id.toUpperCase()} // Arcade Vault`,
    description: "Cabina de juego retro CRT con controles y simulación activa.",
  };
}

async function PlayRoomRegion({ params }: PlayPageProps) {
  const { id } = await params;
  return <PlayRoomClient gameId={id} />;
}

export default function PlayPage({ params }: PlayPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center font-headline-md text-primary">
          CARGANDO CABINA CRT...
        </div>
      }
    >
      <PlayRoomRegion params={params} />
    </Suspense>
  );
}
