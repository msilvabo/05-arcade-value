"use client";

import { FC, KeyboardEvent } from "react";
import { GameCategory, SortOption, CategoryTab } from "@/types/game";
import { CATEGORIES } from "@/data/games";
import { ArcadeIcon } from "@/components/ui/ArcadeIcon";

interface GameFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: GameCategory;
  onSelectCategory: (category: GameCategory) => void;
  selectedSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
  filteredCount: number;
}

export const GameFilters: FC<GameFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  selectedSort,
  onSelectSort,
  filteredCount,
}) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      onSearchChange("");
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <section className="w-full px-space-md lg:px-margin py-space-lg bg-surface">
      <div className="max-w-7xl mx-auto flex flex-col gap-space-md">
        {/* Input & Sort Controls */}
        <div className="flex flex-col lg:flex-row gap-space-md items-stretch lg:items-center justify-between">
          {/* Search Field */}
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-space-md flex items-center pointer-events-none text-primary-container">
              <ArcadeIcon name="search" className="w-5 h-5 text-primary-container" />
            </div>
            <input
              className="w-full pl-12 pr-28 py-space-sm bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-md text-body-md uppercase tracking-wider rounded shadow-[0_0_15px_rgba(0,0,0,0.8)] focus:outline-none focus:ring-2 focus:ring-primary-container focus:shadow-[0_0_20px_rgba(0,245,255,0.35)] transition-all"
              id="arcadeSearch"
              placeholder="BUSCAR JUEGO CLÁSICO O GÉNERO..."
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 font-label-sm text-label-sm text-secondary-fixed hover:text-white cursor-pointer px-1.5 py-0.5 rounded bg-surface-container"
              >
                LIMPIAR
              </button>
            ) : (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 font-label-sm text-label-sm text-outline group-focus-within:text-primary-container pointer-events-none">
                [ESC // LIMPIAR]
              </span>
            )}
          </div>

          {/* Sort Selectors */}
          <div className="flex items-center gap-space-sm bg-surface-container-low px-space-md py-space-xs rounded shadow-inner">
            <ArcadeIcon name="sort" className="w-[18px] h-[18px] text-outline" />
            <label
              className="font-label-sm text-label-sm text-outline uppercase tracking-wider whitespace-nowrap"
              htmlFor="sortSelector"
            >
              ORDENAR POR:
            </label>
            <select
              className="bg-surface-container text-primary font-label-md text-label-md uppercase tracking-wider py-1 px-space-sm rounded focus:outline-none cursor-pointer"
              id="sortSelector"
              value={selectedSort}
              onChange={(e) => onSelectSort(e.target.value as SortOption)}
            >
              <option value="populares">MÁS JUGADOS</option>
              <option value="record">MEJOR PUNTUACIÓN</option>
              <option value="ano">AÑO DE LANZAMIENTO</option>
            </select>
          </div>
        </div>

        {/* Retro Cartridge Category Tabs */}
        <div className="flex items-center gap-space-xs overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat: CategoryTab) => {
            const isActive = selectedCategory === cat.key;
            const labelText =
              cat.key === "all" ? `TODOS (${filteredCount.toString().padStart(2, "0")})` : cat.label;

            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => onSelectCategory(cat.key)}
                className={`category-btn px-space-md py-space-xs rounded font-label-md text-label-md uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-primary-container text-on-primary-container font-bold shadow-[0_0_12px_rgba(0,245,255,0.6)]"
                    : "bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                }`}
              >
                {labelText}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
