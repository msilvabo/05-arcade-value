"use client";

import { FC, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArcadeLogo } from "@/components/ui/ArcadeLogo";
import { ArcadeIcon } from "@/components/ui/ArcadeIcon";
import { createClient } from "@/lib/supabase/client";
import { getCurrentPilotProfile, signOutPilot } from "@/lib/services/auth";
import { AuthUserSession } from "@/types/auth";

export interface NavbarProps {
  credits?: number;
  sfx?: boolean;
  music?: boolean;
  onToggleSfx?: () => void;
  onToggleMusic?: () => void;
  onInsertCredit?: () => void;
}

export const Navbar: FC<NavbarProps> = ({
  credits = 4,
  sfx = true,
  music = true,
  onToggleSfx,
  onToggleMusic,
  onInsertCredit,
}) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUserSession | null>(null);

  const isHome = pathname === "/";
  const isLibrary = pathname === "/library" || pathname === "/biblioteca";
  const isLeaderboard = pathname === "/leaderboard";
  const isAbout = pathname === "/about";
  const isAuth = pathname === "/auth";

  const closeMobileMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    let isMounted = true;
    getCurrentPilotProfile().then((profile) => {
      if (isMounted) setUser(profile);
    });

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async () => {
      const profile = await getCurrentPilotProfile();
      if (isMounted) setUser(profile);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await signOutPilot();
    setUser(null);
    closeMobileMenu();
  };

  return (
    <>
      <header className="fixed top-0 w-full z-40 bg-surface-container-lowest/90 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
        <div className="h-20 w-full px-space-md lg:px-margin flex items-center justify-between gap-space-md">
          {/* Logo Arcade Vault */}
          <Link href="/" className="flex items-center gap-space-md shrink-0 group" onClick={closeMobileMenu}>
            <ArcadeLogo className="h-8 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(0,245,255,0.8)] group-hover:drop-shadow-[0_0_12px_rgba(0,245,255,1)] transition-all" />
            <span className="text-primary-container font-mono text-base font-bold select-none tracking-widest hidden sm:inline">
              ::
            </span>
            <div className="flex flex-col">
              <span className="font-title-sm text-title-sm uppercase tracking-widest text-primary drop-shadow-[0_0_6px_rgba(0,245,255,0.7)] group-hover:text-primary-container transition-colors">
                ARCADE VAULT
              </span>
              <span className="font-label-sm text-label-sm text-primary-fixed-dim uppercase tracking-wider hidden xs:inline">
                SISTEMA V.84.2 // ONLINE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              href="/"
              aria-current={isHome ? "page" : undefined}
              className={`px-3 py-1.5 font-label-md text-label-md uppercase tracking-wider transition-all rounded ${
                isHome
                  ? "bg-surface-container-high text-primary-fixed font-bold shadow-[inset_0_-2px_0_0_#00f5ff,0_0_12px_rgba(0,245,255,0.35)]"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container/60"
              }`}
            >
              Inicio
            </Link>
            <Link
              href="/library"
              aria-current={isLibrary ? "page" : undefined}
              className={`px-3 py-1.5 font-label-md text-label-md uppercase tracking-wider transition-all rounded ${
                isLibrary
                  ? "bg-surface-container-high text-primary-fixed font-bold shadow-[inset_0_-2px_0_0_#00f5ff,0_0_12px_rgba(0,245,255,0.35)]"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container/60"
              }`}
            >
              Biblioteca
            </Link>
            <Link
              href="/leaderboard"
              aria-current={isLeaderboard ? "page" : undefined}
              className={`px-3 py-1.5 font-label-md text-label-md uppercase tracking-wider transition-all rounded ${
                isLeaderboard
                  ? "bg-surface-container-high text-primary-fixed font-bold shadow-[inset_0_-2px_0_0_#00f5ff,0_0_12px_rgba(0,245,255,0.35)]"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container/60"
              }`}
            >
              Salón de la Fama
            </Link>
            <Link
              href="/about"
              aria-current={isAbout ? "page" : undefined}
              className={`px-3 py-1.5 font-label-md text-label-md uppercase tracking-wider transition-all rounded ${
                isAbout
                  ? "bg-surface-container-high text-primary-fixed font-bold shadow-[inset_0_-2px_0_0_#00f5ff,0_0_12px_rgba(0,245,255,0.35)]"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container/60"
              }`}
            >
              Acerca de
            </Link>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-space-sm sm:gap-space-md shrink-0">
            {/* Audio Toggles (si existen handlers) */}
            {onToggleSfx && (
              <div className="hidden xl:flex items-center bg-surface-container-low px-space-sm py-space-xs rounded gap-space-xs border border-outline-variant/30">
                <button
                  className="px-space-xs py-0.5 font-label-sm text-label-sm text-primary-fixed hover:bg-surface-container-high hover:text-on-surface transition-colors rounded uppercase cursor-pointer"
                  type="button"
                  onClick={onToggleSfx}
                  title="Alternar SFX"
                >
                  SFX: {sfx ? "ON" : "OFF"}
                </button>
                {onToggleMusic && (
                  <>
                    <span className="text-outline-variant font-label-sm text-label-sm">|</span>
                    <button
                      className="px-space-xs py-0.5 font-label-sm text-label-sm text-secondary-fixed hover:bg-surface-container-high hover:text-on-surface transition-colors rounded uppercase cursor-pointer"
                      type="button"
                      onClick={onToggleMusic}
                      title="Alternar Música"
                    >
                      MÚSICA: {music ? "8-BIT" : "MUTE"}
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Credits Counter */}
            <button
              type="button"
              onClick={onInsertCredit}
              title="Click para insertar crédito"
              className="flex items-center gap-space-xs bg-surface-container px-2.5 sm:px-space-sm py-1.5 rounded shadow-[0_0_12px_rgba(227,236,0,0.25)] border border-tertiary-fixed/30 hover:border-tertiary-fixed/60 transition-colors cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-ping" />
              <span className="font-label-md text-label-md text-tertiary-fixed uppercase font-bold tracking-wider font-mono">
                CRÉDITOS: {credits.toString().padStart(2, "0")}
              </span>
            </button>

            {/* Auth / Account Link or Authenticated Pilot Badge */}
            {user ? (
              <div className="hidden sm:inline-flex items-center gap-2">
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded font-label-md text-label-md uppercase tracking-wider font-bold bg-surface-container border border-primary-container/40 text-primary-fixed shadow-[0_0_12px_rgba(0,245,255,0.25)]"
                  title={`Conectado como ${user.gamerTag} (${user.email})`}
                >
                  <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse shadow-[0_0_8px_#00f5ff]" />
                  <span className="max-w-[130px] truncate">{user.gamerTag}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-1.5 rounded bg-surface-container hover:bg-secondary-container/20 text-on-surface-variant hover:text-secondary-container border border-outline-variant/30 transition-colors cursor-pointer flex items-center justify-center"
                  title="Cerrar Sesión"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded font-label-md text-label-md uppercase tracking-wider font-bold transition-all border ${
                  isAuth
                    ? "bg-secondary-container text-on-secondary-container border-secondary shadow-[0_0_12px_rgba(255,0,110,0.4)]"
                    : "bg-surface-container text-on-surface hover:border-primary/50 hover:text-primary-fixed border-outline-variant/40"
                }`}
              >
                <ArcadeIcon name="person" className="w-4 h-4" />
                <span>Iniciar Sesión</span>
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Abrir Menú de Navegación"
              className="lg:hidden p-2 rounded bg-surface-container border border-outline-variant/40 text-primary-fixed hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              <span className="text-xl font-mono leading-none">≡</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Panel */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-72 max-w-[85vw] z-50 bg-surface-container-lowest border-l border-primary/40 shadow-[-10px_0_30px_rgba(0,0,0,0.9)] p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
            <span className="font-mono text-xs font-bold text-primary tracking-widest uppercase">
              {"//"} MENÚ DE SISTEMA
            </span>
            <button
              type="button"
              onClick={closeMobileMenu}
              className="text-on-surface-variant hover:text-primary transition-colors text-lg font-mono p-1 cursor-pointer"
              aria-label="Cerrar Menú"
            >
              ✕
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className={`px-3 py-2.5 rounded font-label-lg text-label-lg uppercase tracking-wider transition-colors ${
                isHome
                  ? "bg-surface-container-high text-primary-fixed font-bold border-l-2 border-primary"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container/40"
              }`}
            >
              ▸ Inicio
            </Link>
            <Link
              href="/library"
              onClick={closeMobileMenu}
              className={`px-3 py-2.5 rounded font-label-lg text-label-lg uppercase tracking-wider transition-colors ${
                isLibrary
                  ? "bg-surface-container-high text-primary-fixed font-bold border-l-2 border-primary"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container/40"
              }`}
            >
              ▸ Biblioteca
            </Link>
            <Link
              href="/leaderboard"
              onClick={closeMobileMenu}
              className={`px-3 py-2.5 rounded font-label-lg text-label-lg uppercase tracking-wider transition-colors ${
                isLeaderboard
                  ? "bg-surface-container-high text-primary-fixed font-bold border-l-2 border-primary"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container/40"
              }`}
            >
              ▸ Salón de la Fama
            </Link>
            <Link
              href="/about"
              onClick={closeMobileMenu}
              className={`px-3 py-2.5 rounded font-label-lg text-label-lg uppercase tracking-wider transition-colors ${
                isAbout
                  ? "bg-surface-container-high text-primary-fixed font-bold border-l-2 border-primary"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container/40"
              }`}
            >
              ▸ Acerca de
            </Link>

            {/* Sesión en Mobile */}
            {user ? (
              <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant/30 mt-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-surface-container rounded border border-primary-container/30">
                  <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse shadow-[0_0_6px_#00f5ff]" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono text-[10px] text-outline uppercase tracking-widest">
                      PILOTO ACTIVO
                    </span>
                    <span className="font-title-sm text-title-sm text-primary uppercase font-bold truncate">
                      {user.gamerTag}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded font-label-md text-label-md uppercase tracking-wider text-secondary-container hover:bg-secondary-container/10 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>✕ Cerrar Sesión</span>
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                onClick={closeMobileMenu}
                className={`px-3 py-2.5 rounded font-label-lg text-label-lg uppercase tracking-wider transition-colors ${
                  isAuth
                    ? "bg-surface-container-high text-secondary font-bold border-l-2 border-secondary"
                    : "text-on-surface-variant hover:text-secondary hover:bg-surface-container/40"
                }`}
              >
                ▸ Iniciar Sesión / Registro
              </Link>
            )}
          </nav>
        </div>

        <div className="pt-4 border-t border-outline-variant/30 flex flex-col gap-2">
          <div className="font-mono text-[11px] text-on-surface-variant tracking-wider uppercase text-center">
            CRÉDITOS DISPONIBLES: {credits.toString().padStart(2, "0")}
          </div>
          <div className="font-mono text-[10px] text-outline text-center">
            ARCADE VAULT • 2026
          </div>
        </div>
      </aside>
    </>
  );
};
