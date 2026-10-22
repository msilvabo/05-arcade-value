import { FC } from "react";
import Link from "next/link";
import { Game } from "@/types/game";
import { GameArtwork } from "./GameArtwork";
import { ArcadeIcon } from "@/components/ui/ArcadeIcon";

interface GameCardProps {
  game: Game;
  onPlay?: (game: Game) => void;
}

export const GameCard: FC<GameCardProps> = ({ game, onPlay }) => {
  const getBadgeStyle = () => {
    switch (game.badgeVariant) {
      case "secondary":
        return "bg-secondary-container text-on-secondary shadow-[0_0_8px_rgba(255,77,128,0.7)]";
      case "primary":
        return "bg-primary-container text-on-primary-container shadow-[0_0_8px_rgba(0,245,255,0.7)]";
      case "tertiary":
        return "bg-tertiary-container text-on-tertiary font-bold shadow-[0_0_8px_rgba(222,231,0,0.5)]";
      case "surface":
      default:
        if (game.badge === "HARDCORE") {
          return "bg-surface-bright text-tertiary";
        }
        if (game.badge === "MULTI-PULSO") {
          return "bg-surface-container-high text-primary-fixed-dim";
        }
        return "bg-surface-container-high text-tertiary-fixed";
    }
  };

  const getDifficultyStyle = () => {
    switch (game.difficulty) {
      case "HARDCORE":
        return "bg-secondary-container/30 text-secondary-fixed";
      case "DIFÍCIL":
        return game.id === "asteroids-2084"
          ? "bg-surface-container-high text-secondary-fixed"
          : "bg-surface-container-high text-tertiary-fixed";
      case "NORMAL":
      default:
        return "bg-surface-container-high text-primary-fixed";
    }
  };

  return (
    <article className="group relative flex flex-col bg-surface-container rounded-lg overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_25px_rgba(0,245,255,0.45)] transition-all duration-300 hover:-translate-y-1">
      {/* Top Badges & Canvas Artwork */}
      <div className="relative w-full h-48 bg-surface-container-lowest overflow-hidden flex items-center justify-center">
        <GameArtwork artType={game.artType} title={game.title} />

        <div className="absolute top-2 left-2 flex items-center gap-1 bg-surface-container-lowest/80 px-2 py-0.5 rounded backdrop-blur">
          <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider">
            {game.category}
          </span>
          <span className="text-outline-variant font-label-sm text-label-sm">•</span>
          <span className="font-label-sm text-label-sm text-tertiary-fixed tracking-wider">
            {game.year}
          </span>
        </div>

        {game.badge && (
          <span
            className={`absolute top-2 right-2 px-2 py-0.5 rounded font-label-sm text-label-sm uppercase tracking-widest ${getBadgeStyle()}`}
          >
            {game.badge}
          </span>
        )}
      </div>

      {/* Body Content */}
      <div className="p-space-md flex-1 flex flex-col justify-between gap-space-sm bg-surface-container">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-title-sm text-title-sm text-on-surface uppercase tracking-wider group-hover:text-primary-container transition-colors truncate">
              {game.title}
            </h2>
            <span
              className={`px-1.5 py-0.5 rounded font-label-sm text-label-sm uppercase shrink-0 ${getDifficultyStyle()}`}
            >
              {game.difficulty}
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs line-clamp-2">
            {game.description}
          </p>
        </div>

        {/* Score Pill */}
        <div className="bg-surface-container-low p-space-xs rounded flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              RÉCORD MUNDIAL
            </span>
            <span className="font-headline-md text-headline-md text-tertiary-fixed tracking-wider font-bold">
              {game.record.score}
            </span>
          </div>
          <span className="font-label-sm text-label-sm text-secondary-fixed uppercase tracking-wider">
            {game.record.holder}
          </span>
        </div>

        {/* Action Trigger */}
        <Link
          href={`/games/${game.id}`}
          onClick={() => onPlay?.(game)}
          className="w-full py-2 bg-primary-container/10 hover:bg-primary-container text-primary-container hover:text-on-primary font-label-lg text-label-lg uppercase tracking-widest rounded transition-all duration-150 shadow-[0_0_12px_rgba(0,245,255,0.3)] hover:shadow-[0_0_20px_rgba(0,245,255,0.7)] active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer text-center"
        >
          <ArcadeIcon name="sports_esports" className="w-[18px] h-[18px]" />
          <span>JUGAR</span>
        </Link>
      </div>
    </article>
  );
};
