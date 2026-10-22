"use client";

import { useState, useMemo, useRef } from "react";
import { Header } from "@/components/library/Header";
import { HeroSection } from "@/components/library/HeroSection";
import { TournamentBanner } from "@/components/library/TournamentBanner";
import { GameFilters } from "@/components/library/GameFilters";
import { GameCard } from "@/components/library/GameCard";
import { GameModal } from "@/components/library/GameModal";
import { CrtDock } from "@/components/library/CrtDock";
import { Footer } from "@/components/library/Footer";
import { ArcadeIcon } from "@/components/ui/ArcadeIcon";
import { GAMES } from "@/data/games";
import { Game, GameCategory, SortOption } from "@/types/game";

export default function Home() {
  const [credits, setCredits] = useState<number>(4);
  const [sfx, setSfx] = useState<boolean>(true);
  const [music, setMusic] = useState<boolean>(true);
  const [showCoinFeedback, setShowCoinFeedback] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>("all");
  const [selectedSort, setSelectedSort] = useState<SortOption>("populares");
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [crtActive, setCrtActive] = useState<boolean>(true);

  const coinTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInsertCredit = () => {
    setCredits((prev) => prev + 1);
    setShowCoinFeedback(true);

    if (coinTimeoutRef.current) {
      clearTimeout(coinTimeoutRef.current);
    }

    coinTimeoutRef.current = setTimeout(() => {
      setShowCoinFeedback(false);
    }, 2200);
  };

  const filteredAndSortedGames = useMemo(() => {
    let result = [...GAMES];

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((game) => game.categoryKey.includes(selectedCategory));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (game) =>
          game.title.toLowerCase().includes(q) ||
          game.category.toLowerCase().includes(q) ||
          game.description.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (selectedSort) {
        case "record":
          return b.record.rawScore - a.record.rawScore;
        case "ano":
          return a.year - b.year;
        case "populares":
        default:
          return b.playsCount - a.playsCount;
      }
    });

    return result;
  }, [selectedCategory, searchQuery, selectedSort]);

  return (
    <div className="relative min-h-screen bg-surface font-body-md text-body-md text-on-surface overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
      {/* Full-page Ambient Vector Grid Backing */}
      <div className="fixed inset-0 pointer-events-none opacity-10 bg-[linear-gradient(to_right,#00f5ff_1px,transparent_1px),linear-gradient(to_bottom,#00f5ff_1px,transparent_1px)] bg-[size:4rem_4rem] z-0" />

      {/* CRT Scanlines and Vector Overlay */}
      {crtActive && (
        <>
          <div className="fixed inset-0 crt-overlay z-50 pointer-events-none" />
          <div className="fixed inset-0 scanline-sweep z-40 pointer-events-none" />
        </>
      )}

      {/* Top Navbar */}
      <Header
        credits={credits}
        sfx={sfx}
        music={music}
        onToggleSfx={() => setSfx((prev) => !prev)}
        onToggleMusic={() => setMusic((prev) => !prev)}
      />

      {/* Main Page Area */}
      <main className="w-full pt-20 bg-surface relative min-h-[calc(100vh-80px)]">
        <div className="flex flex-col w-full">
          {/* Section Hero / Marquee Arcade */}
          <HeroSection
            onInsertCredit={handleInsertCredit}
            showCoinFeedback={showCoinFeedback}
            onOpenLeaderboard={() => {
              const recordsEl = document.getElementById("catalog-section");
              recordsEl?.scrollIntoView({ behavior: "smooth" });
            }}
          />

          {/* Weekly Tournament Ticker */}
          <TournamentBanner />

          {/* Search, Filter & Telemetry Controls */}
          <div id="catalog-section">
            <GameFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedSort={selectedSort}
              onSelectSort={setSelectedSort}
              filteredCount={filteredAndSortedGames.length}
            />
          </div>

          {/* Cartridge & Cabinet Game Grid */}
          <section className="w-full px-space-md lg:px-margin pb-space-xl bg-surface">
            <div className="max-w-7xl mx-auto">
              {filteredAndSortedGames.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
                  {filteredAndSortedGames.map((game) => (
                    <GameCard key={game.id} game={game} onPlay={setSelectedGame} />
                  ))}
                </div>
              ) : (
                <div className="py-16 px-4 text-center rounded-lg bg-surface-container-low border border-dashed border-outline-variant/40 flex flex-col items-center justify-center">
                  <ArcadeIcon name="search_off" className="text-outline w-12 h-12 mb-2" />
                  <p className="font-headline-md text-headline-md text-on-surface uppercase tracking-wider">
                    NO SE ENCONTRARON JUEGOS
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    No hay títulos que coincidan con &quot;{searchQuery}&quot; en la categoría seleccionada.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                    className="mt-4 px-space-md py-1.5 rounded bg-primary-container text-on-primary-container font-label-md text-label-md uppercase tracking-wider font-bold shadow-[0_0_12px_rgba(0,245,255,0.5)] cursor-pointer"
                  >
                    REINICIAR BÚSQUEDA Y FILTROS
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Quick Cabin Setup Dock */}
          <CrtDock onToggleCrt={() => setCrtActive((prev) => !prev)} />
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Retro Game Modal */}
      <GameModal
        game={selectedGame}
        onClose={() => setSelectedGame(null)}
        credits={credits}
      />
    </div>
  );
}
