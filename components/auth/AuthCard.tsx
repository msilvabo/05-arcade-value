"use client";

import { FC, useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const AuthCard: FC = () => {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [gamerTag, setGamerTag] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);

  // Calcula nivel de seguridad de contraseña (1 a 4)
  const calculateSecurity = (pass: string) => {
    let score = 0;
    if (pass.length > 5) score++;
    if (pass.length > 8) score++;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const securityScore = calculateSecurity(password);
  const securityLabel =
    securityScore === 0
      ? "VACÍA"
      : securityScore === 1
      ? "BAJA"
      : securityScore === 2
      ? "MEDIA"
      : securityScore === 3
      ? "ALTA"
      : "MÁXIMA";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (authMode === "register" && password !== confirmPassword) {
      setNotification("⚠️ LAS CONTRASEÑAS NO COINCIDEN");
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const msg =
      authMode === "login"
        ? `¡BIENVENIDO DE VUELTA, ${gamerTag.toUpperCase() || "PILOTO"}! ACCEDIENDO AL VAULT...`
        : `¡REGISTRO EXITOSO, ${gamerTag.toUpperCase() || "PILOTO"}! BONO +100 CRÉDITOS ACTIVADO.`;

    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
      router.push("/");
    }, 1800);
  };

  const playAsGuest = () => {
    setNotification("🎮 MODO INVITADO ACTIVADO // CRÉDITOS LOCALES LISTOS");
    setTimeout(() => {
      setNotification(null);
      router.push("/");
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    setNotification(`⚡ VINCULANDO CONEXIÓN SEGURA ${provider.toUpperCase()}...`);
    setTimeout(() => {
      setNotification(null);
      router.push("/");
    }, 1500);
  };

  return (
    <div className="w-full max-w-lg bg-surface-container-low p-space-lg rounded shadow-[0_0_24px_rgba(0,245,255,0.25)] relative z-10 border border-primary-container/20">
      {/* Notificación flotante retro */}
      {notification && (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-full max-w-md px-4 py-2 bg-tertiary-container text-on-tertiary font-title-sm text-center rounded shadow-[0_0_20px_rgba(222,231,0,0.8)] border border-tertiary uppercase tracking-wider animate-bounce z-50">
          {notification}
        </div>
      )}

      {/* Telemetría ambiental superior */}
      <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/30">
        <div className="flex items-center gap-space-xs">
          <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse shadow-[0_0_8px_#00f5ff]"></span>
          <span className="font-label-sm text-label-sm text-primary tracking-widest uppercase">
            TERMINAL://ONLINE_
          </span>
        </div>
        <div className="font-label-sm text-label-sm text-tertiary-fixed tracking-widest">
          CRÉDITOS: [99] // REV. 1984
        </div>
      </div>

      {/* Header Card / Logo HUD */}
      <header className="text-center pt-space-md pb-space-md">
        <div className="inline-block relative">
          <Link href="/" className="group block">
            <h1 className="font-display-lg text-display-lg text-primary tracking-wider uppercase drop-shadow-[0_0_16px_rgba(0,245,255,0.7)] group-hover:text-primary-fixed transition-colors">
              ARCADE VAULT
            </h1>
          </Link>
          <span className="absolute -right-4 -top-1 font-label-sm text-label-sm text-secondary-container bg-surface-container-highest px-1 rounded shadow-[0_0_6px_#ff4d80]">
            V2.4
          </span>
        </div>
        <div className="mt-space-xs font-title-sm text-title-sm text-primary-fixed tracking-wide uppercase flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-primary-container">
            videogame_asset
          </span>
          SISTEMA DE IDENTIFICACIÓN DE PILOTOS ARCADE
          <span className="material-symbols-outlined text-[16px] text-primary-container">
            videogame_asset
          </span>
        </div>
        <p className="mt-space-xs font-body-sm text-body-sm text-on-surface-variant max-w-sm mx-auto tracking-normal">
          INICIA SESIÓN PARA SINCRONIZAR TUS RÉCORDS Y COMPETIR EN EL SALÓN DE LA FAMA
        </p>
      </header>

      {/* Selectores de Pestañas Retro */}
      <div className="grid grid-cols-2 gap-space-xs p-1 bg-surface-container-lowest rounded mb-space-lg shadow-inner">
        <button
          type="button"
          onClick={() => setAuthMode("login")}
          className={`py-space-sm px-space-md font-label-lg text-label-lg uppercase rounded transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer font-bold ${
            authMode === "login"
              ? "bg-primary-container text-on-primary shadow-[0_0_14px_rgba(0,245,255,0.6)]"
              : "bg-transparent text-primary-fixed-dim hover:bg-surface-container"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">key</span>
          INICIAR SESIÓN
        </button>
        <button
          type="button"
          onClick={() => setAuthMode("register")}
          className={`py-space-sm px-space-md font-label-lg text-label-lg uppercase rounded transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer font-bold ${
            authMode === "register"
              ? "bg-secondary-container text-on-secondary shadow-[0_0_14px_rgba(255,77,128,0.6)]"
              : "bg-transparent text-secondary-container hover:bg-secondary-container/10"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
          CREAR CUENTA
        </button>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
        {/* GamerTag */}
        <div className="flex flex-col gap-space-xs">
          <div className="flex justify-between items-center">
            <label
              htmlFor="gamertag"
              className="font-label-md text-label-md text-primary tracking-widest uppercase flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[15px] text-primary-container">
                sports_esports
              </span>
              USUARIO / GAMERTAG
            </label>
            <span className="font-label-sm text-label-sm text-outline-variant">
              ID REQUERIDO
            </span>
          </div>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-outline text-[20px] pointer-events-none">
              badge
            </span>
            <input
              id="gamertag"
              type="text"
              required
              value={gamerTag}
              onChange={(e) => setGamerTag(e.target.value)}
              placeholder="ej. PixelWarrior88"
              className="w-full bg-surface-container-lowest text-primary font-body-md text-body-md py-space-sm pl-10 pr-space-md rounded outline-none placeholder:text-outline-variant transition-all duration-150 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] focus:shadow-[0_0_12px_rgba(0,245,255,0.5),inset_0_0_8px_rgba(0,245,255,0.2)] focus:bg-surface-container-high border border-outline-variant/40 focus:border-primary-container"
            />
          </div>
        </div>

        {/* Contraseña / Clave de Acceso */}
        <div className="flex flex-col gap-space-xs">
          <div className="flex justify-between items-center">
            <label
              htmlFor="password"
              className="font-label-md text-label-md text-primary tracking-widest uppercase flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[15px] text-primary-container">
                lock
              </span>
              CONTRASEÑA
            </label>
            {authMode === "login" && (
              <a
                href="#reset"
                onClick={(e) => {
                  e.preventDefault();
                  setNotification("TRANSMISIÓN DE RECUPERACIÓN ENVIADA AL DISPOSITIVO");
                  setTimeout(() => setNotification(null), 3000);
                }}
                className="font-label-sm text-label-sm text-secondary-container hover:text-secondary-fixed transition-colors underline decoration-secondary-container/40"
              >
                ¿OLVIDASTE TU CÓDIGO?
              </a>
            )}
          </div>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-outline text-[20px] pointer-events-none">
              password
            </span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-surface-container-lowest text-primary font-body-md text-body-md py-space-sm pl-10 pr-10 rounded outline-none placeholder:text-outline-variant transition-all duration-150 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] focus:shadow-[0_0_12px_rgba(0,245,255,0.5),inset_0_0_8px_rgba(0,245,255,0.2)] focus:bg-surface-container-high border border-outline-variant/40 focus:border-primary-container"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-outline hover:text-primary transition-colors cursor-pointer flex items-center"
              title="Alternar visibilidad"
            >
              <span className="material-symbols-outlined text-[18px]">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>

          {/* Medidor de Seguridad Retro */}
          <div className="flex items-center gap-1.5 pt-1">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider text-[10px]">
              SEGURIDAD:
            </span>
            <div className="flex-1 grid grid-cols-4 gap-1 h-1.5 bg-surface-container-lowest p-0.5 rounded">
              <div
                className={`rounded-sm transition-colors duration-200 ${
                  securityScore >= 1 ? "bg-secondary-container" : "bg-surface-container-highest"
                }`}
              />
              <div
                className={`rounded-sm transition-colors duration-200 ${
                  securityScore >= 2 ? "bg-tertiary-container" : "bg-surface-container-highest"
                }`}
              />
              <div
                className={`rounded-sm transition-colors duration-200 ${
                  securityScore >= 3 ? "bg-primary-container" : "bg-surface-container-highest"
                }`}
              />
              <div
                className={`rounded-sm transition-colors duration-200 ${
                  securityScore >= 4 ? "bg-green-400" : "bg-surface-container-highest"
                }`}
              />
            </div>
            <span className="font-label-sm text-label-sm text-outline uppercase text-[10px] w-12 text-right">
              {securityLabel}
            </span>
          </div>
        </div>

        {/* Campo adicional: Confirmar Contraseña (solo modo registro) */}
        {authMode === "register" && (
          <div className="flex flex-col gap-space-xs">
            <label
              htmlFor="confirm-password"
              className="font-label-md text-label-md text-secondary-container tracking-widest uppercase flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[15px]">verified_user</span>
              CONFIRMAR CONTRASEÑA
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-outline text-[20px] pointer-events-none">
                lock_reset
              </span>
              <input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-surface-container-lowest text-primary font-body-md text-body-md py-space-sm pl-10 pr-space-md rounded outline-none placeholder:text-outline-variant transition-all duration-150 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] focus:shadow-[0_0_12px_rgba(255,77,128,0.5)] focus:bg-surface-container-high border border-outline-variant/40 focus:border-secondary-container"
              />
            </div>
          </div>
        )}

        {/* Checkbox Recordar Terminal */}
        <div className="flex items-center justify-between pt-space-xs">
          <label className="flex items-center gap-space-sm cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-4 h-4 rounded bg-surface-container-lowest border border-outline-variant flex items-center justify-center transition-all peer-checked:bg-primary-container peer-checked:border-primary-container peer-checked:shadow-[0_0_8px_#00f5ff] group-hover:bg-surface-container-highest">
              <span className="material-symbols-outlined text-[14px] text-on-primary font-bold opacity-0 peer-checked:opacity-100 transition-opacity">
                check
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant group-hover:text-primary transition-colors tracking-wide uppercase">
              [X] RECORDAR ESTE TERMINAL ARCADE
            </span>
          </label>
        </div>

        {/* Botón Principal de Envío */}
        <button
          type="submit"
          className={`w-full relative overflow-hidden py-space-md px-space-lg rounded font-headline-md text-headline-md tracking-wider uppercase transition-all duration-100 cursor-pointer flex items-center justify-center gap-space-sm group ${
            authMode === "login"
              ? "bg-primary-container text-on-primary shadow-[0_0_20px_rgba(0,245,255,0.65)] hover:shadow-[0_0_30px_rgba(0,245,255,0.9)] hover:scale-[1.01] active:translate-y-0.5"
              : "bg-secondary-container text-on-secondary shadow-[0_0_20px_rgba(255,77,128,0.65)] hover:shadow-[0_0_30px_rgba(255,77,128,0.9)] hover:scale-[1.01] active:translate-y-0.5"
          }`}
        >
          <span className="material-symbols-outlined text-[24px] group-hover:rotate-12 transition-transform">
            bolt
          </span>
          <span>{authMode === "login" ? "ENTRAR AL VAULT" : "REGISTRAR PILOTO"}</span>
          <span className="font-label-sm text-label-sm bg-surface-tint/30 px-1.5 py-0.5 rounded tracking-normal ml-1">
            PRESS START
          </span>
        </button>
      </form>

      {/* Acción Especial: Jugar como Invitado */}
      <div className="mt-space-md p-space-sm bg-surface-container rounded shadow-sm hover:bg-surface-container-high transition-colors border border-outline-variant/30">
        <button
          type="button"
          onClick={playAsGuest}
          className="w-full text-left flex items-start gap-space-sm cursor-pointer group"
        >
          <div className="p-2 rounded bg-tertiary-container text-on-tertiary shadow-[0_0_12px_rgba(222,231,0,0.5)] shrink-0">
            <span className="material-symbols-outlined text-[24px]">sports_esports</span>
          </div>
          <div className="flex-1">
            <div className="font-label-lg text-label-lg text-tertiary uppercase flex items-center justify-between group-hover:text-tertiary-fixed transition-colors">
              <span>🎮 JUGAR COMO INVITADO (SIN CUENTA)</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-snug">
              Acceso instantáneo a todos los juegos. Tus puntuaciones se guardarán únicamente en la memoria local (localStorage) de este dispositivo.
            </p>
          </div>
        </button>
      </div>

      {/* Divisor Luminoso Neón */}
      <div className="relative my-space-lg flex items-center justify-center">
        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-primary-container/40 to-transparent"></div>
        <span className="absolute px-space-sm bg-surface-container-low font-label-sm text-label-sm text-primary tracking-widest uppercase">
          O CONÉCTATE CON TUS REDES
        </span>
      </div>

      {/* Botones Sociales 8-Bit */}
      <div className="grid grid-cols-2 gap-space-sm">
        <button
          type="button"
          onClick={() => handleSocialLogin("Google")}
          className="py-space-sm px-space-md bg-surface-container hover:bg-surface-container-high rounded text-primary transition-all duration-150 flex items-center justify-center gap-space-xs font-label-md text-label-md uppercase tracking-wider shadow-sm hover:shadow-[0_0_12px_rgba(255,255,255,0.15)] cursor-pointer active:translate-y-0.5 border border-outline-variant/30"
        >
          <svg className="w-4 h-4 fill-current text-secondary-container" viewBox="0 0 24 24">
            <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
          </svg>
          GOOGLE
        </button>

        <button
          type="button"
          onClick={() => handleSocialLogin("GitHub")}
          className="py-space-sm px-space-md bg-surface-container hover:bg-surface-container-high rounded text-primary transition-all duration-150 flex items-center justify-center gap-space-xs font-label-md text-label-md uppercase tracking-wider shadow-sm hover:shadow-[0_0_12px_rgba(255,255,255,0.15)] cursor-pointer active:translate-y-0.5 border border-outline-variant/30"
        >
          <svg className="w-4 h-4 fill-current text-primary-container" viewBox="0 0 24 24">
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
          GITHUB
        </button>
      </div>

      {/* Bonus Promo Banner */}
      <div className="mt-space-lg p-space-sm rounded bg-surface-container-lowest flex items-center gap-space-sm shadow-inner border border-outline-variant/20">
        <div className="w-8 h-8 rounded bg-secondary-container/20 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-secondary-container text-[20px] animate-pulse">
            monetization_on
          </span>
        </div>
        <div className="flex-1 font-body-sm text-body-sm text-on-surface">
          {authMode === "login" ? (
            <>
              ¿No tienes una cuenta aún?{" "}
              <button
                type="button"
                onClick={() => setAuthMode("register")}
                className="font-label-sm text-label-sm text-tertiary-fixed underline tracking-wider hover:text-tertiary cursor-pointer inline"
              >
                REGÍSTRATE GRATIS Y RECIBE 100 CRÉDITOS VIRTUALES
              </button>
            </>
          ) : (
            <>
              ¿Ya eres un piloto registrado?{" "}
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className="font-label-sm text-label-sm text-primary-fixed underline tracking-wider hover:text-primary cursor-pointer inline"
              >
                INICIA SESIÓN AQUÍ
              </button>
            </>
          )}
        </div>
      </div>

      {/* Enlaces al pie del terminal */}
      <footer className="mt-space-md pt-space-xs text-center flex flex-wrap items-center justify-center gap-x-space-md gap-y-1 font-label-sm text-label-sm text-outline">
        <Link href="/" className="hover:text-primary transition-colors uppercase tracking-widest text-primary-fixed-dim">
          ← VOLVER A LA BIBLIOTECA
        </Link>
        <span className="text-outline-variant">•</span>
        <span className="uppercase tracking-widest">ARCADE VAULT SECURE TERMINAL</span>
      </footer>
    </div>
  );
};
