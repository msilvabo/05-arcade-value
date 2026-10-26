import { Metadata } from "next";
import { Suspense } from "react";
import { getGames } from "@/lib/services/games";
import { getLeaderboardEntries } from "@/lib/services/leaderboard";
import { LeaderboardClient } from "@/components/leaderboard/LeaderboardClient";

export const metadata: Metadata = {
  title: "Salón de la Fama // Leaderboard // Arcade Vault",
  description:
    "Registro oficial de maestría coin-op y récords arcade mundiales.",
};

async function LeaderboardContent() {
  const [games, initialEntries] = await Promise.all([
    getGames(),
    getLeaderboardEntries(),
  ]);

  return (
    <LeaderboardClient initialGames={games} initialEntries={initialEntries} />
  );
}

export default function LeaderboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col min-h-screen bg-surface items-center justify-center text-primary font-headline-md tracking-wider">
          CARGANDO SALÓN DE LA FAMA...
        </div>
      }
    >
      <LeaderboardContent />
    </Suspense>
  );
}
