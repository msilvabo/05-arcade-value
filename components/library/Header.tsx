"use client";

import { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArcadeLogo } from "@/components/ui/ArcadeLogo";
import { ArcadeIcon } from "@/components/ui/ArcadeIcon";

interface HeaderProps {
  credits: number;
  sfx: boolean;
  music: boolean;
  onToggleSfx: () => void;
  onToggleMusic: () => void;
}

export const Header: FC<HeaderProps> = ({
  credits,
  sfx,
  music,
  onToggleSfx,
  onToggleMusic,
}) => {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isLeaderboard = pathname === "/leaderboard";
  const isAuth = pathname === "/auth";

  return (
    <header className="fixed top-0 w-full z-30 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
      <div className="h-20 w-full px-space-lg lg:px-margin flex items-center justify-between gap-space-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-space-md shrink-0 group">
          <ArcadeLogo className="h-8 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(0,245,255,0.8)]" />
          <span className="text-primary-container font-mono text-base font-bold select-none tracking-widest hidden sm:inline">
            ::
          </span>
          <div className="flex flex-col">
            <span className="font-title-sm text-title-sm uppercase tracking-widest text-primary drop-shadow-[0_0_6px_rgba(0,245,255,0.7)]">
              ARCADE VAULT
            </span>
            <span className="font-label-sm text-label-sm text-primary-fixed-dim uppercase tracking-wider">
              SISTEMA V.84.2 // ACTIVO
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden xl:flex items-center gap-space-sm">
          <Link
            href="/"
            aria-current={isHome ? "page" : undefined}
            className={`px-space-md py-space-sm font-label-lg text-label-lg uppercase tracking-wider transition-all rounded ${
              isHome
                ? "bg-surface-container-high text-primary-fixed font-bold shadow-[inset_0_-2px_0_0_#00f5ff,0_0_12px_rgba(0,245,255,0.4)]"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            Biblioteca
          </Link>
          <Link
            href="/leaderboard"
            aria-current={isLeaderboard ? "page" : undefined}
            className={`px-space-md py-space-sm font-label-lg text-label-lg uppercase tracking-wider transition-all rounded ${
              isLeaderboard
                ? "bg-surface-container-high text-primary-fixed font-bold shadow-[inset_0_-2px_0_0_#00f5ff,0_0_12px_rgba(0,245,255,0.4)]"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            Salón de la Fama
          </Link>
          <Link
            href="/auth"
            aria-current={isAuth ? "page" : undefined}
            className={`px-space-md py-space-sm font-label-lg text-label-lg uppercase tracking-wider transition-all rounded ${
              isAuth
                ? "bg-surface-container-high text-primary-fixed font-bold shadow-[inset_0_-2px_0_0_#00f5ff,0_0_12px_rgba(0,245,255,0.4)]"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            Autenticación
          </Link>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-space-sm lg:gap-space-md shrink-0">
          {/* Audio Toggles */}
          <div className="hidden md:flex items-center bg-surface-container-low px-space-sm py-space-xs rounded gap-space-xs border border-outline-variant/30">
            <button
              className="px-space-xs py-0.5 font-label-sm text-label-sm text-primary-fixed hover:bg-surface-container-high hover:text-on-surface transition-colors rounded uppercase cursor-pointer"
              type="button"
              onClick={onToggleSfx}
              title="Alternar SFX"
            >
              SFX: {sfx ? "ON" : "OFF"}
            </button>
            <span className="text-outline-variant font-label-sm text-label-sm">|</span>
            <button
              className="px-space-xs py-0.5 font-label-sm text-label-sm text-secondary-fixed hover:bg-surface-container-high hover:text-on-surface transition-colors rounded uppercase cursor-pointer"
              type="button"
              onClick={onToggleMusic}
              title="Alternar Música"
            >
              MÚSICA: {music ? "8-BIT" : "MUTE"}
            </button>
          </div>

          {/* Credits Counter */}
          <div className="flex items-center gap-space-xs bg-surface-container px-space-sm py-space-xs rounded shadow-[0_0_10px_rgba(227,236,0,0.25)] border border-tertiary-fixed/30">
            <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-ping" />
            <span className="font-label-md text-label-md text-tertiary-fixed uppercase font-bold tracking-wider">
              CRÉDITOS: {credits.toString().padStart(2, "0")}
            </span>
            <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider hidden sm:inline">
              [INSERTAR MONEDA]
            </span>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-space-sm pl-space-xs">
            <div className="hidden lg:flex flex-col text-right">
              <span className="font-label-sm text-label-sm text-on-surface font-bold tracking-wider uppercase drop-shadow-[0_0_4px_rgba(255,178,191,0.5)]">
                RETRO_PRO_84
              </span>
              <div className="flex items-center justify-end gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed-dim inline-block" />
                <span className="font-label-sm text-label-sm text-primary-fixed uppercase">
                  ONLINE
                </span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(255,77,128,0.7)]">
              <ArcadeIcon name="person" className="text-on-primary w-[18px] h-[18px]" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
